// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Brain, Zap, Target, TrendingUp, ArrowRight, Upload, Briefcase, BarChart } from "lucide-react"

// export default function Home() {
//   return (
//     <div className="container mx-auto px-4 py-16">
//       {/* Hero Section */}
//       <div className="text-center max-w-4xl mx-auto mb-20">
//         <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
//           <Zap className="w-4 h-4" />
//           <span className="text-sm font-medium">AI-Powered Recruitment</span>
//         </div>
        
//         <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Match Resumes to Jobs with AI Precision
//         </h1>
        
//         <p className="text-xl text-gray-600 mb-8">
//           Leverage Sentence-BERT embeddings to find the perfect candidate-job fit. 
//           Make data-driven hiring decisions in seconds, not hours.
//         </p>
        
//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
//           <Link href="/upload">
//             <Button size="lg" className="gap-2 w-full sm:w-auto">
//               <Upload className="w-4 h-4" />
//               Upload Resume
//               <ArrowRight className="w-4 h-4" />
//             </Button>
//           </Link>
//           <Link href="/jobs">
//             <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
//               <Briefcase className="w-4 h-4" />
//               Create Job
//             </Button>
//           </Link>
//           <Link href="/dashboard">
//             <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
//               <BarChart className="w-4 h-4" />
//               View Dashboard
//             </Button>
//           </Link>
//         </div>

//         {/* Quick Workflow Guide */}
//         <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-100">
//           <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
//             <Zap className="w-5 h-5 text-blue-600" />
//             How It Works
//           </h3>
//           <div className="grid md:grid-cols-4 gap-6 text-left">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
//                 1
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-1">Upload Resumes</h4>
//               <p className="text-sm text-gray-600">Upload candidate CVs in PDF or DOCX format</p>
//             </div>
//             <div className="flex flex-col items-center text-center">
//               <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
//                 2
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-1">Create Jobs</h4>
//               <p className="text-sm text-gray-600">Define job requirements and descriptions</p>
//             </div>
//             <div className="flex flex-col items-center text-center">
//               <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
//                 3
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-1">AI Matching</h4>
//               <p className="text-sm text-gray-600">Our AI analyzes and matches candidates</p>
//             </div>
//             <div className="flex flex-col items-center text-center">
//               <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
//                 4
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-1">View Results</h4>
//               <p className="text-sm text-gray-600">See ranked matches with insights</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features */}
//       <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
//           <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//             <Brain className="w-6 h-6 text-blue-600" />
//           </div>
//           <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
//           <p className="text-gray-600">
//             Uses Sentence-BERT to understand semantic similarity between resumes and job descriptions
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
//           <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
//             <Target className="w-6 h-6 text-purple-600" />
//           </div>
//           <h3 className="text-xl font-semibold mb-2">Smart Ranking</h3>
//           <p className="text-gray-600">
//             Automatically ranks candidates based on skills, experience, and role alignment
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
//           <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
//             <TrendingUp className="w-6 h-6 text-green-600" />
//           </div>
//           <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
//           <p className="text-gray-600">
//             Visualize match scores, keyword analysis, and candidate distributions
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Target, TrendingUp, ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 px-4 py-2 rounded-full mb-6 border border-blue-200 dark:border-blue-800">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold">AI-Powered Recruitment</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Match Resumes to Jobs with AI Precision
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
          Leverage <span className="font-semibold text-purple-600 dark:text-purple-400">Sentence-BERT</span> embeddings to find the perfect candidate-job fit. Make data-driven hiring decisions in <span className="font-semibold text-blue-600 dark:text-blue-400">seconds</span>, not hours.
        </p>

        <Link href="/upload">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-purple-500/30 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-blue-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">AI-Powered Matching</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Uses Sentence-BERT to understand semantic similarity between resumes and job descriptions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-purple-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Smart Ranking</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Automatically ranks candidates based on skills, experience, and role alignment
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-green-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Data-Driven Insights</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Visualize match scores, keyword analysis, and candidate distributions
          </p>
        </div>
      </div>
    </div>
  )
}