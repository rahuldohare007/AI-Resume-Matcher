"use client";

import { useState } from "react";
import JobInput from "../components/JobInput";
import MatchResults from "../components/MatchResults";
import axios from "axios";

export default function JobPage() {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>(""); // optional if you want live test
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleComputeMatch = async () => {
    if (!resumeText || !jobDescription) {
      alert("Please provide both resume and job description!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post<{ matchScore: number }>("/api/match", {
        resumeText,
        jobDescription,
      });

      setMatchScore(response.data.matchScore);
    } catch (error) {
      console.error(error);
      alert("Failed to compute match.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-center mb-6">💼 Job Description Input</h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Job Input Component */}
        <JobInput setJobDescription={setJobDescription} />

        {/* Optional: For testing, paste resume text here */}
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={4}
          placeholder="Paste resume text here for testing..."
          className="w-full border border-gray-300 rounded-md p-2"
        />

        {/* Compute Match Button */}
        <div className="text-center">
          <button
            onClick={handleComputeMatch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Computing..." : "Compute Match"}
          </button>
        </div>

        {/* Match Results */}
        {matchScore !== null && <MatchResults matchScore={matchScore} />}
      </div>
    </div>
  );
}
