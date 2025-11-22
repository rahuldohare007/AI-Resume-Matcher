import { NextRequest, NextResponse } from 'next/server'
import { getResumeById, getJobById, upsertMatch } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeId, jobId } = body

    if (!resumeId || !jobId) {
      return NextResponse.json(
        { success: false, message: 'Both Resume ID and Job ID are required' },
        { status: 400 }
      )
    }

    const [resume, job] = await Promise.all([getResumeById(resumeId), getJobById(jobId)])
    if (!resume) return NextResponse.json({ success: false, message: 'Resume not found' }, { status: 404 })
    if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 })
    if (!resume?.extractedText?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Resume has no extracted text' },
        { status: 400 }
      )
    }

    const jobText = `Job Title: ${job.title}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements || 'Not specified'}`
    const nlp = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: resume.extractedText, job_description: jobText }),
    })
    if (!nlp.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to calculate similarity' },
        { status: 500 }
      )
    }
    const s = await nlp.json()

    await upsertMatch({
      resumeId,
      jobId,
      candidateName: resume.candidateName,
      candidateEmail: resume.email,
      jobTitle: job.title,
      score: s.similarity_score,
      matchedKeywords: s.matched_keywords || [],
      missingKeywords: s.missing_keywords || [],
      resumeKeywords: s.resume_keywords || [],
      jobKeywords: s.job_keywords || [],
    })

    return NextResponse.json({
      success: true,
      message: 'Match calculated successfully',
      data: { resumeId, jobId, score: s.similarity_score },
    })
  } catch (error) {
    console.error('Match calculation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to calculate match' },
      { status: 500 }
    )
  }
}