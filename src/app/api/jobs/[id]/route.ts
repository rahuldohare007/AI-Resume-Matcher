import { NextRequest, NextResponse } from 'next/server'
import { getJobById, deleteJob, deleteMatchesByJobId } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await getJobById(params.id)

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: job._id.toString(),
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        createdAt: job.createdAt,
      },
    })
  } catch (error) {
    console.error('Fetch job error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await getJobById(params.id)

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }

    // Delete associated matches
    await deleteMatchesByJobId(params.id)

    // Delete job
    await deleteJob(params.id)

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    })
  } catch (error) {
    console.error('Delete job error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete job' },
      { status: 500 }
    )
  }
}