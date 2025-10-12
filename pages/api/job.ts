import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Missing title or description" });
    }

    try {
      const db = await connectToDB();
      const result = await db.collection("jobs").insertOne({
        title,
        description,
        createdAt: new Date(),
      });

      return res.status(200).json({ success: true, jobId: result.insertedId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to save job" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
