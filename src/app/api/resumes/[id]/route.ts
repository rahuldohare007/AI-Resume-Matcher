import { NextRequest, NextResponse } from 'next/server'
import { getResumeById, deleteResume } from '@/lib/db-utils'
import { deleteFromCloudinary } from '@/lib/cloudinary'
import { deleteMatchesByResumeId } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resume = await getResumeById(params.id)

    if (!resume) {
      return NextResponse.json(
        { success: false, message: 'Resume not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resume._id.toString(),
        candidateName: resume.candidateName,
        email: resume.email,
        fileUrl: resume.fileUrl,
        cloudinaryPublicId: resume.cloudinaryPublicId,
        extractedText: resume.extractedText,
        uploadedAt: resume.createdAt,
      },
    })
  } catch (error) {
    console.error('Fetch resume error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resume' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resume = await getResumeById(params.id)

    if (!resume) {
      return NextResponse.json(
        { success: false, message: 'Resume not found' },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    if (resume.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(resume.cloudinaryPublicId)
      } catch (e) {
        console.error('Error deleting from Cloudinary:', e)
      }
    }

    // Delete associated matches
    await deleteMatchesByResumeId(params.id)

    // Delete from database
    await deleteResume(params.id)

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    })
  } catch (error) {
    console.error('Delete resume error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete resume' },
      { status: 500 }
    )
  }
}