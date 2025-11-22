import { ResumeUpload } from "@/components/upload/ResumeUpload"
import { WorkflowSteps } from "@/components/ui/workflow-steps"

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <WorkflowSteps currentStep={1} />
      <ResumeUpload />
    </div>
  )
}