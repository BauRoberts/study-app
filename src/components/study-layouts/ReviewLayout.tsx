import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Flashlight,
  GraduationCap,
} from "lucide-react";

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

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

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

  const renderSummaryTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border-none shadow-lg bg-[#E7E5D8]">
        <CardHeader className="border-b border-[#B0AE9F]/20 bg-[#CFCEC4]">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-[#012622]" />
            <CardTitle className="text-xl font-semibold text-[#012622]">
              Summary
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="prose prose-lg max-w-none pr-4">
              {renderMarkdown(summary)}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-[#E7E5D8]">
        <CardHeader className="border-b border-[#B0AE9F]/20 bg-[#CFCEC4]">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#012622]" />
            <CardTitle className="text-xl font-semibold text-[#012622]">
              Quick Reference
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <ul className="space-y-3 pr-4">
              {summary
                .split("\n")
                .filter(
                  (line: string) =>
                    line.startsWith("• ") || line.startsWith("- ")
                )
                .map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#012622] text-sm font-medium text-white">
                      {index + 1}
                    </span>
                    <span className="text-[#012622]/70">
                      {point.replace(/^[•-]\s+/, "")}
                    </span>
                  </li>
                ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  const renderFlashcardsTab = () => (
    <Card className="max-w-3xl mx-auto border-none shadow-lg bg-[#E7E5D8]">
      <CardHeader className="border-b border-[#B0AE9F]/20 bg-[#CFCEC4]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flashlight className="h-5 w-5 text-[#012622]" />
            <CardTitle className="text-xl font-semibold text-[#012622]">
              Card {currentCardIndex + 1} of {flashcards.length}
            </CardTitle>
          </div>
          <span className="text-sm font-medium text-[#012622]/70">
            {Object.values(mastered).filter(Boolean).length} Mastered
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="min-h-[400px] flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-[#012622] mb-3">
                Question:
              </h3>
              {renderMarkdown(flashcards[currentCardIndex].question)}
            </div>

            {showAnswer && (
              <div className="pt-6 border-t border-[#B0AE9F]/20">
                <h3 className="text-lg font-medium text-[#012622] mb-3">
                  Answer:
                </h3>
                {renderMarkdown(flashcards[currentCardIndex].answer)}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handlePrevCard}
              className="group flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#012622] transition-colors hover:bg-[#012622] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Previous</span>
            </button>

            <div className="space-x-2">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#012622] hover:bg-[#012622]/90 rounded-md transition-colors"
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
                        ? "bg-[#012622]/10 text-[#012622] hover:bg-[#012622]/20"
                        : "bg-[#B0AE9F]/10 text-[#012622] hover:bg-[#B0AE9F]/20"
                    }
                  `}
                >
                  {mastered[currentCardIndex] ? "Mastered" : "Mark as Mastered"}
                </button>
              )}
            </div>

            <button
              onClick={handleNextCard}
              className="group flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#012622] transition-colors hover:bg-[#012622] hover:text-white"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <div className="bg-[#F4F2E7] rounded-lg p-4 shadow-sm">
          <h3 className="text-base font-medium text-[#012622] mb-2">
            Mastery Progress
          </h3>
          <div className="h-2 bg-[#B0AE9F]/20 rounded-full overflow-hidden">
            <div
              className="h-2 bg-[#012622] rounded-full transition-all duration-300"
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
    </Card>
  );

  const renderQuizTab = () => (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="max-w-3xl mx-auto space-y-6 pr-4">
        <Card className="border-none shadow-lg bg-[#E7E5D8]">
          <CardHeader className="border-b border-[#B0AE9F]/20 bg-[#CFCEC4]">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#012622]" />
              <CardTitle className="text-xl font-semibold text-[#012622]">
                Self-Assessment Quiz
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-[#012622]/70">
              Test your knowledge with these review questions.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {flashcards.slice(0, 5).map((card: Flashcard, index: number) => (
            <Card key={index} className="border-none shadow-lg bg-[#E7E5D8]">
              <CardContent className="p-6">
                <h4 className="text-lg font-medium text-[#012622] mb-4">
                  Question {index + 1}:
                </h4>
                {renderMarkdown(card.question)}
                <button
                  onClick={() => setShowAnswer(true)}
                  className="mt-4 px-4 py-2 text-sm font-medium text-[#012622] hover:bg-[#012622] hover:text-white rounded-md transition-colors"
                >
                  Check Answer
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
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
      <div className="max-w-7xl mx-auto space-y-6">
        <Tabs defaultValue="summary">
          <Card className="border-none shadow-lg bg-[#E7E5D8]">
            <TabsList className="w-full justify-start rounded-none bg-[#CFCEC4] p-0">
              {tabs.map((tab: TabType) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 rounded-none border-b-2 border-transparent px-8 py-4 text-[#012622] data-[state=active]:border-[#012622] data-[state=active]:bg-transparent data-[state=active]:text-[#012622] sm:flex-initial"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Card>

          <TabsContent value="summary">{renderSummaryTab()}</TabsContent>
          <TabsContent value="flashcards">
            {flashcards.length > 0 && renderFlashcardsTab()}
          </TabsContent>
          <TabsContent value="quiz">{renderQuizTab()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
