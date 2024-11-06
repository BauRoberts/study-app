import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StudyLayoutWrapperProps {
  children: React.ReactNode;
  studyBlockTitle: string;
  currentTask: {
    id: string;
    title: string;
    taskType: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    taskType: string;
  }>;
  onBack: () => void;
  onNavigate: (taskId: string) => void;
}

export default function StudyLayoutWrapper({
  children,
  studyBlockTitle,
  currentTask,
  tasks,
  onBack,
  onNavigate,
}: StudyLayoutWrapperProps) {
  const currentTaskIndex = tasks.findIndex(
    (task) => task.id === currentTask.id
  );
  const nextTask = tasks[currentTaskIndex + 1];
  const prevTask = tasks[currentTaskIndex - 1];

  return (
    <div className="fixed inset-0 bg-[#F4F2E7]">
      {/* Header with breadcrumbs and navigation */}
      <div className="fixed top-0 left-0 right-0 z-20 border-b border-[#B0AE9F]/20 bg-[#CFCEC4]">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={onBack}
              className="font-medium text-[#012622] transition-colors hover:opacity-80"
            >
              Study Block
            </button>
            <span className="text-[#012622]/60">/</span>
            <span className="font-medium text-[#012622]/90 max-w-[200px] truncate">
              {studyBlockTitle}
            </span>
            <span className="text-[#012622]/60">/</span>
            <span className="font-medium text-[#012622]/90 max-w-[200px] truncate">
              {currentTask.title}
            </span>
          </nav>

          {/* Task Navigation */}
          <div className="flex items-center space-x-6">
            {prevTask && (
              <button
                onClick={() => onNavigate(prevTask.id)}
                className="group flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#012622] transition-colors hover:bg-[#012622] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Previous</span>
              </button>
            )}

            <span className="text-sm font-medium text-[#012622]/70">
              Task {currentTaskIndex + 1} of {tasks.length}
            </span>

            {nextTask && (
              <button
                onClick={() => onNavigate(nextTask.id)}
                className="group flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#012622] transition-colors hover:bg-[#012622] hover:text-white"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="h-full pt-[4.5rem] bg-[#F4F2E7]">
        <div className="h-full px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
