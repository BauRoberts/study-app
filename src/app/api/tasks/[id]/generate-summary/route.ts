// app/api/tasks/[id]/generate-summary/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient, Prisma } from "@prisma/client"; // Add Prisma import
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

    // Check if user has premium access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // if (!user?.isPremium) {
    //   return NextResponse.json(
    //     { error: "Premium subscription required" },
    //     { status: 403 }
    //   );
    // }

    // Get task with study block data
    const task = await prisma.task.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        studyBlock: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const prompt = `
    ${
      task.taskType === "learn"
        ? `
      Create a comprehensive learning summary for: ${task.title}
      Content: ${task.studyBlock.content}

      Format the response with:
      1. Clear explanation of main concepts
      2. Key definitions and terminology
      3. Examples and illustrations
      4. Relationship between concepts
      5. Common misconceptions and clarifications

      Use markdown formatting for better readability.
      Include bullet points for key concepts.
      Add headers for different sections.
    `
        : task.taskType === "practice"
        ? `
      Create a practice session for: ${task.title}
      Content: ${task.studyBlock.content}

      Format the response as a series of practice problems:

      Problem 1:
      [Problem description]

      Solution:
      [Detailed solution with steps]

      Create 5-7 practice problems with varying difficulty.
      Include step-by-step solutions.
      Use realistic scenarios when possible.
      Format in markdown for clear separation between problems and solutions.
    `
        : `
      Create a review summary for: ${task.title}
      Content: ${task.studyBlock.content}

      Format the response with two sections:

      SECTION 1 - Quick Review Summary:
      • Bullet-point summary of key points
      • Important formulas or rules
      • Critical concepts to remember

      SECTION 2 - Flashcards (in Q&A format):
      Q: [Question]
      A: [Answer]

      Create at least 10 flashcards covering the main concepts.
      Make questions specific and answers concise.
      Use markdown formatting for better readability.
    `
    }
  `;

    // Generate summary using Claude
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
        "You are a specialized study material creator. Adapt your summaries based on whether the task is for learning, practicing, or reviewing. Use clear formatting and ensure content is engaging and memorable.",
    });

    const summary =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Update task with new summary
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        summary: summary as string,
        lastSummaryDate: new Date(),
      } as Prisma.TaskUpdateInput,
    });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Error generating summary" },
      { status: 500 }
    );
  }
}
