// export interface Resume {
//   id: string
//   candidateName: string
//   email: string
//   fileUrl: string
//   extractedText: string
//   uploadedAt: Date
// }

// export interface JobDescription {
//   id: string
//   title: string
//   description: string
//   requirements: string
//   createdAt: Date
// }

// export interface MatchResult {
//   resumeId: string
//   jobId: string
//   candidateName: string
//   jobTitle: string
//   score: number
//   matchedKeywords: string[]
//   missingKeywords: string[]
// }

// export interface UploadResponse {
//   success: boolean
//   message: string
//   data?: {
//     resumeId: string
//     extractedText: string
//   }
// }

// export interface MatchResponse {
//   success: boolean
//   message: string
//   data?: MatchResult[]
// }

export interface Resume {
  id: string
  candidateName: string
  email: string
  fileUrl: string
  extractedText: string
  uploadedAt: Date
}

export interface JobDescription {
  id: string
  title: string
  description: string
  requirements: string
  createdAt: Date
}

export interface MatchResult {
  id?: string            // ✅ unique row id from DB (_id)
  resumeId: string
  jobId: string
  candidateName: string
  jobTitle: string
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  createdAt?: string | Date // ✅ for sorting newest-first
}

export interface UploadResponse {
  success: boolean
  message: string
  data?: {
    resumeId: string
    extractedText: string
  }
}

export interface MatchResponse {
  success: boolean
  message: string
  data?: MatchResult[]
}