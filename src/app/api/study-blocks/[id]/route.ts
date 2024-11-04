import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object
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
      include: {
        tasks: {
          orderBy: {
            dueDate: "asc",
          },
        },
      },
    });

    if (!studyBlock) {
      return NextResponse.json(
        { error: "Study block not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ studyBlock });
  } catch (error) {
    console.error("Error fetching study block:", error);
    return NextResponse.json(
      { error: "Error fetching study block" },
      { status: 500 }
    );
  }
}
