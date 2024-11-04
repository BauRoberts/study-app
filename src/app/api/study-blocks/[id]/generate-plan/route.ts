// app/api/study-blocks/[id]/generate-plan/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import type { Session } from "next-auth";

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params
    const params = await context.params;
    const { id } = params;

    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        email: string;
      };
    };

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studyBlock = await prisma.studyBlock.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!studyBlock) {
      return NextResponse.json(
        { error: "Study block not found" },
        { status: 404 }
      );
    }

    // Rest of your code remains the same...
    const prompt = `
      Generate a detailed study plan for this exam/course:
      Title: ${studyBlock.title}
      Content to Study: ${studyBlock.content}
      Available study time: ${studyBlock.totalHours} hours per day
      Available days: ${studyBlock.daysOfWeek.join(", ")}
      Test date: ${studyBlock.endDate}

      Create a structured study plan that:
      1. Breaks down the content into logical learning units
      2. Arranges topics in the most effective learning sequence
      3. Includes practice exercises and review sessions
      4. Accounts for spaced repetition
      5. Adapts to the available study hours per day
      6. Ensures all major topics are covered before the test date

      Return the response as a JSON array of tasks, where each task has:
      {
        "title": "Clear, specific task title",
        "description": "Detailed description of what to study/practice",
        "taskType": "learn" | "practice" | "review",
        "dueDate": "YYYY-MM-DD"
      }

      Make sure:
      - Tasks fit within the daily time limits
      - Include regular review sessions
      - Balance between learning, practice, and review
      - Tasks are evenly distributed across available days
      - Due dates are between start date and test date
      - Task descriptions are specific and actionable

      Return only the JSON array, no additional text.
    `;

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

    const responseContent =
      message.content[0].type === "text" ? message.content[0].text : "";

    const generatedTasks = JSON.parse(responseContent);

    const tasks = await Promise.all(
      generatedTasks.map((task: any) =>
        prisma.task.create({
          data: {
            title: task.title,
            description: task.description,
            dueDate: new Date(task.dueDate),
            taskType: task.taskType,
            studyBlockId: studyBlock.id,
            userId: session.user.id,
            completed: false,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Study plan generated successfully",
      tasks,
    });
  } catch (error) {
    console.error("Error generating study plan:", error);
    return NextResponse.json(
      { error: "Error generating study plan" },
      { status: 500 }
    );
  }
}
