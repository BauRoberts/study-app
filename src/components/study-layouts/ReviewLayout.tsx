// components/study-layouts/ReviewLayout.tsx
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ReviewLayoutProps {
  summary: string;
  loading?: boolean;
}

interface Flashcard {
  question: string;
  answer: string;
}

type TabType = "summary" | "flashcards" | "quiz";

export default function ReviewLayout({ summary, loading }: ReviewLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [mastered, setMastered] = useState<Record<number, boolean>>({});

  const tabs: TabType[] = ["summary", "flashcards", "quiz"];

  const flashcards: Flashcard[] = summary
    .split("\n\n")
    .filter(
      (section: string) => section.includes("Q:") && section.includes("A:")
    )
    .map((card: string) => {
      const [question, answer] = card.split("A:");
      return {
        question: question.replace("Q:", "").trim(),
        answer: answer.trim(),
      };
    });

  const handleNextCard = (): void => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = (): void => {
    setShowAnswer(false);
    setCurrentCardIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  const renderMarkdown = (
    content: string,
    textColorClass: string = "text-gray-800"
  ) => (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className={`${textColorClass} mb-4`}>{children}</p>
        ),
        li: ({ children }) => <li className={textColorClass}>{children}</li>,
        strong: ({ children }) => (
          <strong className="text-gray-900 font-semibold">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  const renderSummaryTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="prose prose-lg max-w-none">
            {renderMarkdown(summary)}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">
            Quick Reference
          </h3>
          <ul className="space-y-3">
            {summary
              .split("\n")
              .filter(
                (line: string) => line.startsWith("• ") || line.startsWith("- ")
              )
              .map((point: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-purple-700">•</span>
                  <span className="text-purple-900">
                    {point.replace(/^[•-]\s+/, "")}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderFlashcardsTab = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-purple-50 px-6 py-3 border-b border-purple-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-purple-900">
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
            <span className="text-sm font-medium text-purple-900">
              {Object.values(mastered).filter(Boolean).length} Mastered
            </span>
          </div>
        </div>

        <div className="p-6 min-h-[300px] flex flex-col justify-between">
          <div className="prose prose-lg max-w-none">
            <div className="mb-4">
              <strong className="text-gray-900">Question:</strong>
              {renderMarkdown(flashcards[currentCardIndex].question)}
            </div>

            {showAnswer && (
              <div className="mt-4 pt-4 border-t">
                <strong className="text-gray-900">Answer:</strong>
                {renderMarkdown(flashcards[currentCardIndex].answer)}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
            >
              ← Previous
            </button>

            <div className="space-x-2">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
              >
                {showAnswer ? "Hide Answer" : "Show Answer"}
              </button>
              {showAnswer && (
                <button
                  onClick={() => {
                    setMastered((prev) => ({
                      ...prev,
                      [currentCardIndex]: !prev[currentCardIndex],
                    }));
                  }}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      mastered[currentCardIndex]
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }
                  `}
                >
                  {mastered[currentCardIndex] ? "Mastered" : "Mark as Mastered"}
                </button>
              )}
            </div>

            <button
              onClick={handleNextCard}
              className="px-4 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-base font-medium text-gray-900 mb-2">
            Mastery Progress
          </h3>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.values(mastered).filter(Boolean).length /
                    flashcards.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
  const renderQuizTab = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-purple-50 rounded-lg p-6 mb-4 border border-purple-100">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Self-Assessment Quiz
        </h3>
        <p className="text-purple-900">
          Test your knowledge with these review questions.
        </p>
      </div>

      <div className="space-y-6">
        {flashcards.slice(0, 5).map((card: Flashcard, index: number) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Question {index + 1}:
            </h4>
            {renderMarkdown(card.question)}
            <button
              onClick={() => setShowAnswer(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
            >
              Check Answer
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-purple-600 rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto px-4 py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex space-x-8 px-4">
            {tabs.map((tab: TabType) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-4 border-b-2 font-medium text-base
                  transition-all
                  ${
                    activeTab === tab
                      ? "border-purple-500 text-purple-800"
                      : "border-transparent text-gray-700 hover:text-purple-600 hover:border-purple-300"
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content for each tab */}
        {activeTab === "summary" && renderSummaryTab()}
        {activeTab === "flashcards" &&
          flashcards.length > 0 &&
          renderFlashcardsTab()}
        {activeTab === "quiz" && renderQuizTab()}
      </div>
    </div>
  );
}
