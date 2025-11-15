// import { MatchDashboard } from "@/components/dashboard/MatchDashboard"
// import { WorkflowSteps } from "@/components/ui/workflow-steps"

// export default function DashboardPage() {
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <WorkflowSteps currentStep={3} />
//       <MatchDashboard />
//     </div>
//   )
// }

// src/app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { getAllResumes } from "@/lib/db-utils"
import { WorkflowSteps } from "@/components/ui/workflow-steps"
import { MatchDashboard } from "@/components/dashboard/MatchDashboard"

export default async function DashboardPage() {
  const resumes = await getAllResumes()
  if (!resumes || resumes.length === 0) {
    redirect("/upload")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <WorkflowSteps currentStep={3} />
      <MatchDashboard />
    </div>
  )
}
