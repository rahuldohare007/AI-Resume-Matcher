// import { MongoClient, Db } from 'mongodb'

// if (!process.env.MONGODB_URI) {
//   throw new Error('❌ Please add your MongoDB URI to .env.local')
// }

// if (!process.env.MONGODB_DB) {
//   throw new Error('❌ Please add your MongoDB_DB name to .env.local')
// }

// const uri = process.env.MONGODB_URI
// const dbName = process.env.MONGODB_DB
// const options = {}

// let client: MongoClient
// let clientPromise: Promise<MongoClient>

// // 🧠 Use global variable in development to preserve connection across hot reloads
// if (process.env.NODE_ENV === 'development') {
//   const globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>
//   }

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     globalWithMongo._mongoClientPromise = client.connect()
//   }

//   clientPromise = globalWithMongo._mongoClientPromise
// } else {
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

// /**
//  * Get connected database instance
//  */
// export async function getDatabase(): Promise<Db> {
//   const client = await clientPromise
//   return client.db(dbName) // ✅ Uses the value from .env (AI-resume-matcher)
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


// import { MongoClient, Db } from 'mongodb'

// if (!process.env.MONGODB_URI) {
//   throw new Error('❌ Please add your MongoDB URI to .env.local')
// }

// if (!process.env.MONGODB_DB) {
//   throw new Error('❌ Please add your MongoDB_DB name to .env.local')
// }

// const uri = process.env.MONGODB_URI
// const dbName = process.env.MONGODB_DB
// const options = {}

// let client: MongoClient
// let clientPromise: Promise<MongoClient>

// // 🧠 Use global variable in development to preserve connection across hot reloads
// if (process.env.NODE_ENV === 'development') {
//   const globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>
//   }

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     globalWithMongo._mongoClientPromise = client.connect()
//   }

//   clientPromise = globalWithMongo._mongoClientPromise
// } else {
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

// /**
//  * Get connected database instance
//  */
// export async function getDatabase(): Promise<Db> {
//   const client = await clientPromise
//   return client.db(dbName) // ✅ Uses the value from .env (AI-resume-matcher)
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


import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('❌ Please add your MongoDB URI to .env.local')
}

if (!process.env.MONGODB_DB) {
  throw new Error('❌ Please add your MONGODB_DB name to .env.local')
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

async function ensureIndexes(db: Db) {
  // Prevent duplicate matches for the same resumeId + jobId
  await db.collection('matches').createIndex(
    { resumeId: 1, jobId: 1 },
    { unique: true, name: 'uniq_resume_job' }
  )
}

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
    _indexesEnsured?: boolean
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().then(async (c) => {
      const db = c.db(dbName)
      if (!globalWithMongo._indexesEnsured) {
        try {
          await ensureIndexes(db)
          globalWithMongo._indexesEnsured = true
        } catch (e) {
          console.warn('⚠️ Index ensure warning:', (e as Error).message)
        }
      }
      return c
    })
  }

  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect().then(async (c) => {
    const db = c.db(dbName)
    try {
      await ensureIndexes(db)
    } catch (e) {
      console.warn('⚠️ Index ensure warning:', (e as Error).message)
    }
    return c
  })
}

/**
 * Get connected database instance
 */
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

/**
 * Get specific collection
 */
export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  return db.collection(collectionName)
}

/**
 * Common collection constants
 */
export const Collections = {
  RESUMES: 'resumes',
  JOBS: 'jobs',
  MATCHES: 'matches',
  USERS: 'users',
} as const

export default clientPromise