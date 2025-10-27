import { NextRequest, NextResponse } from 'next/server'
import { getAllResumes, getAllJobs, createMatch } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const { resumeId, jobId } = await request.json()

    // If specific resume and job provided
    if (resumeId && jobId) {
      return await matchSingle(resumeId, jobId)
    }

    // Otherwise, match all resumes against all jobs
    const resumes = await getAllResumes()
    const jobs = await getAllJobs()

    if (resumes.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No resumes found' },
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

    // Match each resume against each job
    for (const resume of resumes) {
      if (!resume.extractedText) {
        errors.push(`Resume ${resume.candidateName} has no extracted text`)
        continue
      }

      for (const job of jobs) {
        try {
          await matchSingle(
            resume._id.toString(),
            job._id.toString(),
            resume,
            job
          )
          totalMatches++
        } catch (error) {
          errors.push(
            `Failed to match ${resume.candidateName} with ${job.title}: ${error}`
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${totalMatches} matches`,
      data: {
        totalMatches,
        totalResumes: resumes.length,
        totalJobs: jobs.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    })
  } catch (error) {
    console.error('Auto-match error:', error)
    return NextResponse.json(
      { success: false, message: 'Auto-match failed' },
      { status: 500 }
    )
  }
}

async function matchSingle(
  resumeId: string,
  jobId: string,
  resumeData?: any,
  jobData?: any
) {
  const { getResumeById, getJobById } = await import('@/lib/db-utils')

  const resume = resumeData || (await getResumeById(resumeId))
  const job = jobData || (await getJobById(jobId))

  if (!resume || !job) {
    throw new Error('Resume or job not found')
  }

  if (!resume.extractedText) {
    throw new Error('Resume has no extracted text')
  }

  // Call NLP service for similarity calculation
  const nlpResponse = await fetch(
    `${process.env.NLP_SERVICE_URL}/calculate-similarity`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume_text: resume.extractedText,
        job_description: `${job.description} ${job.requirements || ''}`,
      }),
    }
  )

  if (!nlpResponse.ok) {
    throw new Error('NLP service failed')
  }

  const similarityData = await nlpResponse.json()

  // Save match result
  const matchData = {
    resumeId,
    jobId,
    candidateName: resume.candidateName,
    candidateEmail: resume.email,
    jobTitle: job.title,
    score: similarityData.similarity_score,
    matchedKeywords: similarityData.matched_keywords || [],
    missingKeywords: similarityData.missing_keywords || [],
    resumeKeywords: similarityData.resume_keywords || [],
    jobKeywords: similarityData.job_keywords || [],
  }

  await createMatch(matchData)

  return matchData
}