import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 px-4 py-2 rounded-full mb-6 border border-blue-200 dark:border-blue-800">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold">AI-Powered Recruitment</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          <span className="text-gray-900 dark:text-white">
            Match Resumes to Jobs
          </span>
          <br />
          <span className="text-indigo-600 dark:text-indigo-400">
            with AI Precision
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
          Leverage{" "}
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Sentence-BERT
          </span>{" "}
          embeddings to find the perfect candidate-job fit. Make data-driven
          hiring decisions in{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            seconds
          </span>
          , not hours.
        </p>
        <Link href="/upload">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg px-9 py-7 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-indigo-600/40 transition-all duration-300 transform hover:scale-105"
          >
            {/* Subtle inner glow */}
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Sparkles className="w-5 h-5 mr-2.5 group-hover:rotate-12 transition-transform" />
            Get Started
            <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-blue-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            AI-Powered Matching
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Uses Sentence-BERT to understand semantic similarity between resumes
            and job descriptions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-purple-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            Smart Ranking
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Automatically ranks candidates based on skills, experience, and role
            alignment
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-green-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            Data-Driven Insights
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Visualize match scores, keyword analysis, and candidate
            distributions
          </p>
        </div>
      </div>
    </div>
  );
}
