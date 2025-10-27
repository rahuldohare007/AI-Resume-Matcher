import { NextResponse } from 'next/server'
import { getAllMatches } from '@/lib/db-utils'

export async function GET() {
  try {
    const matches = await getAllMatches()

    return NextResponse.json({
      success: true,
      data: matches.map((match) => ({
        id: match._id.toString(),
        resumeId: match.resumeId,
        jobId: match.jobId,
        candidateName: match.candidateName,
        candidateEmail: match.candidateEmail,
        jobTitle: match.jobTitle,
        score: match.score,
        matchedKeywords: match.matchedKeywords,
        missingKeywords: match.missingKeywords,
        createdAt: match.createdAt,
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