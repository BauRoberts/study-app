// Add these types at the top of the file
interface StudyTask {
  title: string;
  description: string;
  dueDate: string;
  estimatedMinutes: number;
  type: "learn" | "practice" | "review";
}

interface ProcessedStudyTask extends Omit<StudyTask, "dueDate"> {
  dueDate: Date;
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import Anthropic from "@anthropic-ai/sdk";
import type { Session } from "next-auth";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        email: string;
      };
    };

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, hoursPerDay, daysAvailable, testDate } = body;

    // Create a structured prompt for Claude
    const prompt = `
      You are a study plan creator. Create a detailed study plan with the following information:

      Course/Exam: ${title}
      Content to Study: ${content}
      Time Available: ${hoursPerDay} hours per day
      Days Available: ${daysAvailable} days
      Test Date: ${testDate}

      Create a structured daily study plan. For each day, break down the topics and concepts that should be covered.

      Requirements:
      1. Break down complex topics into smaller, manageable chunks
      2. Ensure foundational concepts are covered before advanced topics
      3. Include time for practice and revision
      4. Consider spaced repetition for better retention
      5. Add short breaks between study sessions
      6. Include practice questions or exercises where appropriate

      Format the response as a JSON array of tasks. Each task should have:
      {
        "title": "Task title",
        "description": "Detailed description of what to study/practice",
        "dueDate": "YYYY-MM-DD",
        "estimatedMinutes": number,
        "type": "learn" | "practice" | "review"
      }

      Return only the JSON array, no additional text.
    `;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system:
        "You are a study plan creation assistant. Always return valid JSON arrays containing study tasks.",
    });

    // Parse the response - updated to handle Claude's response format
    let tasks;
    try {
      // Updated this line to handle Claude's response structure
      const responseContent =
        message.content[0].type === "text" ? message.content[0].text : "";

      tasks = JSON.parse(responseContent);
    } catch (error) {
      console.error("Failed to parse Claude response:", error);
      return NextResponse.json(
        { error: "Failed to generate valid study plan" },
        { status: 500 }
      );
    }

    // Process and validate tasks
    const processedTasks = tasks.map((task: any) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      estimatedMinutes: parseInt(task.estimatedMinutes),
    }));

    return NextResponse.json({ tasks: processedTasks });
  } catch (error) {
    console.error("Error generating tasks:", error);
    return NextResponse.json(
      { error: "Error generating study plan" },
      { status: 500 }
    );
  }
}
