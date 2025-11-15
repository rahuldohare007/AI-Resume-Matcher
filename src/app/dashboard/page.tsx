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
import { MatchDashboard } from "@/components/dashboard/MatchDashboard"
import { WorkflowSteps } from "@/components/ui/workflow-steps"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <WorkflowSteps currentStep={3} />
      <MatchDashboard />
    </div>
  )
}