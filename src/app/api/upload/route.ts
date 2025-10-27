import { NextRequest, NextResponse } from 'next/server'
import { downloadFromCloudinary } from '@/lib/cloudinary'
import { createResume } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { candidateName, email, fileUrl, cloudinaryPublicId, fileFormat, fileName } = body

    // Validation
    if (!candidateName || !email || !fileUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      )
    }

    let extractedText = ''

    // Try to extract text from resume using NLP service
    try {
      console.log('📥 Downloading file from Cloudinary...')
      const fileBuffer = await downloadFromCloudinary(fileUrl)
      console.log(`✅ Downloaded ${fileBuffer.length} bytes`)

      console.log('🔍 Extracting text from resume...')
      const nlpFormData = new FormData()
      nlpFormData.append('file', new Blob([fileBuffer]), `${fileName}.${fileFormat}`)

      const nlpResponse = await fetch(`${process.env.NLP_SERVICE_URL}/extract-text`, {
        method: 'POST',
        body: nlpFormData,
      })

      if (nlpResponse.ok) {
        const nlpData = await nlpResponse.json()
        extractedText = nlpData.text || ''
        console.log(`✅ Extracted ${extractedText.length} characters`)
      } else {
        const errorText = await nlpResponse.text()
        console.error('NLP service error:', errorText)
      }
    } catch (nlpError) {
      console.error('Text extraction error:', nlpError)
      // Continue even if text extraction fails
    }

    // Save to database
    console.log('💾 Saving to database...')
    const resumeData = {
      candidateName,
      email,
      fileUrl,
      cloudinaryPublicId,
      fileFormat,
      fileName,
      extractedText,
    }

    const result = await createResume(resumeData)
    console.log('✅ Resume saved successfully')

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeId: result.insertedId.toString(),
        fileUrl,
        extractedText: extractedText ? extractedText.substring(0, 200) + '...' : 'No text extracted',
        candidateName,
        email,
      },
    })
  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    )
  }
}