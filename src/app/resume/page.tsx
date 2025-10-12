"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const response = await axios.post<{ success: boolean; resumeId: string }>("/api/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Resume uploaded successfully!");
        // Optionally fetch the saved resume text from backend
        setResumeText("Resume uploaded successfully. Ready for matching!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-center mb-6">📄 Upload Resume</h1>

      <div className="max-w-2xl mx-auto space-y-4">
        <label htmlFor="resume-upload" className="block font-medium mb-1">
          Select your resume file
        </label>
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-md p-2"
          title="Upload your resume file"
          placeholder="Choose a file"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

        {resumeText && (
          <div className="p-4 bg-white shadow rounded-md border border-gray-200">
            <h2 className="font-semibold mb-2">Resume Status / Preview:</h2>
            <p className="text-gray-700">{resumeText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
