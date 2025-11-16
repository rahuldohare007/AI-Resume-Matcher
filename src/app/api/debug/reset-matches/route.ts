import { NextResponse } from 'next/server'
import { getCollection, Collections } from '@/lib/mongodb'

export async function POST() {
  try {
    const collection = await getCollection(Collections.MATCHES)
    
    // 1. Delete ALL matches
    const deleteResult = await collection.deleteMany({})
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} matches`)
    
    // 2. Drop existing indexes
    try {
      await collection.dropIndexes()
      console.log('🗑️  Dropped all indexes')
    } catch (e) {
      console.log('⚠️  No indexes to drop')
    }
    
    // 3. Create unique index
    await collection.createIndex(
      { resumeId: 1, jobId: 1 },
      { unique: true, name: 'uniq_resume_job' }
    )
    console.log('✅ Created unique index')
    
    // 4. Verify index
    const indexes = await collection.indexes()
    
    return NextResponse.json({
      success: true,
      message: 'Matches reset and index recreated',
      data: {
        deletedCount: deleteResult.deletedCount,
        indexes
      }
    })
  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}