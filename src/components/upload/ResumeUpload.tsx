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

  // ✅ Handle file selection (before upload)
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and DOCX files are allowed")
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setLocalFile(file)
    toast.success("File selected!")

    // ✅ Extract text from local file immediately
    await extractTextFromLocalFile(file)
  }

  // ✅ Extract text from local file with enhanced error handling
  const extractTextFromLocalFile = async (file: File) => {
    setIsExtracting(true)
    setCurrentStep("Extracting text from resume...")
    setExtractedText('') // Clear previous text

    try {
      console.log('\n' + '='.repeat(60))
      console.log('🔍 Starting Text Extraction')
      console.log('='.repeat(60))
      console.log('   File:', file.name)
      console.log('   Size:', file.size, 'bytes')
      console.log('   Type:', file.type)
      
      const formData = new FormData()
      formData.append('file', file)

      console.log('📤 Sending to extraction API...')
      console.log('   Endpoint: /api/extract-text-proxy')
      
      const response = await fetch('/api/extract-text-proxy', {
        method: 'POST',
        body: formData,
      })

      console.log('📥 Response received')
      console.log('   Status:', response.status)
      console.log('   Status Text:', response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Extraction response:', data)
        
        const text = data.text || ''
        
        if (text && text.trim().length > 0) {
          setExtractedText(text)
          const wordCount = text.split(/\s+/).length
          console.log('✅ Text extracted successfully!')
          console.log('   Characters:', text.length)
          console.log('   Words:', wordCount)
          console.log('   Preview:', text.substring(0, 100) + '...')
          console.log('='.repeat(60) + '\n')
          toast.success(`Text extracted! (${text.length} characters, ${wordCount} words)`)
        } else {
          console.warn('⚠️ No text in response')
          console.warn('   This could mean:')
          console.warn('   1. PDF is image-based (scanned document)')
          console.warn('   2. PDF is encrypted or protected')
          console.warn('   3. File is corrupted')
          console.log('='.repeat(60) + '\n')
          toast.error("PDF appears to be empty or is an image-based PDF")
          setExtractedText('')
        }
      } else {
        let errorText = ''
        try {
          const errorData = await response.json()
          errorText = errorData.message || errorData.error || response.statusText
          console.error('❌ Extraction API Error')
          console.error('   Status:', response.status)
          console.error('   Error:', errorText)
          console.error('   Full response:', errorData)
        } catch {
          errorText = await response.text()
          console.error('❌ Extraction failed')
          console.error('   Status:', response.status)
          console.error('   Response:', errorText)
        }
        console.log('='.repeat(60) + '\n')
        toast.error(`Text extraction failed: ${response.status}`)
        setExtractedText('')
      }
    } catch (error) {
      console.error('❌ Text extraction error:', error)
      console.error('   Error type:', error instanceof Error ? error.constructor.name : typeof error)
      if (error instanceof Error) {
        console.error('   Message:', error.message)
        console.error('   Stack:', error.stack)
      }
      console.log('='.repeat(60) + '\n')
      
      // More specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Cannot connect to extraction service. Is the NLP service running?")
      } else {
        toast.error("Text extraction failed. You can still upload without text.")
      }
      setExtractedText('')
    } finally {
      setIsExtracting(false)
      setCurrentStep("")
    }
  }

  // ✅ Handle Cloudinary upload
  const handleCloudinaryUpload = async () => {
    if (!localFile) {
      toast.error("Please select a file first")
      return
    }

    setIsProcessing(true)
    setUploadProgress(20)
    setCurrentStep("Uploading to cloud storage...")

    try {
      console.log('\n' + '='.repeat(60))
      console.log('☁️ Starting Cloudinary Upload')
      console.log('='.repeat(60))
      console.log('   File:', localFile.name)
      console.log('   Size:', localFile.size, 'bytes')
      
      const formData = new FormData()
      formData.append('file', localFile)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
      formData.append('folder', 'resumes')

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`
      console.log('📤 Uploading to:', cloudinaryUrl)

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Cloudinary upload failed:', response.status, errorText)
        throw new Error(`Cloudinary upload failed: ${response.status}`)
      }

      const result = await response.json()
      
      const fileInfo: UploadedFileInfo = {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        originalFilename: localFile.name.split('.')[0],
        bytes: result.bytes,
      }

      setUploadedFile(fileInfo)
      setUploadProgress(60)
      
      console.log('✅ Cloudinary upload successful')
      console.log('   URL:', fileInfo.url)
      console.log('   Public ID:', fileInfo.publicId)
      console.log('='.repeat(60) + '\n')

      // Now save to database
      await saveToDatabase(fileInfo)

    } catch (error) {
      console.error('❌ Upload error:', error)
      console.log('='.repeat(60) + '\n')
      toast.error(error instanceof Error ? error.message : "Failed to upload file")
      setIsProcessing(false)
      setCurrentStep("")
    }
  }

  // ✅ Save to database
  const saveToDatabase = async (fileInfo: UploadedFileInfo) => {
    setCurrentStep("Saving to database...")
    setUploadProgress(80)

    try {
      console.log('\n' + '='.repeat(60))
      console.log('💾 Saving to Database')
      console.log('='.repeat(60))
      console.log('   Candidate:', candidateName)
      console.log('   Email:', email)
      console.log('   File URL:', fileInfo.url)
      console.log('   Extracted text:', extractedText ? `${extractedText.length} chars` : 'None')

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateName,
          email,
          fileUrl: fileInfo.url,
          cloudinaryPublicId: fileInfo.publicId,
          fileFormat: fileInfo.format,
          fileName: fileInfo.originalFilename,
          extractedText: extractedText,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setUploadProgress(100)
        setCurrentStep("Complete!")
        console.log('✅ Resume saved successfully!')
        console.log('   Resume ID:', data.data.resumeId)
        console.log('='.repeat(60) + '\n')
        toast.success("Resume saved successfully!")
        setShowSuccess(true)
        
        onUploadSuccess?.(data.data)
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/jobs')
        }, 2000)
      } else {
        console.error('❌ Save failed:', data.message)
        console.log('='.repeat(60) + '\n')
        toast.error(data.message || "Failed to save resume")
        setIsProcessing(false)
        setCurrentStep("")
      }
    } catch (error) {
      console.error('❌ Save error:', error)
      console.log('='.repeat(60) + '\n')
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

    // Start the upload process
    await handleCloudinaryUpload()
  }

  const removeFile = () => {
    setLocalFile(null)
    setUploadedFile(null)
    setExtractedText("")
  }

  // Success Screen
  if (showSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Resume Uploaded Successfully!
            </h2>
            <p className="text-gray-600 mb-2">
              {candidateName}'s resume has been saved
            </p>
            {extractedText && (
              <p className="text-sm text-green-600 mb-4">
                ✓ {extractedText.length} characters extracted
              </p>
            )}
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to create job description...
            </p>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Preparing next step</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    )
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
              disabled={isProcessing || isExtracting}
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
              disabled={isProcessing || isExtracting}
            />
          </div>
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Resume File <span className="text-red-500">*</span>
          </label>
          
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            disabled={isProcessing || isExtracting}
            className="hidden"
            id="resume-file-input"
          />
          
          <label
            htmlFor="resume-file-input"
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors block
              ${localFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
              ${isProcessing || isExtracting ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {localFile ? (
              <>
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <p className="text-green-700 font-medium mb-2">File selected!</p>
                {isExtracting ? (
                  <p className="text-sm text-blue-600 mb-2">
                    <Loader2 className="w-4 h-4 inline animate-spin mr-1" />
                    Extracting text...
                  </p>
                ) : extractedText ? (
                  <p className="text-sm text-green-600 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Text extracted ({extractedText.length} characters)
                  </p>
                ) : (
                  <p className="text-sm text-yellow-600 mb-2">
                    ⚠ Text extraction failed
                  </p>
                )}
                <p className="text-sm text-gray-600">Click to select a different file</p>
              </>
            ) : (
              <>
                <Cloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  Click to select resume file
                </p>
                <p className="text-sm text-gray-400">
                  Supports PDF and DOCX files (max 10MB)
                </p>
              </>
            )}
          </label>
        </div>

        {/* Current Step Indicator */}
        {currentStep && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{currentStep}</span>
            </div>
          </div>
        )}

        {/* Selected File Info */}
        <AnimatePresence>
          {localFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {localFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(localFile.size / 1024).toFixed(2)} KB
                      {extractedText && ` • ${extractedText.length} chars`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={isProcessing || isExtracting}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Extracted Text Preview */}
        {extractedText && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">
              ✅ Text Extracted Successfully
            </p>
            <div className="text-xs text-green-700 space-y-1">
              <p>Characters: {extractedText.length}</p>
              <p>Words: {extractedText.split(/\s+/).length}</p>
              <details>
                <summary className="cursor-pointer hover:underline">
                  Preview first 500 characters
                </summary>
                <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                  {extractedText.substring(0, 500)}...
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isProcessing && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{currentStep}</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="bg-blue-600 h-2 rounded-full transition-all"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
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

        {/* Info Text */}
        <div className="text-xs text-center">
          {extractedText ? (
            <p className="text-green-600 font-medium">
              ✓ Ready to upload with extracted text ({extractedText.length} characters)
            </p>
          ) : localFile && !isExtracting ? (
            <p className="text-yellow-600">
              ⚠ Resume will be saved without text extraction
            </p>
          ) : localFile && isExtracting ? (
            <p className="text-blue-600">
              Extracting text from your resume...
            </p>
          ) : (
            <p className="text-gray-500">
              Select a file to begin
            </p>
          )}
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:underline">Debug Info</summary>
            <div className="mt-2 p-2 bg-gray-100 rounded space-y-1">
              <p>NLP Service: {process.env.NEXT_PUBLIC_APP_URL ? 'Configured' : 'Not configured'}</p>
              <p>File selected: {localFile ? 'Yes' : 'No'}</p>
              <p>Text extracted: {extractedText ? 'Yes' : 'No'}</p>
              <p>Is extracting: {isExtracting ? 'Yes' : 'No'}</p>
              <p>Is processing: {isProcessing ? 'Yes' : 'No'}</p>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
}