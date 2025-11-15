import { NextRequest, NextResponse } from 'next/server'
import { createResume } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      candidateName, 
      email, 
      fileUrl, 
      cloudinaryPublicId, 
      fileFormat, 
      fileName,
      extractedText  // ✅ Received from frontend
    } = body

    console.log('📝 Upload request received for:', candidateName)

    // Validation
    if (!candidateName || !email || !fileUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: candidateName, email, or fileUrl' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address format' },
        { status: 400 }
      )
    }

    // Use extracted text from frontend
    const textToSave = extractedText || ''

    if (!textToSave || textToSave.trim().length === 0) {
      console.warn('⚠️  No extracted text provided')
    } else {
      console.log(`✅ Extracted text received: ${textToSave.length} characters`)
    }

    // Save to database
    console.log('💾 Saving resume to database...')
    
    const resumeData = {
      candidateName,
      email,
      fileUrl,
      cloudinaryPublicId,
      fileFormat,
      fileName,
      extractedText: textToSave,
    }

    const result = await createResume(resumeData)
    console.log(`✅ Resume saved successfully with ID: ${result.insertedId.toString()}`)

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeId: result.insertedId.toString(),
        fileUrl,
        extractedText: textToSave ? `${textToSave.substring(0, 150)}...` : 'No text extracted',
        candidateName,
        email,
        hasText: textToSave.length > 0,
        textLength: textToSave.length,
      },
    })

  } catch (error) {
    console.error('❌ Upload error:', error)
    
    // Specific error handling
    if (error instanceof Error) {
      // MongoDB connection errors
      if (error.message.includes('ENOTFOUND') || 
          error.message.includes('SSL') || 
          error.message.includes('MongoServerSelectionError')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Database connection failed. Please check MongoDB connection and try again.' 
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    )
  }
}