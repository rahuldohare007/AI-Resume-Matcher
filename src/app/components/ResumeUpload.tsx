"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";

interface ResumeUploadProps {
  setResumeText: (text: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ setResumeText }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume file!");
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
        setResumeText("Resume uploaded successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">📄 Upload Resume</h2>
      <label htmlFor="resume-upload" className="block mb-1 font-medium">
        Select your resume file
      </label>
      <input
        id="resume-upload"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded-md p-2 mb-2"
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
    </div>
  );
};

export default ResumeUpload;
