import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Check, Eye, EyeOff } from "lucide-react";

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

  const renderMarkdown = (content: string) => (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 text-2xl font-bold text-[#012622]">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 text-xl font-semibold text-[#012622]/90">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 text-lg font-medium text-[#012622]/80">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-[#012622]/70">{children}</p>
        ),
        li: ({ children }) => (
          <li className="mb-2 text-[#012622]/70">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-[#012622]">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#012622] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2E7] p-6">
      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="max-w-3xl mx-auto space-y-6 pr-4">
          {problems.map((problem, index) => (
            <Card key={index} className="border-none shadow-lg bg-[#E7E5D8]">
              <CardHeader className="border-b border-[#B0AE9F]/20 bg-[#CFCEC4]">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#012622]" />
                  <CardTitle className="text-xl font-semibold text-[#012622]">
                    Problem {index + 1}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Question Section */}
                <div className="prose prose-lg max-w-none">
                  {renderMarkdown(problem.question)}
                </div>

                {/* Answer Input Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#012622]">
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
                    className="w-full min-h-[8rem] p-4 rounded-lg border border-[#B0AE9F]/20 
                             bg-[#F4F2E7] text-[#012622] placeholder:text-[#012622]/40 
                             focus:border-[#012622] focus:outline-none focus:ring-1 focus:ring-[#012622]
                             transition-colors resize-y"
                  />
                </div>

                {/* Solution Toggle Button */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() =>
                      setShowAnswers({
                        ...showAnswers,
                        [index]: !showAnswers[index],
                      })
                    }
                    className="group flex items-center space-x-2 rounded-md px-4 py-2 text-sm 
                             font-medium text-[#012622] transition-colors hover:bg-[#012622] hover:text-white"
                  >
                    {showAnswers[index] ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Solution
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show Solution
                      </>
                    )}
                  </button>
                </div>

                {/* Solution Section */}
                {showAnswers[index] && (
                  <div className="mt-4 bg-[#F4F2E7] rounded-lg p-6 border border-[#B0AE9F]/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Check className="h-5 w-5 text-[#012622]" />
                      <h4 className="text-lg font-medium text-[#012622]">
                        Solution:
                      </h4>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      {renderMarkdown(problem.solution)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
