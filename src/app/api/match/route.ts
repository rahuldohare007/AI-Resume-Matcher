import { NextRequest, NextResponse } from 'next/server'
import { getResumeById, getJobById, createMatch } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeId, jobId } = body

    if (!resumeId || !jobId) {
      return NextResponse.json(
        { success: false, message: 'Resume ID and Job ID are required' },
        { status: 400 }
      )
    }

    // Fetch resume and job
    const resume = await getResumeById(resumeId)
    const job = await getJobById(jobId)

    if (!resume) {
      return NextResponse.json(
        { success: false, message: 'Resume not found' },
        { status: 404 }
      )
    }

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }

    if (!resume.extractedText) {
      return NextResponse.json(
        { success: false, message: 'Resume has no extracted text' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { success: false, message: 'Failed to calculate similarity' },
        { status: 500 }
      )
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

    return NextResponse.json({
      success: true,
      message: 'Match calculated successfully',
      data: matchData,
    })
  } catch (error) {
    console.error('Match calculation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to calculate match' },
      { status: 500 }
    )
  }
}