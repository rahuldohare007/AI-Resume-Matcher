"use client";

import { useState } from "react";

interface JobInputProps {
  setJobDescription: (text: string) => void;
}

const JobInput: React.FC<JobInputProps> = ({ setJobDescription }) => {
  const [jobText, setJobText] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobText(e.target.value);
    setJobDescription(e.target.value);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">💼 Job Description</h2>
      <textarea
        value={jobText}
        onChange={handleChange}
        rows={6}
        className="w-full border border-gray-300 rounded-md p-2"
        placeholder="Paste or type the job description here..."
      />
    </div>
  );
};

export default JobInput;
