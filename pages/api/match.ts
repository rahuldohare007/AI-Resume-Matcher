import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ message: "Missing resume or job description" });
  }

  try {
    // Call your Python FastAPI NLP microservice
    const response = await axios.post("http://localhost:8000/match", {
      resumeText,
      jobDescription,
    });

    const matchScore = response.data.matchScore;

    return res.status(200).json({ matchScore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to compute match" });
  }
}
