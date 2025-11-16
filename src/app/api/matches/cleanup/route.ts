import { NextResponse } from 'next/server'
import { getCollection, Collections } from '@/lib/mongodb'

export async function POST() {
  try {
    const collection = await getCollection(Collections.MATCHES)
    const all = await collection.find({}).toArray()
    
    const seen = new Map<string, any>()
    const toDelete: any[] = []
    
    // Keep newest match for each resume-job pair
    for (const match of all) {
      const key = `${match.resumeId}-${match.jobId}`
      
      if (seen.has(key)) {
        const existing = seen.get(key)
        const existingTime = new Date(existing.createdAt || existing.updatedAt || 0).getTime()
        const currentTime = new Date(match.createdAt || match.updatedAt || 0).getTime()
        
        // Keep newer one (or higher score if same time)
        if (currentTime > existingTime || (currentTime === existingTime && match.score > existing.score)) {
          toDelete.push(existing._id)
          seen.set(key, match)
        } else {
          toDelete.push(match._id)
        }
      } else {
        seen.set(key, match)
      }
    }
    
    let deletedCount = 0
    if (toDelete.length > 0) {
      const result = await collection.deleteMany({ _id: { $in: toDelete } })
      deletedCount = result.deletedCount
    }
    
    return NextResponse.json({
      success: true,
      message: `Removed ${deletedCount} duplicate(s)`,
      data: {
        totalBefore: all.length,
        totalAfter: seen.size,
        duplicatesRemoved: deletedCount
      }
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { success: false, message: 'Cleanup failed' },
      { status: 500 }
    )
  }
}