// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Briefcase, Loader2, CheckCircle, Sparkles, ArrowRight, Plus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import toast from "react-hot-toast"
// import { motion } from "framer-motion"

// interface JobDescriptionInputProps {
//   onSubmitSuccess?: (data: any) => void
// }

// export function JobDescriptionInput({ onSubmitSuccess }: JobDescriptionInputProps) {
//   const router = useRouter()
//   const [jobTitle, setJobTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [requirements, setRequirements] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isMatching, setIsMatching] = useState(false)
//   const [showSuccess, setShowSuccess] = useState(false)
//   const [savedJobId, setSavedJobId] = useState<string | null>(null)

//   const handleSubmit = async () => {
//     if (!jobTitle || !description) {
//       toast.error("Please fill in job title and description")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const response = await fetch("/api/jobs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title: jobTitle,
//           description,
//           requirements,
//         }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         toast.success("Job description saved successfully!")
//         setSavedJobId(data.data.jobId)
//         setShowSuccess(true)
//         onSubmitSuccess?.(data.data)
//       } else {
//         toast.error(data.message || "Failed to save job description")
//       }
//     } catch (error) {
//       toast.error("An error occurred")
//       console.error(error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleMatchNow = async () => {
//     setIsMatching(true)

//     try {
//       const response = await fetch("/api/match/auto", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       const data = await response.json()

//       if (data.success) {
//         const matchCount = data.data?.totalMatches || 0
//         toast.success(`Successfully created ${matchCount} matches!`)
        
//         // Redirect to dashboard after 1 second
//         setTimeout(() => {
//           router.push('/dashboard')
//         }, 1000)
//       } else {
//         toast.error(data.message || "Matching failed")
//         setIsMatching(false)
//       }
//     } catch (error) {
//       toast.error("Error during matching")
//       console.error(error)
//       setIsMatching(false)
//     }
//   }

//   const handleCreateAnother = () => {
//     setShowSuccess(false)
//     setJobTitle("")
//     setDescription("")
//     setRequirements("")
//     setSavedJobId(null)
//   }

//   // Success Screen with Match Button
//   if (showSuccess) {
//     return (
//       <Card className="w-full max-w-2xl mx-auto">
//         <CardContent className="p-12">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             className="text-center"
//           >
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-12 h-12 text-green-600" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">
//               Job Description Saved!
//             </h2>
//             <p className="text-gray-600 mb-8">
//               Ready to match resumes with this job?
//             </p>

//             <div className="space-y-3">
//               {/* Primary Action: Match Now */}
//               <Button
//                 onClick={handleMatchNow}
//                 disabled={isMatching}
//                 className="w-full"
//                 size="lg"
//               >
//                 {isMatching ? (
//                   <>
//                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                     Analyzing Resumes...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="w-5 h-5 mr-2" />
//                     Match Resumes & View Results
//                     <ArrowRight className="w-5 h-5 ml-2" />
//                   </>
//                 )}
//               </Button>

//               {/* Secondary Actions */}
//               <div className="grid grid-cols-2 gap-3">
//                 <Button
//                   onClick={handleCreateAnother}
//                   variant="outline"
//                   disabled={isMatching}
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Another Job
//                 </Button>

//                 <Button
//                   onClick={() => router.push('/dashboard')}
//                   variant="outline"
//                   disabled={isMatching}
//                 >
//                   Skip to Dashboard
//                 </Button>
//               </div>
//             </div>

//             {isMatching && (
//               <p className="text-sm text-gray-500 mt-6">
//                 This may take a few moments...
//               </p>
//             )}
//           </motion.div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Job Input Form
//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Briefcase className="w-6 h-6" />
//           Job Description
//         </CardTitle>
//         <CardDescription>
//           Enter the job details to match against candidate resumes
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Job Title <span className="text-red-500">*</span>
//           </label>
//           <Input
//             placeholder="e.g., Senior Machine Learning Engineer"
//             value={jobTitle}
//             onChange={(e) => setJobTitle(e.target.value)}
//             disabled={isSubmitting}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Job Description <span className="text-red-500">*</span>
//           </label>
//           <Textarea
//             placeholder="Describe the role, responsibilities, and what the ideal candidate looks like..."
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={6}
//             disabled={isSubmitting}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Requirements (Optional)
//           </label>
//           <Textarea
//             placeholder="List key skills, qualifications, and experience needed..."
//             value={requirements}
//             onChange={(e) => setRequirements(e.target.value)}
//             rows={4}
//             disabled={isSubmitting}
//           />
//         </div>

//         <Button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className="w-full"
//           size="lg"
//         >
//           {isSubmitting ? (
//             <>
//               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <CheckCircle className="w-4 h-4 mr-2" />
//               Save & Continue
//               <ArrowRight className="w-4 h-4 ml-2" />
//             </>
//           )}
//         </Button>

//         <p className="text-xs text-center text-gray-500">
//           After saving, you'll be able to match resumes against this job
//         </p>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Loader2, CheckCircle, Sparkles, ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

interface JobDescriptionInputProps {
  onSubmitSuccess?: (data: any) => void
}

export function JobDescriptionInput({ onSubmitSuccess }: JobDescriptionInputProps) {
  const router = useRouter()
  const [jobTitle, setJobTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMatching, setIsMatching] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [savedJobId, setSavedJobId] = useState<string | null>(null)

  const titleLen = jobTitle.trim().length
  const descLen = description.trim().length
  const reqLen = requirements.trim().length

  const isFormValid = useMemo(() => {
    return titleLen >= 3 && descLen >= 20
  }, [titleLen, descLen])

  const handleSubmit = async () => {
    const title = jobTitle.trim()
    const desc = description.trim()
    const req = requirements.trim()

    if (!title || !desc) {
      toast.error("Please fill in job title and description")
      return
    }
    if (title.length < 3) {
      toast.error("Job title must be at least 3 characters")
      return
    }
    if (desc.length < 20) {
      toast.error("Job description must be at least 20 characters")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc, requirements: req }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Job description saved successfully!")
        setSavedJobId(data.data.jobId)
        setShowSuccess(true)
        onSubmitSuccess?.(data.data)
      } else {
        toast.error(data.message || "Failed to save job description")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while saving")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMatchNow = async () => {
    if (!savedJobId) {
      toast.error("Job not found. Please save the job again.")
      return
    }

    setIsMatching(true)

    try {
      // Try to match ONLY this job with all resumes (backend should accept { jobId })
      const response = await fetch("/api/match/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: savedJobId }),
      })

      const data = await response.json()

      if (data.success) {
        const matchCount = data.data?.totalMatches ?? 0
        toast.success(
          matchCount > 0
            ? `Successfully created ${matchCount} matches!`
            : "No matches created. Check if resumes have extracted text."
        )
        setTimeout(() => router.push("/dashboard"), 1000)
      } else {
        toast.error(data.message || "Matching failed")
        setIsMatching(false)
      }
    } catch (error) {
      console.error(error)
      toast.error("Error during matching")
      setIsMatching(false)
    }
  }

  const handleCreateAnother = () => {
    setShowSuccess(false)
    setJobTitle("")
    setDescription("")
    setRequirements("")
    setSavedJobId(null)
  }

  // Success Screen with Match Button
  if (showSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Job Description Saved!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Ready to match resumes with this job?
            </p>

            <div className="space-y-3">
              <Button onClick={handleMatchNow} disabled={isMatching} className="w-full" size="lg" aria-busy={isMatching}>
                {isMatching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Resumes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Match Resumes & View Results
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleCreateAnother} variant="outline" disabled={isMatching}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Job
                </Button>

                <Button onClick={() => router.push("/dashboard")} variant="outline" disabled={isMatching}>
                  Skip to Dashboard
                </Button>
              </div>
            </div>

            {isMatching && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                This may take a few moments...
              </p>
            )}
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  // Job Input Form
  return (
    <Card className="w-full max-w-2xl mx-auto" aria-busy={isSubmitting}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          Job Description
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Enter the job details to match against candidate resumes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Job Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="jobTitle"
            placeholder="e.g., Senior Machine Learning Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={isSubmitting || isMatching}
            autoFocus
            aria-required
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {titleLen < 3 ? `At least 3 characters (${titleLen}/3)` : `${titleLen} characters`}
          </div>
        </div>

        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Job Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="jobDescription"
            placeholder="Describe the role, responsibilities, and what the ideal candidate looks like..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            disabled={isSubmitting || isMatching}
            aria-required
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {descLen < 20 ? `At least 20 characters (${descLen}/20)` : `${descLen} characters`}
          </div>
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Requirements (Optional)
          </label>
          <Textarea
            id="requirements"
            placeholder="List key skills, qualifications, and experience needed..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={4}
            disabled={isSubmitting || isMatching}
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {reqLen} characters
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isMatching || !isFormValid}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save & Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          After saving, you'll be able to match resumes against this job
        </p>
      </CardContent>
    </Card>
  )
}