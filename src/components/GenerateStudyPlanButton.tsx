"use client";

import { useState } from "react";

interface GenerateStudyPlanButtonProps {
  studyBlockId: string;
  onPlanGenerated: () => void;
}

export default function GenerateStudyPlanButton({
  studyBlockId,
  onPlanGenerated,
}: GenerateStudyPlanButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/study-blocks/${studyBlockId}/generate-plan`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate study plan");
      }

      onPlanGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <button
        onClick={handleGeneratePlan}
        disabled={loading}
        className={`text-sm px-4 py-2 rounded-md ${
          loading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 border-b-2 border-indigo-600 rounded-full mr-2" />
            Generating...
          </div>
        ) : (
          "Generate Study Plan"
        )}
      </button>
    </div>
  );
}
