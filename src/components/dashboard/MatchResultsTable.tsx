"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MatchResult } from "@/types"
import { formatPercentage } from "@/lib/utils"

// ✅ Add this import
import { ResumeViewer } from "./ResumeViewer"

interface MatchResultsTableProps {
  matches: MatchResult[]
  isLoading?: boolean
  onRefresh?: () => void
}

type SortField = "candidateName" | "jobTitle" | "score"
type SortOrder = "asc" | "desc"

export function MatchResultsTable({ 
  matches, 
  isLoading = false,
  onRefresh 
}: MatchResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>("score")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // ✅ Add these states for the resume viewer
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState<{
    url: string
    name: string
    publicId?: string
  } | null>(null)

  // Sorting logic
  const sortedMatches = [...matches].sort((a, b) => {
    let comparison = 0
    
    switch (sortField) {
      case "candidateName":
        comparison = a.candidateName.localeCompare(b.candidateName)
        break
      case "jobTitle":
        comparison = a.jobTitle.localeCompare(b.jobTitle)
        break
      case "score":
        comparison = a.score - b.score
        break
    }
    
    return sortOrder === "asc" ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    )
  }

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-600">Loading match results...</p>
        </CardContent>
      </Card>
    )
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">No matches found</p>
          <p className="text-sm text-gray-500">Upload resumes and create job descriptions to see matches</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Match Results ({matches.length})</CardTitle>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("candidateName")}
                      className="flex items-center hover:text-gray-700"
                    >
                      Candidate
                      <SortIcon field="candidateName" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("jobTitle")}
                      className="flex items-center hover:text-gray-700"
                    >
                      Job Title
                      <SortIcon field="jobTitle" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("score")}
                      className="flex items-center hover:text-gray-700"
                    >
                      Match Score
                      <SortIcon field="score" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {sortedMatches.map((match) => (
                    <motion.tr
                      key={match.resumeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {match.candidateName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{match.jobTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${match.score * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className={`h-2 rounded-full ${
                                match.score >= 0.8
                                  ? "bg-green-500"
                                  : match.score >= 0.6
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                          </div>
                          <Badge
                            variant={
                              match.score >= 0.8
                                ? "success"
                                : match.score >= 0.6
                                ? "warning"
                                : "destructive"
                            }
                            className="font-semibold"
                          >
                            {formatPercentage(match.score)}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {/* ✅ Updated Eye button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Replace this placeholder with your API call to get the resume URL
                              setSelectedResume({
                                url: "https://example.com/sample-resume.pdf",
                                name: match.candidateName,
                                publicId: "cloudinary-public-id",
                              })
                              setViewerOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {sortedMatches.map(
              (match) =>
                expandedRow === match.resumeId && (
                  <motion.div
                    key={`expanded-${match.resumeId}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t bg-gray-50 overflow-hidden"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Matched Keywords */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Matched Keywords ({match.matchedKeywords.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {match.matchedKeywords.map((keyword, idx) => (
                            <Badge key={idx} variant="success">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Missing Keywords */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Missing Keywords ({match.missingKeywords.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {match.missingKeywords.map((keyword, idx) => (
                            <Badge key={idx} variant="destructive">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* ✅ Add Resume Viewer at the end */}
      {selectedResume && (
        <ResumeViewer
          fileUrl={selectedResume.url}
          publicId={selectedResume.publicId}
          candidateName={selectedResume.name}
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false)
            setSelectedResume(null)
          }}
        />
      )}
    </>
  )
}
