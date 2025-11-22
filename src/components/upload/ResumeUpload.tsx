"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, File, X, Loader2, CheckCircle, Cloud, ArrowRight, FileText } from "lucide-react"
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
  const router = useRouter()
  const [localFile, setLocalFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null)
  const [candidateName, setCandidateName] = useState("")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [extractedText, setExtractedText] = useState("")

  const displayFileName =
    uploadedFile
      ? `${uploadedFile.originalFilename}${uploadedFile.format ? `.${uploadedFile.format}` : ""}`
      : localFile?.name || ""

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and DOCX files are allowed")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setLocalFile(file)
    toast.success("File selected!")
    await extractTextFromLocalFile(file)
  }

  const extractTextFromLocalFile = async (file: File) => {
    setIsExtracting(true)
    setCurrentStep("Extracting text from resume...")
    setExtractedText("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/extract-text-proxy", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const text = data.text || ""
        setExtractedText(text)
        if (text.trim().length > 0) {
          toast.success(`Text extracted (${text.length} characters)`)
        } else {
          toast("Could not extract text, we’ll still proceed", { icon: "⚠️" })
        }
      } else {
        toast.error("Text extraction failed. We’ll still proceed")
        setExtractedText("")
      }
    } catch {
      toast.error("Cannot connect to extraction service. We’ll still proceed")
      setExtractedText("")
    } finally {
      setIsExtracting(false)
      setCurrentStep("")
    }
  }

  const handleCloudinaryUpload = async () => {
    if (!localFile) {
      toast.error("Please select a file first")
      return
    }

    setIsProcessing(true)
    setUploadProgress(25)
    setCurrentStep("Uploading resume...")

    try {
      const formData = new FormData()
      formData.append("file", localFile)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
      formData.append("folder", "resumes")

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`
      const response = await fetch(cloudinaryUrl, { method: "POST", body: formData })
      if (!response.ok) throw new Error("Cloud upload failed")

      const result = await response.json()
      const fileInfo: UploadedFileInfo = {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        originalFilename: localFile.name.split(".")[0],
        bytes: result.bytes,
      }

      setUploadedFile(fileInfo)
      setUploadProgress(60)
      await saveToDatabase(fileInfo)
    } catch {
      toast.error("Failed to upload file")
      setIsProcessing(false)
      setCurrentStep("")
    }
  }

  const saveToDatabase = async (fileInfo: UploadedFileInfo) => {
    setCurrentStep("Saving resume...")
    setUploadProgress(85)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName,
          email,
          fileUrl: fileInfo.url,
          cloudinaryPublicId: fileInfo.publicId,
          fileFormat: fileInfo.format,
          fileName: fileInfo.originalFilename,
          extractedText,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setUploadProgress(100)
        setCurrentStep("Done")
        toast.success("Resume saved successfully!")
        setShowSuccess(true)
        onUploadSuccess?.(data.data)
        setTimeout(() => router.push("/jobs"), 1500)
      } else {
        toast.error(data.message || "Failed to save resume")
        setIsProcessing(false)
        setCurrentStep("")
      }
    } catch {
      toast.error("Failed to save resume")
      setIsProcessing(false)
      setCurrentStep("")
    }
  }

  const handleSubmit = async () => {
    if (!candidateName || !email) {
      toast.error("Please enter candidate name and email")
      return
    }
    if (!localFile) {
      toast.error("Please select a resume file")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }
    await handleCloudinaryUpload()
  }

  const removeFile = () => {
    setLocalFile(null)
    setUploadedFile(null)
    setExtractedText("")
  }

  if (showSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-10 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Resume Uploaded!</h2>
          {displayFileName && (
            <p className="text-gray-700 dark:text-gray-300 mb-1 break-all" title={displayFileName}>
              File: {displayFileName}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {candidateName}&apos;s resume has been saved
          </p>
          {extractedText && (
            <p className="text-sm text-green-700 dark:text-green-400 mb-6">
              Text extracted: {extractedText.length} characters
            </p>
          )}
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to create job...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Upload className="w-6 h-6" />
          Upload Resume
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          PDF or DOCX (max 10MB)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Candidate Info */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Candidate Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="John Doe"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              disabled={isProcessing || isExtracting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isProcessing || isExtracting}
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
            Resume File <span className="text-red-500">*</span>
          </label>

          <input
            id="resume-file-input"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            disabled={isProcessing || isExtracting}
            className="hidden"
          />

          <label
            htmlFor="resume-file-input"
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors block
              ${localFile ? "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700" : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"}
              ${isProcessing || isExtracting ? "opacity-50 pointer-events-none" : ""}`}
          >
            {localFile ? (
              <>
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
                {displayFileName && (
                  <p className="text-sm text-gray-800 dark:text-gray-100 font-medium mb-1 break-all" title={displayFileName}>
                    {displayFileName}
                  </p>
                )}
                {isExtracting ? (
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <Loader2 className="w-4 h-4 inline animate-spin mr-1" />
                    Extracting text...
                  </p>
                ) : extractedText ? (
                  <p className="text-sm text-green-700 dark:text-green-400">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Text extracted ({extractedText.length} chars)
                  </p>
                ) : (
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">Proceeding without text</p>
                )}
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Click to change file</p>
              </>
            ) : (
              <>
                <Cloud className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-700 dark:text-gray-200 mb-1">Click to select resume file</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Supports PDF and DOCX (max 10MB)</p>
              </>
            )}
          </label>
        </div>

        {/* Selected File Info */}
        <AnimatePresence>
          {localFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium break-all max-w-[420px] text-gray-800 dark:text-gray-100" title={displayFileName}>
                      {displayFileName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(localFile.size / 1024).toFixed(1)} KB
                      {extractedText && ` • ${extractedText.length} chars`}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile} disabled={isProcessing || isExtracting}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{currentStep}</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="bg-blue-600 h-2 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || isExtracting || !localFile}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : isExtracting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Extracting Text...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload & Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Friendly note */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          We’ll extract text automatically. If not possible, your resume is still saved.
        </p>
      </CardContent>
    </Card>
  )
}