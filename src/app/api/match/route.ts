import { NextRequest, NextResponse } from 'next/server'
import { getResumeById, getJobById, createMatch } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeId, jobId } = body

    console.log(`🎯 Manual match request: Resume ${resumeId} with Job ${jobId}`)

    // Validation
    if (!resumeId || !jobId) {
      return NextResponse.json(
        { success: false, message: 'Both Resume ID and Job ID are required' },
        { status: 400 }
      )
    }

    // Fetch resume and job
    console.log('📥 Fetching resume and job from database...')
    const resume = await getResumeById(resumeId)
    const job = await getJobById(jobId)

    if (!resume) {
      console.error(`❌ Resume not found: ${resumeId}`)
      return NextResponse.json(
        { success: false, message: `Resume not found with ID: ${resumeId}` },
        { status: 404 }
      )
    }

    if (!job) {
      console.error(`❌ Job not found: ${jobId}`)
      return NextResponse.json(
        { success: false, message: `Job not found with ID: ${jobId}` },
        { status: 404 }
      )
    }

    console.log(`✅ Found resume: ${resume.candidateName}`)
    console.log(`✅ Found job: ${job.title}`)

    // Check if resume has extracted text
    if (!resume.extractedText || resume.extractedText.trim().length === 0) {
      console.error(`❌ Resume has no extracted text`)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Resume has no extracted text. Please re-upload the resume or check if the file contains readable text.' 
        },
        { status: 400 }
      )
    }

    // Prepare job description (include title)
    const jobText = `Job Title: ${job.title}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements || 'Not specified'}`

    console.log('📤 Sending to NLP service...')
    console.log(`   Resume text: ${resume.extractedText.length} characters`)
    console.log(`   Job text: ${jobText.length} characters`)

    // Call NLP service for similarity calculation
    const nlpUrl = `${process.env.NLP_SERVICE_URL}/calculate-similarity`
    
    const nlpResponse = await fetch(nlpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume_text: resume.extractedText,
        job_description: jobText,
      }),
    })

    if (!nlpResponse.ok) {
      const errorText = await nlpResponse.text()
      console.error(`❌ NLP service error (${nlpResponse.status}):`, errorText)
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to calculate similarity. NLP service returned status ${nlpResponse.status}` 
        },
        { status: 500 }
      )
    }

    const similarityData = await nlpResponse.json()

    if (!similarityData.success) {
      console.error('❌ NLP service returned unsuccessful response')
      return NextResponse.json(
        { success: false, message: 'NLP service failed to process the request' },
        { status: 500 }
      )
    }

    const scorePercent = (similarityData.similarity_score * 100).toFixed(1)
    console.log(`✅ Match calculated: ${scorePercent}%`)
    console.log(`   Matched keywords: ${similarityData.matched_keywords?.length || 0}`)
    console.log(`   Missing keywords: ${similarityData.missing_keywords?.length || 0}`)

    // Prepare match data
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

    // Save match result to database
    console.log('💾 Saving match to database...')
    await createMatch(matchData)
    console.log('✅ Match saved successfully')

    return NextResponse.json({
      success: true,
      message: `Match calculated: ${scorePercent}% similarity`,
      data: matchData,
    })

  } catch (error) {
    console.error('❌ Match calculation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to calculate match',
        error: process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.stack : String(error))
          : undefined
      },
      { status: 500 }
    )
  }
}