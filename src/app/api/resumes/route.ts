import { NextRequest, NextResponse } from 'next/server'
import { getAllResumes, deleteResume } from '@/lib/db-utils'
import { deleteFromCloudinary } from '@/lib/cloudinary'

// GET all resumes
export async function GET() {
  try {
    const resumes = await getAllResumes()

    return NextResponse.json({
      success: true,
      data: resumes.map((resume) => ({
        id: resume._id.toString(),
        candidateName: resume.candidateName,
        email: resume.email,
        fileUrl: resume.fileUrl,
        cloudinaryPublicId: resume.cloudinaryPublicId,
        extractedText: resume.extractedText,
        uploadedAt: resume.createdAt,
      })),
    })
  } catch (error) {
    console.error('Fetch resumes error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}

// DELETE all resumes (for testing)
export async function DELETE() {
  try {
    const resumes = await getAllResumes()
    
    // Delete from Cloudinary and database
    for (const resume of resumes) {
      if (resume.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(resume.cloudinaryPublicId)
        } catch (e) {
          console.error('Error deleting from Cloudinary:', e)
        }
      }
      await deleteResume(resume._id.toString())
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${resumes.length} resumes`,
    })
  } catch (error) {
    console.error('Delete all resumes error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete resumes' },
      { status: 500 }
    )
  }
}