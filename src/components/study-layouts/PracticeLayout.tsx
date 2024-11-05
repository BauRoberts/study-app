// components/study-layouts/PracticeLayout.tsx
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface PracticeLayoutProps {
  summary: string;
  loading?: boolean;
}

export default function PracticeLayout({
  summary,
  loading,
}: PracticeLayoutProps) {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

  // Parse problems from summary
  const problems = summary
    .split("\n\n")
    .filter(
      (section) => section.includes("Problem") || section.includes("Exercise")
    )
    .map((problem, index) => {
      const [question, ...solutionParts] = problem.split("Solution:");
      return {
        id: index,
        question: question.trim(),
        solution: solutionParts.join("Solution:").trim(),
      };
    });

  return (
    <div className="h-full overflow-auto px-4 py-6 bg-gray-50">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-green-600 rounded-full border-t-transparent" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Problem {index + 1}
                </h3>
                <div className="text-gray-800">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="text-gray-800 mb-4">{children}</p>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-800">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-gray-900 font-semibold">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {problem.question}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Your Solution:
                </label>
                <textarea
                  value={userAnswers[index] || ""}
                  onChange={(e) =>
                    setUserAnswers({
                      ...userAnswers,
                      [index]: e.target.value,
                    })
                  }
                  placeholder="Write your solution here..."
                  className="w-full h-32 p-4 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={() =>
                    setShowAnswers({
                      ...showAnswers,
                      [index]: !showAnswers[index],
                    })
                  }
                  className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                >
                  {showAnswers[index] ? "Hide Solution" : "Show Solution"}
                </button>
              </div>

              {showAnswers[index] && (
                <div className="mt-4 bg-green-50 rounded-lg p-6 border border-green-100">
                  <h4 className="text-base font-semibold text-green-900 mb-3">
                    Solution:
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="text-green-800 mb-4">{children}</p>
                        ),
                        li: ({ children }) => (
                          <li className="text-green-800">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-green-900 font-semibold">
                            {children}
                          </strong>
                        ),
                      }}
                    >
                      {problem.solution}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
