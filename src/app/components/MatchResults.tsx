"use client";

interface MatchResultsProps {
  matchScore: number;
}

const MatchResults: React.FC<MatchResultsProps> = ({ matchScore }) => {
  let colorClass = "text-gray-800";

  if (matchScore >= 80) colorClass = "text-green-600";
  else if (matchScore >= 50) colorClass = "text-yellow-600";
  else colorClass = "text-red-600";

  return (
    <div className="p-4 bg-white rounded-md shadow border border-gray-200 text-center">
      <h2 className="text-lg font-semibold mb-2">📊 Match Result</h2>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {matchScore.toFixed(2)}%
      </p>
    </div>
  );
};

export default MatchResults;
