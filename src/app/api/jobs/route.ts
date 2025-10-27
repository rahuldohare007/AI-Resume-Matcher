import { NextRequest, NextResponse } from 'next/server'
import { createJob, getAllJobs, deleteJob } from '@/lib/db-utils'
import { deleteMatchesByJobId } from '@/lib/db-utils'

// POST - Create new job description
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, requirements } = body

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      )
    }

    const jobData = {
      title,
      description,
      requirements: requirements || '',
    }

    const result = await createJob(jobData)

    return NextResponse.json({
      success: true,
      message: 'Job description saved successfully',
      data: {
        jobId: result.insertedId.toString(),
        ...jobData,
      },
    })
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save job description' },
      { status: 500 }
    )
  }
}

// GET - Fetch all job descriptions
export async function GET() {
  try {
    const jobs = await getAllJobs()

    return NextResponse.json({
      success: true,
      data: jobs.map((job) => ({
        id: job._id.toString(),
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        createdAt: job.createdAt,
      })),
    })
  } catch (error) {
    console.error('Fetch jobs error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}