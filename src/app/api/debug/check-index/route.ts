import { NextResponse } from 'next/server'
import { getCollection, Collections } from '@/lib/mongodb'

export async function GET() {
  try {
    const collection = await getCollection(Collections.MATCHES)
    
    // Get all indexes
    const indexes = await collection.indexes()
    
    // Get sample matches
    const matches = await collection.find({}).limit(10).toArray()
    
    // Check for duplicates
    const all = await collection.find({}).toArray()
    const seen = new Map<string, number>()
    const duplicates: any[] = []
    
    for (const match of all) {
      const key = `${match.resumeId}-${match.jobId}`
      if (seen.has(key)) {
        duplicates.push({
          resumeId: match.resumeId,
          jobId: match.jobId,
          candidateName: match.candidateName,
          count: (seen.get(key) || 0) + 1
        })
        seen.set(key, (seen.get(key) || 0) + 1)
      } else {
        seen.set(key, 1)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        indexes,
        totalMatches: all.length,
        uniquePairs: seen.size,
        duplicateCount: duplicates.length,
        duplicates: duplicates.slice(0, 10),
        sampleMatches: matches.map(m => ({
          _id: m._id.toString(),
          resumeId: m.resumeId,
          jobId: m.jobId,
          candidateName: m.candidateName,
          jobTitle: m.jobTitle,
          score: m.score,
        }))
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}