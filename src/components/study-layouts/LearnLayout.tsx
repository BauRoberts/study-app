import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, PenLine, Lightbulb } from "lucide-react";

interface LearnLayoutProps {
  summary: string;
  loading?: boolean;
}

export default function LearnLayout({ summary, loading }: LearnLayoutProps) {
  const [notes, setNotes] = useState("");

  const keyPoints = summary
    .split("\n")
    .filter((line) => line.startsWith("- ") || line.startsWith("* "))
    .map((point) => point.replace(/^[- *] /, ""));

  return (
    <div className="min-h-screen bg-[#F4F2E7] p-6">
      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#012622] border-t-transparent" />
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {/* Main Content Section */}
          <Card className="lg:col-span-2 border-none shadow-lg bg-[#E7E5D8]">
            <CardHeader className="border-b border-[#B0AE9F]/20 bg-[#CFCEC4]">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#012622]" />
                <CardTitle className="text-xl font-semibold text-[#012622]">
                  Learning Material
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="prose prose-lg max-w-none pr-4">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="mb-4 text-2xl font-bold text-[#012622]">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="mb-3 text-xl font-semibold text-[#012622]/90">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mb-2 text-lg font-medium text-[#012622]/80">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 leading-relaxed text-[#012622]/70">
                          {children}
                        </p>
                      ),
                      li: ({ children }) => (
                        <li className="mb-2 text-[#012622]/70">{children}</li>
                      ),
                    }}
                  >
                    {summary}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Study Tools Section */}
          <div className="space-y-6">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#CFCEC4]">
                <TabsTrigger
                  value="notes"
                  className="flex items-center gap-2 data-[state=active]:bg-[#012622] data-[state=active]:text-white"
                >
                  <PenLine className="h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="keypoints"
                  className="flex items-center gap-2 data-[state=active]:bg-[#012622] data-[state=active]:text-white"
                >
                  <Lightbulb className="h-4 w-4" />
                  Key Points
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notes">
                <Card className="border-none shadow-lg bg-[#E7E5D8]">
                  <CardContent className="p-4">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[calc(100vh-16rem)] w-full rounded-lg border border-[#B0AE9F]/20 bg-[#F4F2E7] p-4 text-[#012622] placeholder:text-[#012622]/40 focus:border-[#012622] focus:outline-none focus:ring-1 focus:ring-[#012622]"
                      placeholder="Take notes while you study..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keypoints">
                <Card className="border-none shadow-lg bg-[#E7E5D8]">
                  <CardContent className="p-4">
                    <ScrollArea className="h-[calc(100vh-16rem)]">
                      <ul className="space-y-4 pr-4">
                        {keyPoints.map((point, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#012622] text-sm font-medium text-white">
                              {index + 1}
                            </span>
                            <span className="text-[#012622]/70">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
