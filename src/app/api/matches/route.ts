// import { NextResponse } from 'next/server'
// import { getAllMatches } from '@/lib/db-utils'

// export async function GET() {
//   try {
//     const matches = await getAllMatches()

//     return NextResponse.json({
//       success: true,
//       data: matches.map((match) => ({
//         id: match._id.toString(),
//         resumeId: match.resumeId,
//         jobId: match.jobId,
//         candidateName: match.candidateName,
//         candidateEmail: match.candidateEmail,
//         jobTitle: match.jobTitle,
//         score: match.score,
//         matchedKeywords: match.matchedKeywords,
//         missingKeywords: match.missingKeywords,
//         createdAt: match.createdAt,
//       })),
//     })
//   } catch (error) {
//     console.error('Fetch matches error:', error)
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch matches' },
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from 'next/server'
import { getAllMatches } from '@/lib/db-utils'

export async function GET() {
  try {
    const matches = await getAllMatches()

    // De-dup in API response (unique by resumeId+jobId), keep newest
    const seen = new Set<string>()
    const unique = []
    // sort newest first before filtering so we keep the latest record
    const sorted = [...matches].sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime()
      const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime()
      if (bTime !== aTime) return bTime - aTime      // newest first
      return (b.score ?? 0) - (a.score ?? 0)        // then higher score
    })

    for (const m of sorted) {
      const key = `${m.resumeId}-${m.jobId}`
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(m)
      }
    }

    return NextResponse.json({
      success: true,
      data: unique.map((match) => ({
        id: match._id.toString(),
        resumeId: match.resumeId,
        jobId: match.jobId,
        candidateName: match.candidateName,
        candidateEmail: match.candidateEmail,
        jobTitle: match.jobTitle,
        score: match.score,
        matchedKeywords: match.matchedKeywords,
        missingKeywords: match.missingKeywords,
        createdAt: match.createdAt ?? match.updatedAt ?? new Date(),
      })),
    })
  } catch (error) {
    console.error('Fetch matches error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}