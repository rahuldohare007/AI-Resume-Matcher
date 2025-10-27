"use client"

import { useState } from "react"
import { CldUploadWidget } from 'next-cloudinary'
import { Upload, File, X, Loader2, CheckCircle, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ResumeUploadProps {
  onUploadSuccess?: (data: any) => void
}

interface UploadedFileInfo {
  url: string
  publicId: string
  format: string
  originalFilename: string
  bytes: number
}

export function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null)
  const [candidateName, setCandidateName] = useState("")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUploadSuccess = (result: any) => {
    console.log('Upload successful:', result)
    
    const fileInfo: UploadedFileInfo = {
      url: result.info.secure_url,
      publicId: result.info.public_id,
      format: result.info.format,
      originalFilename: result.info.original_filename,
      bytes: result.info.bytes,
    }
    
    setUploadedFile(fileInfo)
    toast.success("File uploaded to cloud successfully!")
  }

  const handleUploadError = (error: any) => {
    console.error('Upload error:', error)
    toast.error("Failed to upload file to cloud")
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const handleSubmit = async () => {
    if (!candidateName || !email) {
      toast.error("Please enter candidate name and email")
      return
    }

    if (!uploadedFile) {
      toast.error("Please upload a resume file")
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsProcessing(true)

    try {
      // Send to backend API for processing
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateName,
          email,
          fileUrl: uploadedFile.url,
          cloudinaryPublicId: uploadedFile.publicId,
          fileFormat: uploadedFile.format,
          fileName: uploadedFile.originalFilename,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Resume processed successfully!")
        
        // Reset form
        setUploadedFile(null)
        setCandidateName("")
        setEmail("")
        
        onUploadSuccess?.(data.data)
      } else {
        toast.error(data.message || "Processing failed")
      }
    } catch (error) {
      toast.error("An error occurred during processing")
      console.error('Processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Upload Resume
        </CardTitle>
        <CardDescription>
          Upload candidate resumes in PDF or DOCX format (max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Candidate Info */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Candidate Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="John Doe"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Upload Widget */}
        <div>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              maxFiles: 1,
              resourceType: 'raw',
              folder: 'resumes',
              clientAllowedFormats: ['pdf', 'docx'],
              maxFileSize: 10000000, // 10MB
            }}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
          >
            {({ open }) => (
              <div
                onClick={() => open()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${uploadedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                  ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {uploadedFile ? (
                  <>
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <p className="text-green-700 font-medium mb-2">File uploaded successfully!</p>
                    <p className="text-sm text-gray-600">Click to upload a different file</p>
                  </>
                ) : (
                  <>
                    <Cloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">
                      Click to upload resume to cloud
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports PDF and DOCX files (max 10MB)
                    </p>
                  </>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>

        {/* Uploaded File Info */}
        <AnimatePresence>
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {uploadedFile.originalFilename}.{uploadedFile.format}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.bytes / 1024).toFixed(2)} KB • Uploaded to cloud
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !uploadedFile}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Resume...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Process & Save Resume
            </>
          )}
        </Button>

        {/* Info Text */}
        <p className="text-xs text-center text-gray-500">
          Files are securely stored in Cloudinary cloud storage
        </p>
      </CardContent>
    </Card>
  )
}