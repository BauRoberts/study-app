// components/study-layouts/LearnLayout.tsx
"use client";

import ReactMarkdown from "react-markdown";

interface LearnLayoutProps {
  summary: string;
  loading?: boolean;
}

export default function LearnLayout({ summary, loading }: LearnLayoutProps) {
  return (
    <div className="h-full overflow-auto px-4 py-6">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 rounded-full border-t-transparent" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-gray-900">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-gray-900">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-gray-900">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-800">{children}</p>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-800">{children}</li>
                  ),
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          </div>

          {/* Study Tools Section */}
          <div className="space-y-6">
            {/* Quick Notes */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Notes
              </h3>
              <textarea
                className="w-full h-32 p-2 border rounded-md text-gray-800 placeholder-gray-500"
                placeholder="Take notes while you study..."
              />
            </div>

            {/* Key Points */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Key Points
              </h3>
              <ul className="space-y-2">
                {summary
                  .split("\n")
                  .filter(
                    (line) => line.startsWith("- ") || line.startsWith("* ")
                  )
                  .map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2">
                        {index + 1}
                      </span>
                      <span className="text-gray-800">
                        {point.replace(/^[- *] /, "")}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
