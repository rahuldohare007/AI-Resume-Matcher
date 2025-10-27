"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MatchResult } from "@/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface ScoreDistributionProps {
  matches: MatchResult[]
}

export function ScoreDistribution({ matches }: ScoreDistributionProps) {
  const distributionData = useMemo(() => {
    const ranges = [
      { name: "0-20%", min: 0, max: 0.2, count: 0, color: "#ef4444" },
      { name: "20-40%", min: 0.2, max: 0.4, count: 0, color: "#f59e0b" },
      { name: "40-60%", min: 0.4, max: 0.6, count: 0, color: "#eab308" },
      { name: "60-80%", min: 0.6, max: 0.8, count: 0, color: "#84cc16" },
      { name: "80-100%", min: 0.8, max: 1.0, count: 0, color: "#22c55e" },
    ]

    matches.forEach((match) => {
      const range = ranges.find(
        (r) => match.score >= r.min && match.score < r.max
      ) || ranges[ranges.length - 1]
      
      range.count++
    })

    return ranges
  }, [matches])

  if (matches.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Distribution</CardTitle>
        <CardDescription>
          Distribution of match scores across all candidates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} candidates`, "Count"]}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}