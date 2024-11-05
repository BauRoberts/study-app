// components/study-layouts/StudyLayoutWrapper.tsx
"use client";

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
    <div className="fixed inset-0 bg-white">
      {/* Header with breadcrumbs and navigation */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20">
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={onBack}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Study Block
            </button>
            <span className="text-gray-500">/</span>
            <span className="font-medium text-gray-800">{studyBlockTitle}</span>
            <span className="text-gray-500">/</span>
            <span className="font-medium text-gray-800">
              {currentTask.title}
            </span>
          </div>

          {/* Task Navigation */}
          <div className="flex items-center space-x-4">
            {prevTask && (
              <button
                onClick={() => onNavigate(prevTask.id)}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors group"
              >
                <span className="mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                Previous Task
              </button>
            )}

            <span className="text-sm text-gray-700 font-medium">
              Task {currentTaskIndex + 1} of {tasks.length}
            </span>

            {nextTask && (
              <button
                onClick={() => onNavigate(nextTask.id)}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors group"
              >
                Next Task
                <span className="ml-1 group-hover:transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content with top padding for header */}
      <div className="h-full pt-16 bg-gray-50">{children}</div>
    </div>
  );
}
