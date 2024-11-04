"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateStudyBlockModal from "@/components/modals/CreateStudyBlockModal";

interface StudyBlock {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  tasks: any[]; // We'll type this properly later
}

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch study blocks
  const fetchStudyBlocks = async () => {
    try {
      const response = await fetch("/api/study-blocks");
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to fetch study blocks");
      }
      const data = await response.json();
      console.log("Fetched study blocks:", data);
      setStudyBlocks(data.studyBlocks);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load study blocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyBlocks();
  }, []);

  // Calculate days until test
  const getDaysUntilTest = (endDate: string) => {
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 0;
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            + Create a new Study Block
          </button>
        </div>
        <nav className="mt-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            href="/dashboard/calendar"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            Calendar
          </Link>
          <Link
            href="/dashboard/content"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            Find content
          </Link>
          <Link
            href="/dashboard/buddy"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            Find a Buddy
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <header className="bg-white shadow">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studyBlocks.map((block) => (
                <div key={block.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium">{block.title}</h3>
                  <p className="text-sm text-gray-500">
                    {block.tasks?.length || 0} tasks
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-200 rounded">
                      {getDaysUntilTest(block.endDate)} days till exam
                    </span>
                    <Link
                      href={`/study-blocks/${block.id}`}
                      className="text-sm px-3 py-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                      View Plan →
                    </Link>
                  </div>
                  {/* Add progress indicator */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {block.tasks?.filter((task) => task.completed).length ||
                          0}
                        /{block.tasks?.length || 0} tasks
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{
                          width: `${
                            block.tasks?.length
                              ? (block.tasks.filter((task) => task.completed)
                                  .length /
                                  block.tasks.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Tasks for today</h2>
            <div className="space-y-3">
              {studyBlocks.map((block) =>
                block.tasks?.map((task: any) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-500">{block.title}</p>
                    </div>
                    <button className="px-4 py-2 text-sm bg-gray-100 rounded">
                      Start
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <CreateStudyBlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchStudyBlocks(); // Refresh the list after closing modal
        }}
      />
    </div>
  );
}
