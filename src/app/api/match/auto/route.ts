// import { NextRequest, NextResponse } from 'next/server'
// import { getAllResumes, getAllJobs, createMatch, getResumeById, getJobById } from '@/lib/db-utils'

// export async function POST(request: NextRequest) {
//   try {
//     // Parse JSON safely - handle empty body
//     let resumeId: string | undefined
//     let jobId: string | undefined

//     try {
//       const body = await request.json()
//       resumeId = body.resumeId
//       jobId = body.jobId
//     } catch (e) {
//       // No JSON body - that's okay, we'll match all
//       console.log('📋 No specific IDs provided, will auto-match all resumes and jobs')
//     }

//     // If specific resume and job provided, match just those
//     if (resumeId && jobId) {
//       console.log(`🎯 Matching specific: Resume ${resumeId} with Job ${jobId}`)
      
//       try {
//         const matchResult = await matchSingle(resumeId, jobId)
        
//         return NextResponse.json({
//           success: true,
//           message: 'Match created successfully',
//           data: {
//             totalMatches: 1,
//             totalResumes: 1,
//             totalJobs: 1,
//             matches: [matchResult],
//           },
//         })
//       } catch (error) {
//         console.error('❌ Single match error:', error)
//         return NextResponse.json(
//           { 
//             success: false, 
//             message: error instanceof Error ? error.message : 'Match failed' 
//           },
//           { status: 500 }
//         )
//       }
//     }

//     // Otherwise, match all resumes against all jobs
//     console.log('🔄 Starting auto-match for all resumes and jobs...')
    
//     const resumes = await getAllResumes()
//     const jobs = await getAllJobs()

//     console.log(`📊 Found ${resumes.length} resume(s) and ${jobs.length} job(s)`)

//     // Validation
//     if (resumes.length === 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'No resumes found. Please upload at least one resume first.' 
//         },
//         { status: 400 }
//       )
//     }

//     if (jobs.length === 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'No job descriptions found. Please create at least one job description first.' 
//         },
//         { status: 400 }
//       )
//     }

//     let totalMatches = 0
//     let skippedResumes = 0
//     const errors: string[] = []
//     const successfulMatches: any[] = []

//     // Match each resume against each job
//     for (const resume of resumes) {
//       // Validate extracted text
//       if (!resume.extractedText || resume.extractedText.trim().length === 0) {
//         skippedResumes++
//         const errorMsg = `Resume "${resume.candidateName}" has no extracted text - skipped`
//         errors.push(errorMsg)
//         console.warn(`⚠️ ${errorMsg}`)
//         continue
//       }

//       console.log(`\n👤 Processing resume: ${resume.candidateName}`)

//       for (const job of jobs) {
//         try {
//           console.log(`  🔍 Matching with job: ${job.title}`)
          
//           const matchResult = await matchSingle(
//             resume._id.toString(),
//             job._id.toString(),
//             resume,
//             job
//           )
          
//           successfulMatches.push(matchResult)
//           totalMatches++
          
//           const scorePercent = (matchResult.score * 100).toFixed(1)
//           console.log(`  ✅ Match score: ${scorePercent}%`)
          
//         } catch (error) {
//           const errorMsg = `Failed to match ${resume.candidateName} with ${job.title}: ${error instanceof Error ? error.message : 'Unknown error'}`
//           errors.push(errorMsg)
//           console.error(`  ❌ ${errorMsg}`)
//         }
//       }
//     }

//     console.log('\n' + '='.repeat(60))
//     console.log(`✅ Auto-match completed!`)
//     console.log(`   Total matches created: ${totalMatches}`)
//     console.log(`   Resumes processed: ${resumes.length - skippedResumes}/${resumes.length}`)
//     console.log(`   Jobs processed: ${jobs.length}`)
//     if (errors.length > 0) {
//       console.log(`   Warnings/Errors: ${errors.length}`)
//     }
//     console.log('='.repeat(60) + '\n')

//     return NextResponse.json({
//       success: true,
//       message: `Successfully created ${totalMatches} match${totalMatches !== 1 ? 'es' : ''}`,
//       data: {
//         totalMatches,
//         totalResumes: resumes.length,
//         totalJobs: jobs.length,
//         skippedResumes,
//         processedResumes: resumes.length - skippedResumes,
//         topMatches: successfulMatches
//           .sort((a, b) => b.score - a.score)
//           .slice(0, 5)
//           .map(m => ({
//             candidate: m.candidateName,
//             job: m.jobTitle,
//             score: m.score,
//           })),
//         errors: errors.length > 0 ? errors : undefined,
//       },
//     })

//   } catch (error) {
//     console.error('❌ Auto-match error:', error)
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: error instanceof Error ? error.message : 'Auto-match failed',
//         error: process.env.NODE_ENV === 'development' 
//           ? (error instanceof Error ? error.stack : String(error))
//           : undefined
//       },
//       { status: 500 }
//     )
//   }
// }

// /**
//  * Match a single resume with a single job
//  */
// async function matchSingle(
//   resumeId: string,
//   jobId: string,
//   resumeData?: any,
//   jobData?: any
// ) {
//   // Get resume and job if not provided
//   const resume = resumeData || (await getResumeById(resumeId))
//   const job = jobData || (await getJobById(jobId))

//   // Validation
//   if (!resume) {
//     throw new Error(`Resume not found: ${resumeId}`)
//   }

//   if (!job) {
//     throw new Error(`Job not found: ${jobId}`)
//   }

//   if (!resume.extractedText || resume.extractedText.trim().length === 0) {
//     throw new Error(`Resume for "${resume.candidateName}" has no extracted text`)
//   }

//   // Prepare job text (include title for better matching)
//   const jobText = `Job Title: ${job.title}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements || 'Not specified'}`

//   // Log what we're sending
//   if (process.env.NODE_ENV === 'development') {
//     console.log(`    📤 Sending to NLP service:`)
//     console.log(`       Resume text: ${resume.extractedText.length} chars`)
//     console.log(`       Job text: ${jobText.length} chars`)
//   }

//   // Call NLP service for similarity calculation
//   const nlpUrl = `${process.env.NLP_SERVICE_URL}/calculate-similarity`
  
//   const nlpResponse = await fetch(nlpUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       resume_text: resume.extractedText,
//       job_description: jobText,
//     }),
//   })

//   if (!nlpResponse.ok) {
//     const errorText = await nlpResponse.text()
//     console.error(`NLP service error (${nlpResponse.status}):`, errorText)
//     throw new Error(`NLP service failed with status ${nlpResponse.status}`)
//   }

//   const similarityData = await nlpResponse.json()

//   if (!similarityData.success) {
//     throw new Error('NLP service returned unsuccessful response')
//   }

//   // Prepare match data
//   const matchData = {
//     resumeId,
//     jobId,
//     candidateName: resume.candidateName,
//     candidateEmail: resume.email,
//     jobTitle: job.title,
//     score: similarityData.similarity_score,
//     matchedKeywords: similarityData.matched_keywords || [],
//     missingKeywords: similarityData.missing_keywords || [],
//     resumeKeywords: similarityData.resume_keywords || [],
//     jobKeywords: similarityData.job_keywords || [],
//   }

//   // Save to database
//   await createMatch(matchData)

//   return matchData
// }

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
    try {
      const body = await request.json()
      jobId = body?.jobId
      resumeId = body?.resumeId
    } catch {}

    // 1) Match all resumes against a single job
    if (jobId && !resumeId) {
      const [resumes, job] = await Promise.all([getAllResumes(), getJobById(jobId)])
      if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 })

      let totalMatches = 0
      for (const resume of resumes) {
        if (!resume?.extractedText?.trim()) continue
        const nlp = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_text: resume.extractedText,
            job_description: `Job Title: ${job.title}\n\n${job.description}\n\n${job.requirements || ''}`
          }),
        })
        if (!nlp.ok) continue
        const s = await nlp.json()
        await upsertMatch({
          resumeId: resume._id.toString(),
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
        totalMatches++
      }

      return NextResponse.json({
        success: true,
        message: `Matched all resumes to "${job.title}"`,
        data: { totalMatches, totalResumes: resumes.length, totalJobs: 1 },
      })
    }

    // 2) Match a single resume against all jobs
    if (resumeId && !jobId) {
      const [resume, jobs] = await Promise.all([getResumeById(resumeId), getAllJobs()])
      if (!resume) return NextResponse.json({ success: false, message: 'Resume not found' }, { status: 404 })

      let totalMatches = 0
      if (resume?.extractedText?.trim()) {
        for (const job of jobs) {
          const nlp = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resume_text: resume.extractedText,
              job_description: `Job Title: ${job.title}\n\n${job.description}\n\n${job.requirements || ''}`
            }),
          })
          if (!nlp.ok) continue
          const s = await nlp.json()
          await upsertMatch({
            resumeId,
            jobId: job._id.toString(),
            candidateName: resume.candidateName,
            candidateEmail: resume.email,
            jobTitle: job.title,
            score: s.similarity_score,
            matchedKeywords: s.matched_keywords || [],
            missingKeywords: s.missing_keywords || [],
            resumeKeywords: s.resume_keywords || [],
            jobKeywords: s.job_keywords || [],
          })
          totalMatches++
        }
      }

      return NextResponse.json({
        success: true,
        message: `Matched resume "${resume.candidateName}" to all jobs`,
        data: { totalMatches, totalResumes: 1, totalJobs: jobs.length },
      })
    }

    // 3) Match a specific resume-job pair (optional)
    if (resumeId && jobId) {
      const result = await matchSingle(resumeId, jobId)
      return NextResponse.json({
        success: true,
        message: 'Match created/updated successfully',
        data: { totalMatches: 1, matches: [result] },
      })
    }

    // 4) No target provided => do not match-all anymore
    return NextResponse.json(
      { success: false, message: 'Provide jobId to match all resumes for one job, or resumeId to match one resume to all jobs.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auto-match error:', error)
    return NextResponse.json({ success: false, message: 'Auto-match failed' }, { status: 500 })
  }
}

async function matchSingle(resumeId: string, jobId: string, resumeData?: any, jobData?: any) {
  const resume = resumeData || (await getResumeById(resumeId))
  const job = jobData || (await getJobById(jobId))

  if (!resume) throw new Error(`Resume not found: ${resumeId}`)
  if (!job) throw new Error(`Job not found: ${jobId}`)
  if (!resume?.extractedText?.trim()) throw new Error(`Resume "${resume.candidateName}" has no extracted text`)

  const jobText = `Job Title: ${job.title}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements || 'Not specified'}`
  const nlp = await fetch(`${process.env.NLP_SERVICE_URL}/calculate-similarity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_text: resume.extractedText, job_description: jobText }),
  })
  if (!nlp.ok) throw new Error('NLP service failed')
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

  return { resumeId, jobId, score: s.similarity_score }
}