// "use client"

// import { CheckCircle, Circle } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface WorkflowStepsProps {
//   currentStep: 1 | 2 | 3
// }

// const steps = [
//   { number: 1, title: "Upload Resume", description: "Add candidate resume" },
//   { number: 2, title: "Create Job", description: "Define job requirements" },
//   { number: 3, title: "View Matches", description: "See AI-powered results" },
// ]

// export function WorkflowSteps({ currentStep }: WorkflowStepsProps) {
//   return (
//     <div className="w-full max-w-3xl mx-auto mb-8">
//       <div className="flex items-center justify-between">
//         {steps.map((step, index) => (
//           <div key={step.number} className="flex items-center flex-1">
//             {/* Step Circle */}
//             <div className="flex flex-col items-center">
//               <div
//                 className={cn(
//                   "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
//                   step.number < currentStep
//                     ? "bg-green-600 text-white"
//                     : step.number === currentStep
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-500"
//                 )}
//               >
//                 {step.number < currentStep ? (
//                   <CheckCircle className="w-6 h-6" />
//                 ) : (
//                   <span>{step.number}</span>
//                 )}
//               </div>
//               <div className="text-center mt-2">
//                 <p
//                   className={cn(
//                     "text-sm font-medium",
//                     step.number <= currentStep
//                       ? "text-gray-900"
//                       : "text-gray-500"
//                   )}
//                 >
//                   {step.title}
//                 </p>
//                 <p className="text-xs text-gray-500">{step.description}</p>
//               </div>
//             </div>

//             {/* Connecting Line */}
//             {index < steps.length - 1 && (
//               <div
//                 className={cn(
//                   "flex-1 h-1 mx-4 transition-colors",
//                   step.number < currentStep
//                     ? "bg-green-600"
//                     : "bg-gray-200"
//                 )}
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"

import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkflowStepsProps {
  currentStep: 1 | 2 | 3
}

const steps = [
  { number: 1, title: "Upload Resume", description: "Add candidate resume" },
  { number: 2, title: "Create Job", description: "Define job requirements" },
  { number: 3, title: "View Matches", description: "See AI-powered results" },
]

export function WorkflowSteps({ currentStep }: WorkflowStepsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12 px-4">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1 relative">
            <div className="flex flex-col items-center z-10 flex-1">
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all shadow-lg",
                  step.number < currentStep
                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white scale-110"
                    : step.number === currentStep
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-125 ring-4 ring-purple-200 dark:ring-purple-900"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                )}
              >
                {step.number < currentStep ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className="text-center mt-3">
                <p
                  className={cn(
                    "text-sm font-bold",
                    step.number <= currentStep ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="absolute top-7 left-[50%] right-[-50%] h-1 -z-10">
                <div
                  className={cn(
                    "h-full transition-all",
                    step.number < currentStep
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gray-300 dark:bg-gray-700"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}