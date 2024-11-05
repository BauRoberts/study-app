"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
///Users/bautistaroberts/study-app/src/app/auth/register/page.tsx
interface FormData {
  email: string;
  password: string;
  university: string;
  career: string;
  workStatus: string;
  learningStyle: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    university: "",
    career: "",
    workStatus: "",
    learningStyle: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSelectChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/auth/login?registered=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-black uppercase">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-none border-b border-gray-300 focus:border-[#012622] focus:ring-0 bg-transparent"
          placeholder="Insert email..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-black uppercase">
          Password
        </label>
        <Input
          id="password"
          type="password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="mt-1 block w-full rounded-none border-b border-gray-300 focus:border-[#012622] focus:ring-0 bg-transparent"
          placeholder="Insert Password..."
        />
      </div>

      <Button
        type="button"
        onClick={handleNextStep}
        className="w-full bg-[#012622] hover:bg-[#012622]/90 text-white rounded-none"
      >
        Next
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-black uppercase">
          Select University
        </label>
        <Select
          value={formData.university}
          onValueChange={handleSelectChange("university")}
        >
          <SelectTrigger className="w-full rounded-none border-b border-gray-300 focus:border-[#012622] focus:ring-0 bg-transparent">
            <SelectValue placeholder="Select University" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uni1">University 1</SelectItem>
            <SelectItem value="uni2">University 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black uppercase">
          Select Career
        </label>
        <Select
          value={formData.career}
          onValueChange={handleSelectChange("career")}
        >
          <SelectTrigger className="w-full rounded-none border-b border-gray-300 focus:border-[#012622] focus:ring-0 bg-transparent">
            <SelectValue placeholder="Choose Career..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="career1">Career 1</SelectItem>
            <SelectItem value="career2">Career 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black uppercase">
          Do you work
        </label>
        <Select
          value={formData.workStatus}
          onValueChange={handleSelectChange("workStatus")}
        >
          <SelectTrigger className="w-full rounded-none border-b border-gray-300 focus:border-[#012622] focus:ring-0 bg-transparent">
            <SelectValue placeholder="Choose Option..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        onClick={handleNextStep}
        className="w-full bg-[#012622] hover:bg-[#012622]/90 text-white rounded-none"
      >
        Next
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-black uppercase">
          Select best way of learning
        </label>
        <Select
          value={formData.learningStyle}
          onValueChange={handleSelectChange("learningStyle")}
        >
          <SelectTrigger className="w-full rounded-none border-b border-gray-300 focus:border-[#012622] focus:ring-0 bg-transparent">
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visual">Visual</SelectItem>
            <SelectItem value="auditory">Auditory</SelectItem>
            <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#012622] hover:bg-[#012622]/90 text-white rounded-none"
      >
        Create Account
      </Button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Top section */}
      <div className="flex-1 bg-[#FEFDF7] px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-center text-2xl font-medium text-black">
              Create Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Step {step} of 3
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </form>

          {step === 1 && (
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#012622] hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Bottom section with wave and logo */}
      <div className="h-[180px] bg-[#B0AE9F] relative">
        <div
          className="absolute left-0 right-0 h-24 bg-[#FEFDF7]"
          style={{
            clipPath: "ellipse(80% 80% at 50% 0%)",
          }}
        />
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <Image
            src="/images/Logo.png"
            alt="Study Buddy Logo"
            width={80}
            height={80}
            className="w-auto h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
