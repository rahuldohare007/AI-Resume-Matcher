// pages/api/resume.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false, // Disable default parser for file uploads
  },
};

type Data = {
  success?: boolean;
  resumeId?: string;
  text?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ message: "File upload failed" });
    }

    const file = files.resume as formidable.File;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      let text = "";

      if (file.originalFilename?.endsWith(".pdf")) {
        const dataBuffer = fs.readFileSync(file.filepath);
        const pdfData = await pdfParse(dataBuffer);
        text = pdfData.text;
      } else if (
        file.originalFilename?.endsWith(".doc") ||
        file.originalFilename?.endsWith(".docx")
      ) {
        // Placeholder: DOC/DOCX parsing logic here
        text = "DOC/DOCX parsing logic goes here";
      } else {
        return res.status(400).json({ message: "Unsupported file type" });
      }

      // Save in MongoDB
      const db = await connectToDB();
      const result = await db.collection("resumes").insertOne({
        filename: file.originalFilename,
        text,
        createdAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        resumeId: result.insertedId.toString(),
        text,
      });
    } catch (error) {
      console.error("Resume processing error:", error);
      return res.status(500).json({ message: "Failed to process resume" });
    }
  });
}
