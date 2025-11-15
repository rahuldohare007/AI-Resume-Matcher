// import { getCollection, Collections } from './mongodb'
// import { ObjectId } from 'mongodb'

// // Resume operations
// export async function createResume(resumeData: any) {
//   const collection = await getCollection(Collections.RESUMES)
//   const result = await collection.insertOne({
//     ...resumeData,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   })
//   return result
// }

// export async function getResumeById(id: string) {
//   const collection = await getCollection(Collections.RESUMES)
//   return await collection.findOne({ _id: new ObjectId(id) })
// }

// export async function getAllResumes() {
//   const collection = await getCollection(Collections.RESUMES)
//   return await collection
//     .find({})
//     .sort({ createdAt: -1 })
//     .toArray()
// }

// export async function updateResume(id: string, updateData: any) {
//   const collection = await getCollection(Collections.RESUMES)
//   return await collection.updateOne(
//     { _id: new ObjectId(id) },
//     { 
//       $set: {
//         ...updateData,
//         updatedAt: new Date()
//       }
//     }
//   )
// }

// export async function deleteResume(id: string) {
//   const collection = await getCollection(Collections.RESUMES)
//   return await collection.deleteOne({ _id: new ObjectId(id) })
// }

// // Job operations
// export async function createJob(jobData: any) {
//   const collection = await getCollection(Collections.JOBS)
//   const result = await collection.insertOne({
//     ...jobData,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   })
//   return result
// }

// export async function getJobById(id: string) {
//   const collection = await getCollection(Collections.JOBS)
//   return await collection.findOne({ _id: new ObjectId(id) })
// }

// export async function getAllJobs() {
//   const collection = await getCollection(Collections.JOBS)
//   return await collection
//     .find({})
//     .sort({ createdAt: -1 })
//     .toArray()
// }

// export async function deleteJob(id: string) {
//   const collection = await getCollection(Collections.JOBS)
//   return await collection.deleteOne({ _id: new ObjectId(id) })
// }

// // Match operations
// export async function createMatch(matchData: any) {
//   const collection = await getCollection(Collections.MATCHES)
//   const result = await collection.insertOne({
//     ...matchData,
//     createdAt: new Date(),
//   })
//   return result
// }

// export async function getMatchesByResumeId(resumeId: string) {
//   const collection = await getCollection(Collections.MATCHES)
//   return await collection
//     .find({ resumeId })
//     .sort({ score: -1 })
//     .toArray()
// }

// export async function getMatchesByJobId(jobId: string) {
//   const collection = await getCollection(Collections.MATCHES)
//   return await collection
//     .find({ jobId })
//     .sort({ score: -1 })
//     .toArray()
// }

// export async function getAllMatches() {
//   const collection = await getCollection(Collections.MATCHES)
//   return await collection
//     .find({})
//     .sort({ score: -1 })
//     .toArray()
// }

// export async function deleteMatchesByResumeId(resumeId: string) {
//   const collection = await getCollection(Collections.MATCHES)
//   return await collection.deleteMany({ resumeId })
// }

// export async function deleteMatchesByJobId(jobId: string) {
//   const collection = await getCollection(Collections.MATCHES)
//   return await collection.deleteMany({ jobId })
// }

// import { MongoClient, Db } from 'mongodb'

// if (!process.env.MONGODB_URI) {
//   throw new Error('❌ Please add your MongoDB URI to .env.local')
// }

// if (!process.env.MONGODB_DB) {
//   throw new Error('❌ Please add your MONGODB_DB name to .env.local')
// }

// const uri = process.env.MONGODB_URI
// const dbName = process.env.MONGODB_DB
// const options = {}

// let client: MongoClient
// let clientPromise: Promise<MongoClient>

// async function ensureIndexes(db: Db) {
//   // Prevent duplicate matches for the same resumeId + jobId
//   await db.collection('matches').createIndex(
//     { resumeId: 1, jobId: 1 },
//     { unique: true, name: 'uniq_resume_job' }
//   )
// }

// if (process.env.NODE_ENV === 'development') {
//   const globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>
//     _indexesEnsured?: boolean
//   }

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     globalWithMongo._mongoClientPromise = client.connect().then(async (c) => {
//       const db = c.db(dbName)
//       if (!globalWithMongo._indexesEnsured) {
//         try {
//           await ensureIndexes(db)
//           globalWithMongo._indexesEnsured = true
//         } catch (e) {
//           console.warn('⚠️ Index ensure warning:', (e as Error).message)
//         }
//       }
//       return c
//     })
//   }

//   clientPromise = globalWithMongo._mongoClientPromise
// } else {
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect().then(async (c) => {
//     const db = c.db(dbName)
//     try {
//       await ensureIndexes(db)
//     } catch (e) {
//       console.warn('⚠️ Index ensure warning:', (e as Error).message)
//     }
//     return c
//   })
// }

// /**
//  * Get connected database instance
//  */
// export async function getDatabase(): Promise<Db> {
//   const client = await clientPromise
//   return client.db(dbName)
// }

// /**
//  * Get specific collection
//  */
// export async function getCollection(collectionName: string) {
//   const db = await getDatabase()
//   return db.collection(collectionName)
// }

// /**
//  * Common collection constants
//  */
// export const Collections = {
//   RESUMES: 'resumes',
//   JOBS: 'jobs',
//   MATCHES: 'matches',
//   USERS: 'users',
// } as const

// export default clientPromise

import { getCollection, Collections } from "./mongodb"
import { ObjectId } from "mongodb"

// ========== RESUMES ==========
export async function createResume(resumeData: any) {
  const collection = await getCollection(Collections.RESUMES)
  const result = await collection.insertOne({
    ...resumeData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}

export async function getResumeById(id: string) {
  const collection = await getCollection(Collections.RESUMES)
  return await collection.findOne({ _id: new ObjectId(id) })
}

export async function getAllResumes() {
  const collection = await getCollection(Collections.RESUMES)
  return await collection.find({}).sort({ createdAt: -1 }).toArray()
}

export async function updateResume(id: string, updateData: any) {
  const collection = await getCollection(Collections.RESUMES)
  return await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  )
}

export async function deleteResume(id: string) {
  const collection = await getCollection(Collections.RESUMES)
  return await collection.deleteOne({ _id: new ObjectId(id) })
}

// ========== JOBS ==========
export async function createJob(jobData: any) {
  const collection = await getCollection(Collections.JOBS)
  const result = await collection.insertOne({
    ...jobData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}

export async function getJobById(id: string) {
  const collection = await getCollection(Collections.JOBS)
  return await collection.findOne({ _id: new ObjectId(id) })
}

export async function getAllJobs() {
  const collection = await getCollection(Collections.JOBS)
  return await collection.find({}).sort({ createdAt: -1 }).toArray()
}

export async function deleteJob(id: string) {
  const collection = await getCollection(Collections.JOBS)
  return await collection.deleteOne({ _id: new ObjectId(id) })
}

// ========== MATCHES (DE-DUPED) ==========
export async function upsertMatch(matchData: any) {
  const collection = await getCollection(Collections.MATCHES)
  await collection.updateOne(
    { resumeId: matchData.resumeId, jobId: matchData.jobId },
    {
      $set: {
        candidateName: matchData.candidateName,
        candidateEmail: matchData.candidateEmail,
        jobTitle: matchData.jobTitle,
        score: matchData.score,
        matchedKeywords: matchData.matchedKeywords || [],
        missingKeywords: matchData.missingKeywords || [],
        resumeKeywords: matchData.resumeKeywords || [],
        jobKeywords: matchData.jobKeywords || [],
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  )
  return { upserted: true }
}

// Backward-compat alias if some code still calls createMatch
export async function createMatch(matchData: any) {
  return upsertMatch(matchData)
}

export async function getMatchesByResumeId(resumeId: string) {
  const collection = await getCollection(Collections.MATCHES)
  return await collection.find({ resumeId }).sort({ score: -1 }).toArray()
}

export async function getMatchesByJobId(jobId: string) {
  const collection = await getCollection(Collections.MATCHES)
  return await collection.find({ jobId }).sort({ score: -1 }).toArray()
}

export async function getAllMatches() {
  const collection = await getCollection(Collections.MATCHES)
  return await collection.find({}).sort({ score: -1 }).toArray()
}

export async function deleteMatchesByResumeId(resumeId: string) {
  const collection = await getCollection(Collections.MATCHES)
  return await collection.deleteMany({ resumeId })
}

export async function deleteMatchesByJobId(jobId: string) {
  const collection = await getCollection(Collections.MATCHES)
  return await collection.deleteMany({ jobId })
}