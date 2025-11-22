import { NextRequest, NextResponse } from 'next/server'
import {
  getAllResumes,
  getAllJobs,
  getResumeById,
  getJobById,
  upsertMatch,
} from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    let jobId: string | undefined
    let resumeId: string | undefined

    // Parse request body safely
    try {
      const body = await request.json()
      jobId = body?.jobId
      resumeId = body?.resumeId
    } catch {
      // Empty body is allowed
    }

    // ========== SCENARIO 1: Match ALL resumes against ONE job ==========
    if (jobId && !resumeId) {
      console.log(`🎯 Matching all resumes to job: ${jobId}`)
      
      const [resumes, job] = await Promise.all([
        getAllResumes(),
        getJobById(jobId)
      ])

      if (!job) {
        return NextResponse.json(
          { success: false, message: 'Job not found' },
          { status: 404 }
        )
      }

      let totalMatches = 0
      const errors: string[] = []

      for (const resume of resumes) {
        if (!resume?.extractedText?.trim()) {
          console.warn(`⚠️ Skipping ${resume.candidateName} - no extracted text`)
          continue
        }

        try {
          const nlpResponse = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resume_text: resume.extractedText,
              job_description: `Job Title: ${job.title}\n\n${job.description}\n\n${job.requirements || ''}`
            }),
          })

          if (!nlpResponse.ok) {
            throw new Error(`NLP service returned ${nlpResponse.status}`)
          }

          const similarity = await nlpResponse.json()

          await upsertMatch({
            resumeId: resume._id.toString(),
            jobId,
            candidateName: resume.candidateName,
            candidateEmail: resume.email,
            jobTitle: job.title,
            score: similarity.similarity_score,
            matchedKeywords: similarity.matched_keywords || [],
            missingKeywords: similarity.missing_keywords || [],
            resumeKeywords: similarity.resume_keywords || [],
            jobKeywords: similarity.job_keywords || [],
          })

          totalMatches++
          console.log(`  ✅ ${resume.candidateName}: ${(similarity.similarity_score * 100).toFixed(1)}%`)
        } catch (error) {
          const errorMsg = `Failed to match ${resume.candidateName}: ${error instanceof Error ? error.message : 'Unknown error'}`
          errors.push(errorMsg)
          console.error(`  ❌ ${errorMsg}`)
        }
      }

      return NextResponse.json({
        success: true,
        message: `Matched ${totalMatches} resume(s) to "${job.title}"`,
        data: {
          totalMatches,
          totalResumes: resumes.length,
          totalJobs: 1,
          errors: errors.length > 0 ? errors : undefined
        },
      })
    }

    // ========== SCENARIO 2: Match ONE resume against ALL jobs ==========
    if (resumeId && !jobId) {
      console.log(`🎯 Matching resume ${resumeId} to all jobs`)
      
      const [resume, jobs] = await Promise.all([
        getResumeById(resumeId),
        getAllJobs()
      ])

      if (!resume) {
        return NextResponse.json(
          { success: false, message: 'Resume not found' },
          { status: 404 }
        )
      }

      if (!resume?.extractedText?.trim()) {
        return NextResponse.json(
          { success: false, message: 'Resume has no extracted text' },
          { status: 400 }
        )
      }

      if (jobs.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No job descriptions found' },
          { status: 400 }
        )
      }

      let totalMatches = 0
      const errors: string[] = []

      for (const job of jobs) {
        try {
          const nlpResponse = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resume_text: resume.extractedText,
              job_description: `Job Title: ${job.title}\n\n${job.description}\n\n${job.requirements || ''}`
            }),
          })

          if (!nlpResponse.ok) {
            throw new Error(`NLP service returned ${nlpResponse.status}`)
          }

          const similarity = await nlpResponse.json()

          await upsertMatch({
            resumeId,
            jobId: job._id.toString(),
            candidateName: resume.candidateName,
            candidateEmail: resume.email,
            jobTitle: job.title,
            score: similarity.similarity_score,
            matchedKeywords: similarity.matched_keywords || [],
            missingKeywords: similarity.missing_keywords || [],
            resumeKeywords: similarity.resume_keywords || [],
            jobKeywords: similarity.job_keywords || [],
          })

          totalMatches++
          console.log(`  ✅ ${job.title}: ${(similarity.similarity_score * 100).toFixed(1)}%`)
        } catch (error) {
          const errorMsg = `Failed to match with ${job.title}: ${error instanceof Error ? error.message : 'Unknown error'}`
          errors.push(errorMsg)
          console.error(`  ❌ ${errorMsg}`)
        }
      }

      return NextResponse.json({
        success: true,
        message: `Matched "${resume.candidateName}" to ${totalMatches} job(s)`,
        data: {
          totalMatches,
          totalResumes: 1,
          totalJobs: jobs.length,
          errors: errors.length > 0 ? errors : undefined
        },
      })
    }

    // ========== SCENARIO 3: Match ONE specific resume-job pair ==========
    if (resumeId && jobId) {
      console.log(`🎯 Matching resume ${resumeId} with job ${jobId}`)
      
      const result = await matchSingle(resumeId, jobId)
      
      return NextResponse.json({
        success: true,
        message: 'Match created/updated successfully',
        data: {
          totalMatches: 1,
          match: result
        },
      })
    }

    // ========== SCENARIO 4: No parameters provided ==========
    return NextResponse.json(
      {
        success: false,
        message: 'Missing parameters. Provide either:\n- jobId (to match all resumes to one job)\n- resumeId (to match one resume to all jobs)\n- both resumeId and jobId (to match specific pair)'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ Auto-match error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Auto-match failed',
        error: process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.stack : String(error))
          : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * Match a single resume with a single job
 */
async function matchSingle(
  resumeId: string,
  jobId: string,
  resumeData?: any,
  jobData?: any
) {
  // Fetch data if not provided
  const resume = resumeData || (await getResumeById(resumeId))
  const job = jobData || (await getJobById(jobId))

  // Validation
  if (!resume) {
    throw new Error(`Resume not found: ${resumeId}`)
  }

  if (!job) {
    throw new Error(`Job not found: ${jobId}`)
  }

  if (!resume?.extractedText?.trim()) {
    throw new Error(`Resume "${resume.candidateName}" has no extracted text`)
  }

  // Prepare job text
  const jobText = `Job Title: ${job.title}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements || 'Not specified'}`

  // Call NLP service
  const nlpResponse = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resume_text: resume.extractedText,
      job_description: jobText
    }),
  })

  if (!nlpResponse.ok) {
    const errorText = await nlpResponse.text()
    console.error(`NLP service error (${nlpResponse.status}):`, errorText)
    throw new Error(`NLP service failed with status ${nlpResponse.status}`)
  }

  const similarity = await nlpResponse.json()

  if (!similarity.success) {
    throw new Error('NLP service returned unsuccessful response')
  }

  // Upsert match (prevents duplicates)
  await upsertMatch({
    resumeId,
    jobId,
    candidateName: resume.candidateName,
    candidateEmail: resume.email,
    jobTitle: job.title,
    score: similarity.similarity_score,
    matchedKeywords: similarity.matched_keywords || [],
    missingKeywords: similarity.missing_keywords || [],
    resumeKeywords: similarity.resume_keywords || [],
    jobKeywords: similarity.job_keywords || [],
  })

  return {
    resumeId,
    jobId,
    candidateName: resume.candidateName,
    jobTitle: job.title,
    score: similarity.similarity_score,
    matchedKeywords: similarity.matched_keywords || [],
    missingKeywords: similarity.missing_keywords || [],
  }
}