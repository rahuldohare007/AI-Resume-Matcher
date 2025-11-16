// import { NextRequest, NextResponse } from 'next/server'
// import { createResume } from '@/lib/db-utils'

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { 
//       candidateName, 
//       email, 
//       fileUrl, 
//       cloudinaryPublicId, 
//       fileFormat, 
//       fileName,
//       extractedText  // ✅ Received from frontend
//     } = body

//     console.log('📝 Upload request received for:', candidateName)

//     // Validation
//     if (!candidateName || !email || !fileUrl) {
//       return NextResponse.json(
//         { success: false, message: 'Missing required fields: candidateName, email, or fileUrl' },
//         { status: 400 }
//       )
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid email address format' },
//         { status: 400 }
//       )
//     }

//     // Use extracted text from frontend
//     const textToSave = extractedText || ''

//     if (!textToSave || textToSave.trim().length === 0) {
//       console.warn('⚠️  No extracted text provided')
//     } else {
//       console.log(`✅ Extracted text received: ${textToSave.length} characters`)
//     }

//     // Save to database
//     console.log('💾 Saving resume to database...')
    
//     const resumeData = {
//       candidateName,
//       email,
//       fileUrl,
//       cloudinaryPublicId,
//       fileFormat,
//       fileName,
//       extractedText: textToSave,
//     }

//     const result = await createResume(resumeData)
//     console.log(`✅ Resume saved successfully with ID: ${result.insertedId.toString()}`)

//     return NextResponse.json({
//       success: true,
//       message: 'Resume uploaded successfully',
//       data: {
//         resumeId: result.insertedId.toString(),
//         fileUrl,
//         extractedText: textToSave ? `${textToSave.substring(0, 150)}...` : 'No text extracted',
//         candidateName,
//         email,
//         hasText: textToSave.length > 0,
//         textLength: textToSave.length,
//       },
//     })

//   } catch (error) {
//     console.error('❌ Upload error:', error)
    
//     // Specific error handling
//     if (error instanceof Error) {
//       // MongoDB connection errors
//       if (error.message.includes('ENOTFOUND') || 
//           error.message.includes('SSL') || 
//           error.message.includes('MongoServerSelectionError')) {
//         return NextResponse.json(
//           { 
//             success: false, 
//             message: 'Database connection failed. Please check MongoDB connection and try again.' 
//           },
//           { status: 500 }
//         )
//       }
//     }
    
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: error instanceof Error ? error.message : 'Upload failed' 
//       },
//       { status: 500 }
//     )
//   }
// }

// import { NextRequest, NextResponse } from 'next/server'

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { candidateName, email, fileUrl, cloudinaryPublicId, fileFormat, fileName, extractedText } = body

//     if (!candidateName || !email || !fileUrl) {
//       return NextResponse.json(
//         { success: false, message: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid email address' },
//         { status: 400 }
//       )
//     }

//     // Dynamic import avoids stale/cyclic bundling issues
//     const { createResume } = await import('@/lib/db-utils')

//     const resumeData = {
//       candidateName,
//       email,
//       fileUrl,
//       cloudinaryPublicId,
//       fileFormat,
//       fileName,
//       extractedText: extractedText || '',
//     }

//     const result = await createResume(resumeData)

//     return NextResponse.json({
//       success: true,
//       message: 'Resume uploaded successfully',
//       data: {
//         resumeId: result.insertedId.toString(),
//         fileUrl,
//         extractedText: (extractedText || '').slice(0, 150) + ((extractedText || '').length > 150 ? '...' : ''),
//         candidateName,
//         email,
//         hasText: !!extractedText && extractedText.length > 0,
//         textLength: extractedText ? extractedText.length : 0,
//       },
//     })
//   } catch (error) {
//     console.error('❌ Upload error:', error)
//     return NextResponse.json(
//       {
//         success: false,
//         message: error instanceof Error ? error.message : 'Upload failed',
//       },
//       { status: 500 }
//     )
//   }
// }

// import { NextRequest, NextResponse } from 'next/server'

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { candidateName, email, fileUrl, cloudinaryPublicId, fileFormat, fileName, extractedText } = body

//     if (!candidateName || !email || !fileUrl) {
//       return NextResponse.json(
//         { success: false, message: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid email address' },
//         { status: 400 }
//       )
//     }

//     // Dynamic import
//     const { createResume } = await import('@/lib/db-utils')

//     const resumeData = {
//       candidateName,
//       email,
//       fileUrl,
//       cloudinaryPublicId,
//       fileFormat,
//       fileName,
//       extractedText: extractedText || '',
//     }

//     const result = await createResume(resumeData)
//     const newResumeId = result.insertedId.toString()

//     // ✅ AUTO-MATCH: Match this new resume against all existing jobs
//     console.log(`🎯 Auto-matching resume ${newResumeId} (${candidateName}) against all jobs...`)
    
//     try {
//       const matchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/match/auto`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ resumeId: newResumeId }), // ✅ Only match THIS resume
//       })

//       if (matchResponse.ok) {
//         const matchData = await matchResponse.json()
//         console.log(`✅ Auto-match completed: ${matchData.data?.totalMatches || 0} matches created`)
//       } else {
//         console.warn('⚠️ Auto-match failed, but resume was uploaded successfully')
//       }
//     } catch (matchError) {
//       console.error('❌ Auto-match error:', matchError)
//       // Don't fail the upload if matching fails
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Resume uploaded and matched successfully',
//       data: {
//         resumeId: newResumeId,
//         fileUrl,
//         extractedText: (extractedText || '').slice(0, 150) + ((extractedText || '').length > 150 ? '...' : ''),
//         candidateName,
//         email,
//         hasText: !!extractedText && extractedText.length > 0,
//         textLength: extractedText ? extractedText.length : 0,
//       },
//     })
//   } catch (error) {
//     console.error('❌ Upload error:', error)
//     return NextResponse.json(
//       {
//         success: false,
//         message: error instanceof Error ? error.message : 'Upload failed',
//       },
//       { status: 500 }
//     )
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { createResume, getAllJobs, upsertMatch } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { candidateName, email, fileUrl, cloudinaryPublicId, fileFormat, fileName, extractedText } = body

    if (!candidateName || !email || !fileUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      )
    }

    const resumeData = {
      candidateName,
      email,
      fileUrl,
      cloudinaryPublicId,
      fileFormat,
      fileName,
      extractedText: extractedText || '',
    }

    const result = await createResume(resumeData)
    const newResumeId = result.insertedId.toString()

    console.log(`✅ Resume saved: ${candidateName} (ID: ${newResumeId})`)

    // ========== AUTO-MATCH: Direct function call (no HTTP) ==========
    let matchCount = 0
    try {
      if (extractedText?.trim()) {
        const jobs = await getAllJobs()
        console.log(`🎯 Matching ${candidateName} against ${jobs.length} job(s)...`)

        for (const job of jobs) {
          try {
            const jobText = `Job Title: ${job.title}\n\n${job.description}\n\n${job.requirements || ''}`
            
            const nlpResponse = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resume_text: extractedText,
                job_description: jobText
              }),
            })

            if (nlpResponse.ok) {
              const similarity = await nlpResponse.json()
              
              // ✅ Direct upsertMatch call - no duplicates
              await upsertMatch({
                resumeId: newResumeId, // ✅ ONLY this resume
                jobId: job._id.toString(),
                candidateName,
                candidateEmail: email,
                jobTitle: job.title,
                score: similarity.similarity_score,
                matchedKeywords: similarity.matched_keywords || [],
                missingKeywords: similarity.missing_keywords || [],
                resumeKeywords: similarity.resume_keywords || [],
                jobKeywords: similarity.job_keywords || [],
              })
              
              matchCount++
              console.log(`  ✅ "${job.title}": ${(similarity.similarity_score * 100).toFixed(1)}%`)
            }
          } catch (jobErr) {
            console.error(`  ❌ Match failed for ${job.title}:`, jobErr)
          }
        }
        
        console.log(`✅ Matched ${matchCount}/${jobs.length} jobs for ${candidateName}`)
      } else {
        console.warn(`⚠️ No extracted text for ${candidateName}, skipping auto-match`)
      }
    } catch (matchError) {
      console.error('❌ Auto-match error:', matchError)
      // Don't fail the upload if matching fails
    }

    return NextResponse.json({
      success: true,
      message: `Resume uploaded${matchCount > 0 ? ` and matched with ${matchCount} job(s)` : ''}`,
      data: {
        resumeId: newResumeId,
        fileUrl,
        extractedText: (extractedText || '').slice(0, 150) + ((extractedText || '').length > 150 ? '...' : ''),
        candidateName,
        email,
        hasText: !!extractedText && extractedText.length > 0,
        textLength: extractedText ? extractedText.length : 0,
        matchesCreated: matchCount,
      },
    })
  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    )
  }
}

// ✅ Vercel config
export const runtime = 'nodejs'
export const maxDuration = 60