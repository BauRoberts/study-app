"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Book,
  Users,
  User,
} from "lucide-react";
import CreateStudyBlockModal from "@/components/modals/CreateStudyBlockModal";
import { Task, StudyBlock } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // New state for today's tasks
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");
  const [maxVisibleTasks, setMaxVisibleTasks] = useState(4);

  // Rest of your component code...

  // Fetch study blocks
  const fetchStudyBlocks = async () => {
    try {
      const response = await fetch("/api/study-blocks");
      if (!response.ok) {
        throw new Error("Failed to fetch study blocks");
      }
      const data = await response.json();
      setStudyBlocks(data.studyBlocks);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load study blocks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's tasks
  const fetchTodaysTasks = async () => {
    try {
      setTasksLoading(true);
      const response = await fetch("/api/tasks/today");
      if (!response.ok) {
        throw new Error("Failed to fetch today's tasks");
      }
      const data = await response.json();
      setTodaysTasks(data.tasks);
    } catch (err) {
      setTasksError("Failed to load today's tasks");
      console.error(err);
    } finally {
      setTasksLoading(false);
    }
  };

  // Calculate tasks to display based on screen size
  useEffect(() => {
    const calculateMaxTasks = () => {
      const taskHeight = 76; // Height of each task card in pixels
      const tasksContainerHeight = window.innerHeight - 400; // Subtract header, study blocks, and padding
      const maxTasks = Math.floor(tasksContainerHeight / taskHeight);
      setMaxVisibleTasks(Math.max(maxTasks, 2)); // Minimum 2 tasks
    };

    calculateMaxTasks();
    window.addEventListener("resize", calculateMaxTasks);

    return () => {
      window.removeEventListener("resize", calculateMaxTasks);
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStudyBlocks();
    fetchTodaysTasks();
  }, []);

  const getDaysUntilTest = (endDate: string) => {
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 0;
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const showNext = () => {
    if (currentIndex < studyBlocks.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const showPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleBlocks = studyBlocks.slice(currentIndex, currentIndex + 3);
  const visibleTasks = todaysTasks.slice(0, maxVisibleTasks);

  return (
    <div className="min-h-screen flex bg-[#F4F2E7]">
      {/* Sidebar */}
      <div className="w-80 bg-[#B0AE9F] flex flex-col">
        <div className="p-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 px-4 rounded-md text-sm font-light text-white bg-[#012622] hover:bg-[#023830] transition-colors"
          >
            + Create a new Study Block
          </button>
        </div>
        <nav className="mt-4 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 text-[#012622] bg-[#E7E5D8] font-light text-sm"
          >
            <Book className="mr-2 h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center px-4 py-2 text-[#012622] hover:bg-[#E7E5D8] transition-colors font-light text-sm"
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </Link>
          <Link
            href="/dashboard/content"
            className="flex items-center px-4 py-2 text-[#012622] hover:bg-[#E7E5D8] transition-colors font-light text-sm"
          >
            <Book className="mr-2 h-4 w-4" />
            <span>Find Content</span>
          </Link>
          <Link
            href="/dashboard/buddy"
            className="flex items-center px-4 py-2 text-[#012622] hover:bg-[#E7E5D8] transition-colors font-light text-sm"
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Find a Buddy</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-[#012622]/10">
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-[#012622] hover:bg-[#E7E5D8] rounded-md transition-colors"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-[#CFCEC4] shadow-sm">
          <div className="px-6 py-[1.05rem] flex justify-between items-center">
            {" "}
            {/* Adjusted padding to match nav height */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-light text-[#012622]">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-light text-[#012622]">{today}</span>
              <Image
                src="/images/Isotipo.png"
                alt="Study App Logo"
                width={48}
                height={50}
                className="object-contain hover:scale-105 transition-transform"
                priority
              />
            </div>
          </div>
        </header>

        <main className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {/* Study Blocks Section */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#012622]"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex justify-between items-center space-x-4">
                <button
                  onClick={showPrevious}
                  disabled={currentIndex === 0}
                  className={`p-2 rounded-full bg-[#012622] text-white ${
                    currentIndex === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#023830]"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex-1 flex justify-between space-x-4">
                  {visibleBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="w-[450px] min-h-[220px] bg-[#E7E5D8] p-6 rounded-lg flex flex-col justify-between" // Changed dimensions and reduced padding
                    >
                      {/* Top Section */}
                      <div className="space-y-4">
                        {" "}
                        {/* Reduced spacing */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-[#012622] text-lg">
                              {block.title}
                            </h3>
                            <p className="text-sm text-[#012622]/70 mt-1 font-light">
                              {block.tasks?.length || 0} tasks
                            </p>
                          </div>
                          <Link
                            href={`/study-blocks/${block.id}`}
                            className="text-sm px-3 py-1 text-[#012622] hover:bg-[#012622] hover:text-white rounded-md transition-colors inline-flex items-center font-light"
                          >
                            View Plan
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                        <span className="inline-block px-3 py-1 text-sm bg-[#012622] text-white rounded-full font-light">
                          {getDaysUntilTest(block.endDate)} days till exam
                        </span>
                      </div>

                      {/* Bottom Section */}
                      <div className="space-y-3">
                        {" "}
                        {/* Reduced spacing */}
                        <div className="flex justify-between text-sm text-[#012622]/70 font-light">
                          <span>Progress</span>
                          <span>
                            {block.tasks?.filter((task) => task.completed)
                              .length || 0}
                            /{block.tasks?.length || 0} tasks
                          </span>
                        </div>
                        <div className="w-full bg-[#B0AE9F] rounded-full h-1.5">
                          {" "}
                          {/* Reduced height */}
                          <div
                            className="bg-[#012622] h-1.5 rounded-full transition-all duration-300" // Reduced height
                            style={{
                              width: `${
                                block.tasks?.length
                                  ? (block.tasks.filter(
                                      (task) => task.completed
                                    ).length /
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
                <button
                  onClick={showNext}
                  disabled={currentIndex >= studyBlocks.length - 3}
                  className={`p-2 rounded-full bg-[#012622] text-white ${
                    currentIndex >= studyBlocks.length - 3
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#023830]"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Tasks Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#012622]">
                Tasks for today
              </h2>
              {todaysTasks.length > maxVisibleTasks && (
                <span className="text-sm text-[#012622]/70 font-light">
                  Showing {maxVisibleTasks} of {todaysTasks.length} tasks
                </span>
              )}
            </div>

            {tasksLoading ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#012622]"></div>
              </div>
            ) : tasksError ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-600 font-light">
                {tasksError}
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="bg-[#E7E5D8] p-6 rounded-lg text-center">
                <p className="text-[#012622]/70 font-light">
                  No tasks scheduled for today
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#E7E5D8] p-4 rounded-lg flex justify-between items-center group hover:shadow-md transition-all"
                  >
                    <div>
                      <h4 className="font-medium text-[#012622]">
                        {task.title}
                      </h4>{" "}
                      {/* Only this keeps medium weight */}
                      <p className="text-sm text-[#012622]/70 font-light">
                        {task.blockTitle}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {task.completed ? (
                        <span className="px-3 py-1 text-sm bg-[#012622]/10 text-[#012622] rounded-md font-light">
                          Completed
                        </span>
                      ) : (
                        <Link
                          href={`/study-blocks/${task.blockId}`}
                          className="px-4 py-2 text-sm bg-[#012622] text-white rounded-md hover:bg-[#023830] transition-colors font-light"
                        >
                          Start
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {todaysTasks.length > maxVisibleTasks && (
                  <Link
                    href="/tasks"
                    className="block mt-4 text-center text-sm text-[#012622] hover:text-[#023830] transition-colors font-light"
                  >
                    View all {todaysTasks.length} tasks →
                  </Link>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateStudyBlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchStudyBlocks();
        }}
      />
    </div>
  );
}
