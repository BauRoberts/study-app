import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { extractTextFromFile } from "@/utils/fileParser";
import { cn } from "@/lib/utils";

interface CreateStudyBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  hoursPerDay: string;
  testDate: string;
  selectedDays: string[];
  content: string;
}

const CreateStudyBlockModal: React.FC<CreateStudyBlockModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    hoursPerDay: "",
    testDate: "",
    selectedDays: [],
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
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="bg-[#E7E5D8] border-[#B0AE9F] font-light"
        />
      </div>

      <div>
        <label htmlFor="hoursPerDay" className="block text-sm font-medium mb-2">
          How many hours can you study every day?
        </label>
        <Select
          value={formData.hoursPerDay}
          onValueChange={(value: string) =>
            setFormData({ ...formData, hoursPerDay: value })
          }
        >
          <SelectTrigger className="bg-[#E7E5D8] border-[#B0AE9F] font-light">
            <SelectValue placeholder="Select hours" />
          </SelectTrigger>
          <SelectContent className="bg-[#F4F2E7]">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour} hours
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="testDate" className="block text-sm font-medium mb-2">
          Select the date of the test
        </label>
        <Input
          type="date"
          id="testDate"
          value={formData.testDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, testDate: e.target.value })
          }
          className="bg-[#E7E5D8] border-[#B0AE9F] font-light"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
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
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-light",
                formData.selectedDays.includes(day)
                  ? "bg-[#012622] text-white"
                  : "bg-[#E7E5D8] text-[#012622] border border-[#B0AE9F]"
              )}
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
        <label className="block text-sm font-medium mb-2">
          Upload Study Material
        </label>
        <Input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.txt"
          className="bg-[#E7E5D8] border-[#B0AE9F] font-light"
        />
        {loading && (
          <div className="mt-2 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-[#012622] rounded-full border-t-transparent"></div>
            <span className="ml-2 text-sm text-[#012622] font-light">
              Processing file...
            </span>
          </div>
        )}
        {formData.content && (
          <div className="mt-2">
            <p className="text-sm font-medium">Content preview:</p>
            <div className="mt-1 p-2 bg-[#E7E5D8] rounded text-sm font-light max-h-32 overflow-y-auto">
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
        <h3 className="text-lg font-medium text-[#012622]">
          Review Your Study Plan
        </h3>
        <div className="mt-4 space-y-4 text-left">
          <div>
            <h4 className="text-sm font-medium">Title:</h4>
            <p className="text-sm font-light">{formData.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Study Hours:</h4>
            <p className="text-sm font-light">
              {formData.hoursPerDay} hours per day
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Study Days:</h4>
            <p className="text-sm font-light">
              {formData.selectedDays.join(", ")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Test Date:</h4>
            <p className="text-sm font-light">{formData.testDate}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Content Length:</h4>
            <p className="text-sm font-light">
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
          <div className="animate-spin h-12 w-12 border-b-2 border-[#012622] rounded-full mx-auto"></div>
          <p className="mt-4 text-sm text-[#012622] font-light">
            Creating your study block...
          </p>
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            ✓
          </div>
          <p className="mt-4 text-sm text-green-600 font-light">
            Study block created successfully!
          </p>
        </>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#F4F2E7] border-[#B0AE9F] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-[#012622]">
            {step === 1 && "Create Study Block"}
            {step === 2 && "Upload Study Material"}
            {step === 3 && "Review Plan"}
            {step === 4 && "Creating Study Block"}
          </DialogTitle>
        </DialogHeader>

        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-12">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex flex-col items-center ${
                    stepNumber === step ? "text-[#012622]" : "text-[#B0AE9F]"
                  }`}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      stepNumber === step
                        ? "bg-[#012622] text-white"
                        : stepNumber < step
                        ? "bg-[#E7E5D8] text-[#012622]"
                        : "bg-[#E7E5D8]"
                    )}
                  >
                    {stepNumber < step ? "✓" : stepNumber}
                  </div>
                  <span className="mt-2 text-xs font-light">
                    {stepNumber === 1 && "Details"}
                    {stepNumber === 2 && "Content"}
                    {stepNumber === 3 && "Review"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded font-light">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-2 bg-green-50 border border-green-200 text-green-600 rounded font-light">
            Study block created successfully!
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {step < 4 && (
            <div className="mt-6 flex justify-end gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="bg-[#E7E5D8] border-[#B0AE9F] text-[#012622] hover:bg-[#CFCEC4]"
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#012622] text-white hover:bg-[#012622]/90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#012622] text-white hover:bg-[#012622]/90 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Study Block"}
                </Button>
              )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudyBlockModal;
