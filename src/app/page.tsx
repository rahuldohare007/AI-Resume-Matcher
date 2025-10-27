import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Target, TrendingUp, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Recruitment</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Match Resumes to Jobs with AI Precision
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Leverage Sentence-BERT embeddings to find the perfect candidate-job fit. 
          Make data-driven hiring decisions in seconds, not hours.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Link href="/upload">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
          <p className="text-gray-600">
            Uses Sentence-BERT to understand semantic similarity between resumes and job descriptions
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Ranking</h3>
          <p className="text-gray-600">
            Automatically ranks candidates based on skills, experience, and role alignment
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
          <p className="text-gray-600">
            Visualize match scores, keyword analysis, and candidate distributions
          </p>
        </div>
      </div>
    </div>
  )
}