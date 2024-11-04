import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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

    const studyBlocks = await prisma.studyBlock.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tasks: {
          orderBy: {
            dueDate: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ studyBlocks });
  } catch (error) {
    console.error("Error fetching study blocks:", error);
    return NextResponse.json(
      { error: "Error fetching study blocks" },
      { status: 500 }
    );
  }
}

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

    const data = await request.json();

    // Convert the form data to match your schema
    const studyBlock = await prisma.studyBlock.create({
      data: {
        title: data.title,
        startDate: new Date(), // Current date as start date
        endDate: new Date(data.testDate),
        totalHours: parseInt(data.hoursPerDay),
        daysOfWeek: data.selectedDays,
        content: data.content,
        status: "ACTIVE",
        userId: session.user.id,
      },
    });

    return NextResponse.json({ studyBlock });
  } catch (error) {
    console.error("Error creating study block:", error);
    return NextResponse.json(
      { error: "Error creating study block" },
      { status: 500 }
    );
  }
}
