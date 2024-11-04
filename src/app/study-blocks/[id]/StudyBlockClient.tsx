"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  completed: boolean;
  taskType: string;
  studyBlockId: string;
}

interface StudyBlock {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  daysOfWeek: string[];
  status: string;
  tasks: Task[];
}

interface StudyBlockClientProps {
  id: string;
}

export default function StudyBlockClient({ id }: StudyBlockClientProps) {
  const router = useRouter();
  const [studyBlock, setStudyBlock] = useState<StudyBlock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudyBlock = async () => {
      try {
        const response = await fetch(`/api/study-blocks/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch study block");
        }
        const data = await response.json();
        setStudyBlock(data.studyBlock);
      } catch (err) {
        setError("Failed to load study block");
      } finally {
        setLoading(false);
      }
    };

    fetchStudyBlock();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !studyBlock) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
            {error || "Study block not found"}
          </div>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                {studyBlock.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {studyBlock.status}
              </span>
              <span className="text-sm text-gray-500">
                Test Date: {new Date(studyBlock.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Study Block Info */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Study Hours</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {studyBlock.totalHours} hours/day
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Study Days</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {studyBlock.daysOfWeek.join(", ")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {studyBlock.tasks.length}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Progress</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {Math.round(
                  (studyBlock.tasks.filter((t) => t.completed).length /
                    studyBlock.tasks.length) *
                    100
                )}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Study Plan</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {studyBlock.tasks.map((task) => (
              <div key={task.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={async () => {
                          try {
                            const response = await fetch(
                              `/api/tasks/${task.id}`,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  completed: !task.completed,
                                }),
                              }
                            );

                            if (!response.ok)
                              throw new Error("Failed to update task");

                            setStudyBlock((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    tasks: prev.tasks.map((t) =>
                                      t.id === task.id
                                        ? { ...t, completed: !t.completed }
                                        : t
                                    ),
                                  }
                                : null
                            );
                          } catch (err) {
                            console.error("Failed to update task:", err);
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.taskType === "learn"
                          ? "bg-blue-100 text-blue-800"
                          : task.taskType === "practice"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {task.taskType}
                    </span>
                    <span className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <button className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                      Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
