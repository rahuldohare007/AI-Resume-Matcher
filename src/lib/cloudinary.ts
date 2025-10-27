import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

/**
 * 📥 Download file from Cloudinary safely
 * Ensures binary download using `fl_attachment` transformation
 */
export async function downloadFromCloudinary(url: string): Promise<Buffer> {
  console.log("📥 Downloading file from Cloudinary...")

  try {
    // Ensure direct downloadable URL (avoids HTML responses)
    const downloadUrl = url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url

    const response = await fetch(downloadUrl)

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
    }

    // Convert to buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("✅ File downloaded successfully from Cloudinary.")
    return buffer
  } catch (error) {
    console.error("❌ Error downloading from Cloudinary:", error)
    throw error
  }
}

/**
 * 🗑️ Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw", // ensures DOCX/PDFs are handled correctly
    })
    console.log("🗑️ File deleted from Cloudinary:", result)
    return result
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error)
    throw error
  }
}

/**
 * 📄 Get Cloudinary file info
 */
export async function getCloudinaryFileInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "raw",
    })
    console.log("ℹ️ File info fetched from Cloudinary:", result)
    return result
  } catch (error) {
    console.error("❌ Error getting file info from Cloudinary:", error)
    throw error
  }
}
