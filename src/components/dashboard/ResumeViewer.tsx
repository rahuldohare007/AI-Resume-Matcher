// "use client"

// import { useState } from "react"
// import { CldImage } from 'next-cloudinary'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { ExternalLink, Download } from "lucide-react"

// interface ResumeViewerProps {
//   fileUrl: string
//   publicId?: string
//   candidateName: string
//   isOpen: boolean
//   onClose: () => void
// }

// export function ResumeViewer({ 
//   fileUrl, 
//   publicId,
//   candidateName, 
//   isOpen, 
//   onClose 
// }: ResumeViewerProps) {
//   const isPDF = fileUrl.includes('.pdf')
  
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl h-[80vh]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-between">
//             <span>{candidateName}'s Resume</span>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" asChild>
//                 <a href={fileUrl} target="_blank" rel="noopener noreferrer">
//                   <ExternalLink className="w-4 h-4 mr-2" />
//                   Open
//                 </a>
//               </Button>
//               <Button variant="outline" size="sm" asChild>
//                 <a href={fileUrl} download>
//                   <Download className="w-4 h-4 mr-2" />
//                   Download
//                 </a>
//               </Button>
//             </div>
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="flex-1 overflow-auto">
//           {isPDF ? (
//             <iframe
//               src={`${fileUrl}#toolbar=0`}
//               className="w-full h-full border-0 rounded-lg"
//               title={`${candidateName} Resume`}
//             />
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full gap-4">
//               <p className="text-gray-600">Document preview</p>
//               {publicId && (
//                 <div className="max-w-full overflow-auto">
//                   <CldImage
//                     width="800"
//                     height="1000"
//                     src={publicId}
//                     alt={`${candidateName} Resume`}
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import { X, ExternalLink, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResumeViewerProps {
  fileUrl: string
  publicId?: string
  candidateName: string
  isOpen: boolean
  onClose: () => void
}

export function ResumeViewer({ fileUrl, candidateName, isOpen, onClose }: ResumeViewerProps) {
  if (!isOpen) return null

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = `${candidateName}_Resume`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-5xl h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold">{candidateName}'s Resume</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <iframe src={`${fileUrl}#toolbar=0`} className="w-full h-full border-0" title={`${candidateName} Resume`} />
        </div>
      </div>
    </div>
  )
}