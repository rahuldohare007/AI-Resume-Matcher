import { NextRequest, NextResponse } from 'next/server'
import { createJob, getAllJobs, getAllResumes, upsertMatch } from '@/lib/db-utils'

// POST - Create new job description
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, requirements } = body

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      )
    }

    const jobData = {
      title,
      description,
      requirements: requirements || '',
    }

    const result = await createJob(jobData)
    const newJobId = result.insertedId.toString()

    console.log(`✅ Job created: ${title} (ID: ${newJobId})`)

    // ========== AUTO-MATCH: Match all resumes to THIS new job ==========
    let matchCount = 0
    try {
      const resumes = await getAllResumes()
      console.log(`🎯 Auto-matching ${resumes.length} resume(s) to "${title}"...`)

      const jobText = `Job Title: ${title}\n\n${description}\n\n${requirements || ''}`

      for (const resume of resumes) {
        if (!resume.extractedText?.trim()) {
          console.warn(`  ⚠️ Skipping ${resume.candidateName} - no extracted text`)
          continue
        }

        try {
          const nlpResponse = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resume_text: resume.extractedText,
              job_description: jobText
            }),
          })

          if (nlpResponse.ok) {
            const similarity = await nlpResponse.json()
            
            await upsertMatch({
              resumeId: resume._id.toString(),
              jobId: newJobId, // ✅ ONLY the new job
              candidateName: resume.candidateName,
              candidateEmail: resume.email,
              jobTitle: title,
              score: similarity.similarity_score,
              matchedKeywords: similarity.matched_keywords || [],
              missingKeywords: similarity.missing_keywords || [],
              resumeKeywords: similarity.resume_keywords || [],
              jobKeywords: similarity.job_keywords || [],
            })
            
            matchCount++
            console.log(`  ✅ ${resume.candidateName}: ${(similarity.similarity_score * 100).toFixed(1)}%`)
          }
        } catch (err) {
          console.error(`  ❌ Failed to match ${resume.candidateName}:`, err)
        }
      }

      console.log(`✅ Auto-match complete: ${matchCount}/${resumes.length} successful`)
    } catch (matchError) {
      console.error('❌ Auto-match error:', matchError)
      // Don't fail job creation if matching fails
    }

    return NextResponse.json({
      success: true,
      message: `Job created successfully${matchCount > 0 ? ` and matched with ${matchCount} resume(s)` : ''}`,
      data: {
        jobId: newJobId,
        title,
        description,
        requirements: requirements || '',
        matchesCreated: matchCount,
      },
    })
  } catch (error) {
    console.error('❌ Job creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save job description' },
      { status: 500 }
    )
  }
}

// GET - Fetch all job descriptions
export async function GET() {
  try {
    const jobs = await getAllJobs()

    return NextResponse.json({
      success: true,
      data: jobs.map((job) => ({
        id: job._id.toString(),
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        createdAt: job.createdAt,
      })),
    })
  } catch (error) {
    console.error('Fetch jobs error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}