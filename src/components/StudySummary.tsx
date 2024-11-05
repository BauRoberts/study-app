// components/StudySummary.tsx
"use client";

import { useState, useEffect } from "react";
import LearnLayout from "./study-layouts/LearnLayout";
import PracticeLayout from "./study-layouts/PracticeLayout";
import ReviewLayout from "./study-layouts/ReviewLayout";
import StudyLayoutWrapper from "./study-layouts/StudyLayoutWrapper";

interface StudySummaryProps {
  taskId: string;
  taskType: string;
  studyBlock: {
    id: string;
    title: string;
    tasks: Array<{
      id: string;
      title: string;
      taskType: string;
    }>;
  };
}

export default function StudySummary({
  taskId,
  taskType,
  studyBlock,
}: StudySummaryProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(taskId);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/tasks/${currentTaskId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.task.summary) {
            setSummary(data.task.summary);
          }
        }
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      }
    };

    fetchSummary();
  }, [currentTaskId]);

  const generateSummary = async (taskId: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/tasks/${taskId}/generate-summary`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);

      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: data.summary,
        }),
      });

      setShowSummary(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate summary"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTaskNavigation = async (newTaskId: string) => {
    setCurrentTaskId(newTaskId);
    const response = await fetch(`/api/tasks/${newTaskId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.task.summary) {
        setSummary(data.task.summary);
      } else {
        generateSummary(newTaskId);
      }
    }
  };

  const renderStudyLayout = () => {
    const currentTask = studyBlock.tasks.find(
      (task) => task.id === currentTaskId
    );
    if (!currentTask) return null;

    const commonProps = {
      summary,
      onBack: () => setShowSummary(false),
      onRegenerate: () => generateSummary(currentTaskId),
      loading,
    };

    const content = (() => {
      switch (currentTask.taskType) {
        case "learn":
          return <LearnLayout {...commonProps} />;
        case "practice":
          return <PracticeLayout {...commonProps} />;
        case "review":
          return <ReviewLayout {...commonProps} />;
        default:
          return <LearnLayout {...commonProps} />;
      }
    })();

    return (
      <StudyLayoutWrapper
        studyBlockTitle={studyBlock.title}
        currentTask={currentTask}
        tasks={studyBlock.tasks}
        onBack={() => setShowSummary(false)}
        onNavigate={handleTaskNavigation}
      >
        {content}
      </StudyLayoutWrapper>
    );
  };

  if (showSummary) {
    return renderStudyLayout();
  }

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={() => {
          if (summary) {
            setShowSummary(true);
          } else {
            generateSummary(currentTaskId);
          }
        }}
        disabled={loading}
        className={`px-3 py-1 text-sm rounded-md ${
          loading
            ? "bg-gray-300 cursor-not-allowed"
            : taskType === "learn"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : taskType === "practice"
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
            Generating...
          </div>
        ) : summary ? (
          taskType === "learn" ? (
            "Start Learning"
          ) : taskType === "practice" ? (
            "Start Practice"
          ) : (
            "Start Review"
          )
        ) : (
          "Generate Materials"
        )}
      </button>
    </div>
  );
}
