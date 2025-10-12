import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await connectToDB();
    const users = await db.collection("users").find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}
