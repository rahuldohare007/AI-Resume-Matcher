"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, TrendingUp, Users, Briefcase } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MatchResultsTable } from "./MatchResultsTable"
import { ScoreDistribution } from "./ScoreDistribution"
import { MatchResult } from "@/types"
import toast from "react-hot-toast"

export function MatchDashboard() {
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => { fetchMatches() }, [])

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/matches")
      const data = await res.json()
      if (data.success) {
        const list: MatchResult[] = data.data || []
        // ✅ newest first by createdAt, then by score desc as a secondary
        const sorted = [...list].sort((a, b) => {
          const aTime = new Date(a.createdAt ?? 0).getTime()
          const bTime = new Date(b.createdAt ?? 0).getTime()
          if (bTime !== aTime) return bTime - aTime
          return (b.score ?? 0) - (a.score ?? 0)
        })
        setMatches(sorted)
      } else {
        toast.error("Failed to fetch matches")
      }
    } catch (e) {
      toast.error("Error loading matches")
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  // search filter (client-side)
  const filteredMatches = useMemo(() => {
    if (!searchTerm) return matches
    const q = searchTerm.toLowerCase()
    return matches.filter(m =>
      m.candidateName.toLowerCase().includes(q) ||
      m.jobTitle.toLowerCase().includes(q)
    )
  }, [matches, searchTerm])

  const avgScore = filteredMatches.length
    ? filteredMatches.reduce((s, m) => s + (m.score ?? 0), 0) / filteredMatches.length
    : 0

  const topMatches = filteredMatches.filter(m => (m.score ?? 0) >= 0.8).length

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Match Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Newest candidates appear first. Use search to filter by candidate or job title.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMatches.length}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Rows shown</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgScore * 100).toFixed(1)}%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Mean match percentage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Matches</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topMatches}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Scores above 80%</p>
          </CardContent>
        </Card>
      </div>

      <ScoreDistribution matches={filteredMatches} />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by candidate name or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <MatchResultsTable matches={filteredMatches} isLoading={isLoading} onRefresh={fetchMatches} />
    </div>
  )
}