"use client"

import { useState } from "react"
import { Briefcase, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"

interface JobDescriptionInputProps {
  onSubmitSuccess?: (data: any) => void
}

export function JobDescriptionInput({ onSubmitSuccess }: JobDescriptionInputProps) {
  const [jobTitle, setJobTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!jobTitle || !description) {
      toast.error("Please fill in job title and description")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle,
          description,
          requirements,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Job description saved successfully!")
        setJobTitle("")
        setDescription("")
        setRequirements("")
        onSubmitSuccess?.(data.data)
      } else {
        toast.error(data.message || "Failed to save job description")
      }
    } catch (error) {
      toast.error("An error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          Job Description
        </CardTitle>
        <CardDescription>
          Enter the job details to match against candidate resumes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <Input
            placeholder="e.g., Senior Machine Learning Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <Textarea
            placeholder="Describe the role, responsibilities, and what the ideal candidate looks like..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Requirements (Optional)
          </label>
          <Textarea
            placeholder="List key skills, qualifications, and experience needed..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={4}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Job Description"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}