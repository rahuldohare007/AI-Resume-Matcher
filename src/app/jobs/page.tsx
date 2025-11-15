// import { JobDescriptionInput } from "@/components/upload/JobDescriptionInput"
// import { WorkflowSteps } from "@/components/ui/workflow-steps"

// export default function JobsPage() {
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <WorkflowSteps currentStep={2} />
//       <JobDescriptionInput />
//     </div>
//   )
// }

// src/app/jobs/page.tsx
import { JobDescriptionInput } from "@/components/upload/JobDescriptionInput"
import { WorkflowSteps } from "@/components/ui/workflow-steps"

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <WorkflowSteps currentStep={2} />
      <JobDescriptionInput />
    </div>
  )
}