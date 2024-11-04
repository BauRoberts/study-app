"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { extractTextFromFile } from "@/utils/fileParser";

interface CreateStudyBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateStudyBlockModal: React.FC<CreateStudyBlockModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    hoursPerDay: "",
    testDate: "",
    selectedDays: [] as string[],
    content: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const text = await extractTextFromFile(file);
      setFormData((prev) => ({
        ...prev,
        content: text,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file");
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.title ||
        !formData.hoursPerDay ||
        !formData.testDate ||
        formData.selectedDays.length === 0
      ) {
        setError("Please fill in all fields");
        return;
      }
    }
    if (step === 2) {
      if (!formData.content) {
        setError("Please upload study content");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First create the study block
      const response = await fetch("/api/study-blocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create study block");
      }

      const { studyBlock } = await response.json();

      // Generate study plan
      const planResponse = await fetch(
        `/api/study-blocks/${studyBlock.id}/generate-plan`,
        {
          method: "POST",
        }
      );

      if (!planResponse.ok) {
        throw new Error("Study block created but failed to generate plan");
      }

      setSuccess(true);
      setStep(4);

      // Close modal and redirect after delay
      setTimeout(() => {
        onClose();
        // Redirect to the study block detail page
        router.push(`/study-blocks/${studyBlock.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label
          htmlFor="hoursPerDay"
          className="block text-sm font-medium text-gray-700"
        >
          How many hours can you study every day?
        </label>
        <select
          id="hoursPerDay"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={formData.hoursPerDay}
          onChange={(e) =>
            setFormData({ ...formData, hoursPerDay: e.target.value })
          }
        >
          <option value="">Select hours</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
            <option key={hour} value={hour}>
              {hour} hours
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="testDate"
          className="block text-sm font-medium text-gray-700"
        >
          Select the date of the test
        </label>
        <input
          type="date"
          id="testDate"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={formData.testDate}
          onChange={(e) =>
            setFormData({ ...formData, testDate: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select the days you will study
        </label>
        <div className="flex gap-2">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => {
                const isSelected = formData.selectedDays.includes(day);
                setFormData({
                  ...formData,
                  selectedDays: isSelected
                    ? formData.selectedDays.filter((d) => d !== day)
                    : [...formData.selectedDays, day],
                });
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                formData.selectedDays.includes(day)
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {day[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Study Material
        </label>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.txt"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700"
        />
        {loading && (
          <div className="mt-2 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-gray-900 rounded-full border-t-transparent"></div>
            <span className="ml-2 text-sm text-gray-600">
              Processing file...
            </span>
          </div>
        )}
        {formData.content && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Content preview:</p>
            <div className="mt-1 p-2 bg-gray-50 rounded text-sm text-gray-700 max-h-32 overflow-y-auto">
              {formData.content.slice(0, 200)}...
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          Review Your Study Plan
        </h3>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Title:</h4>
            <p className="text-sm text-gray-600">{formData.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Study Hours:</h4>
            <p className="text-sm text-gray-600">
              {formData.hoursPerDay} hours per day
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Study Days:</h4>
            <p className="text-sm text-gray-600">
              {formData.selectedDays.join(", ")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Test Date:</h4>
            <p className="text-sm text-gray-600">{formData.testDate}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">
              Content Length:
            </h4>
            <p className="text-sm text-gray-600">
              {formData.content.length} characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center py-6">
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">
            Creating your study block...
          </p>
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            ✓
          </div>
          <p className="mt-4 text-sm text-green-600">
            Study block created successfully!
          </p>
        </>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {step === 1 && "Create Study Block"}
              {step === 2 && "Upload Study Material"}
              {step === 3 && "Review Plan"}
              {step === 4 && "Creating Study Block"}
            </h2>
            {step !== 4 && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-12">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex flex-col items-center ${
                    stepNumber === step ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stepNumber === step
                        ? "bg-gray-900 text-white"
                        : stepNumber < step
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100"
                    }`}
                  >
                    {stepNumber < step ? "✓" : stepNumber}
                  </div>
                  <span className="mt-2 text-xs">
                    {stepNumber === 1 && "Details"}
                    {stepNumber === 2 && "Content"}
                    {stepNumber === 3 && "Review"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-2 bg-green-50 border border-green-200 text-green-600 rounded">
              Study block created successfully!
            </div>
          )}

          <form
            onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}
          >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {step < 4 && (
              <div className="mt-6 flex justify-end gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 text-sm text-white bg-gray-900 hover:bg-gray-800 rounded-md"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm text-white bg-gray-900 hover:bg-gray-800 rounded-md disabled:bg-gray-400"
                  >
                    {loading ? "Creating..." : "Create Study Block"}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStudyBlockModal;
