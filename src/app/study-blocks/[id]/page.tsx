// app/study-blocks/[id]/page.tsx
import { Suspense } from "react";
import StudyBlockClient from "./StudyBlockClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function StudyBlockPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      }
    >
      <StudyBlockClient id={params.id} />
    </Suspense>
  );
}
