import { getCollection, Collections } from './mongodb'
import { ObjectId } from 'mongodb'

// Resume operations
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
  return await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray()
}

export async function updateResume(id: string, updateData: any) {
  const collection = await getCollection(Collections.RESUMES)
  return await collection.updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    }
  )
}

export async function deleteResume(id: string) {
  const collection = await getCollection(Collections.RESUMES)
  return await collection.deleteOne({ _id: new ObjectId(id) })
}

// Job operations
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
  return await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray()
}

export async function deleteJob(id: string) {
  const collection = await getCollection(Collections.JOBS)
  return await collection.deleteOne({ _id: new ObjectId(id) })
}

// Match operations
export async function createMatch(matchData: any) {
  const collection = await getCollection(Collections.MATCHES)
  const result = await collection.insertOne({
    ...matchData,
    createdAt: new Date(),
  })
  return result
}

export async function getMatchesByResumeId(resumeId: string) {
  const collection = await getCollection(Collections.MATCHES)
  return await collection
    .find({ resumeId })
    .sort({ score: -1 })
    .toArray()
}

export async function getMatchesByJobId(jobId: string) {
  const collection = await getCollection(Collections.MATCHES)
  return await collection
    .find({ jobId })
    .sort({ score: -1 })
    .toArray()
}

export async function getAllMatches() {
  const collection = await getCollection(Collections.MATCHES)
  return await collection
    .find({})
    .sort({ score: -1 })
    .toArray()
}

export async function deleteMatchesByResumeId(resumeId: string) {
  const collection = await getCollection(Collections.MATCHES)
  return await collection.deleteMany({ resumeId })
}

export async function deleteMatchesByJobId(jobId: string) {
  const collection = await getCollection(Collections.MATCHES)
  return await collection.deleteMany({ jobId })
}