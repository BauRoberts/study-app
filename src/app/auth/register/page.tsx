"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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

      // Redirect to login page with success message
      router.push("/auth/login?registered=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-wide text-gray-500"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-xs uppercase tracking-wide text-gray-500"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextStep}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
      >
        Next
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="university"
            className="block text-xs uppercase tracking-wide text-gray-500"
          >
            Select University
          </label>
          <select
            id="university"
            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
            value={formData.university}
            onChange={(e) =>
              setFormData({ ...formData, university: e.target.value })
            }
          >
            <option value="">Select a university</option>
            <option value="uni1">University 1</option>
            <option value="uni2">University 2</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="career"
            className="block text-xs uppercase tracking-wide text-gray-500"
          >
            Select Career
          </label>
          <select
            id="career"
            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
            value={formData.career}
            onChange={(e) =>
              setFormData({ ...formData, career: e.target.value })
            }
          >
            <option value="">Select a career</option>
            <option value="career1">Career 1</option>
            <option value="career2">Career 2</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="workStatus"
            className="block text-xs uppercase tracking-wide text-gray-500"
          >
            Do you work?
          </label>
          <select
            id="workStatus"
            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
            value={formData.workStatus}
            onChange={(e) =>
              setFormData({ ...formData, workStatus: e.target.value })
            }
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextStep}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
      >
        Next
      </button>
    </>
  );

  const renderStep3 = () => (
    <>
      <div>
        <label
          htmlFor="learningStyle"
          className="block text-xs uppercase tracking-wide text-gray-500"
        >
          Select what's your best way of learning
        </label>
        <select
          id="learningStyle"
          className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
          value={formData.learningStyle}
          onChange={(e) =>
            setFormData({ ...formData, learningStyle: e.target.value })
          }
        >
          <option value="">Select a learning style</option>
          <option value="visual">Visual</option>
          <option value="auditory">Auditory</option>
          <option value="kinesthetic">Kinesthetic</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
      >
        Create Account
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {step} of 3
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
              className="font-medium text-gray-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
