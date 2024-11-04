import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";

const prisma = new PrismaClient();

export async function PATCH(
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

    const data = await request.json();

    // Verify task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        completed: data.completed,
      },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}
