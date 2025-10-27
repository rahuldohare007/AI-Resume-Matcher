"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface ResumePreviewProps {
  fileUrl: string
  candidateName: string
  isOpen: boolean
  onClose: () => void
}

export function ResumePreview({ 
  fileUrl, 
  candidateName, 
  isOpen, 
  onClose 
}: ResumePreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{candidateName}'s Resume</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {fileUrl.endsWith('.pdf') ? (
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              title={`${candidateName} Resume`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-gray-600">Preview not available for this file type</p>
              <Button asChild>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}