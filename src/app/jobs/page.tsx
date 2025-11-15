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


import { redirect } from "next/navigation"
import { getAllResumes } from "@/lib/db-utils"
import { WorkflowSteps } from "@/components/ui/workflow-steps"
import { JobDescriptionInput } from "@/components/upload/JobDescriptionInput"

export default async function JobsPage() {
  const resumes = await getAllResumes()
  if (!resumes || resumes.length === 0) {
    redirect("/upload")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <WorkflowSteps currentStep={2} />
      <JobDescriptionInput />
    </div>
  )
}