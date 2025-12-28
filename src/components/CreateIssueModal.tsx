import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIssues, IssueCategory, IssueSeverity } from "@/hooks/useIssues";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const issueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  question: z.string().min(10, "Question must be at least 10 characters").max(200, "Question is too long"),
  category: z.enum(["water", "power", "internet", "roads", "safety", "sanitation", "noise", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
});

const categories: { value: IssueCategory; label: string }[] = [
  { value: "water", label: "Water" },
  { value: "power", label: "Power" },
  { value: "internet", label: "Internet" },
  { value: "roads", label: "Roads" },
  { value: "safety", label: "Safety" },
  { value: "sanitation", label: "Sanitation" },
  { value: "noise", label: "Noise" },
  { value: "other", label: "Other" },
];

const severities: { value: IssueSeverity; label: string; description: string }[] = [
  { value: "low", label: "Low", description: "Minor inconvenience" },
  { value: "medium", label: "Medium", description: "Notable disruption" },
  { value: "high", label: "High", description: "Significant impact" },
  { value: "critical", label: "Critical", description: "Emergency situation" },
];

const CreateIssueModal = ({ isOpen, onClose }: CreateIssueModalProps) => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<IssueCategory>("other");
  const [severity, setSeverity] = useState<IssueSeverity>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createIssue } = useIssues();
  const { latitude, longitude, error: locationError, loading: locationLoading, requestLocation } = useGeolocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!user) {
      navigate("/auth");
      onClose();
      return;
    }

    if (!latitude || !longitude) {
      setErrors({ location: "Location is required to report an issue" });
      return;
    }

    const result = issueSchema.safeParse({ title, question, category, severity });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    const { error } = await createIssue({
      title,
      question,
      category,
      severity,
      latitude,
      longitude,
    });

    setIsSubmitting(false);

    if (!error) {
      setTitle("");
      setQuestion("");
      setCategory("other");
      setSeverity("medium");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Report an Issue</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Location Status */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              {locationLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Getting your location...</span>
                </>
              ) : locationError ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">{locationError}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={requestLocation}
                    className="ml-auto"
                  >
                    Retry
                  </Button>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Location acquired ({latitude?.toFixed(4)}, {longitude?.toFixed(4)})
                  </span>
                </>
              )}
            </div>
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                placeholder="e.g., Low water pressure in Oak Street"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Yes/No Question</Label>
              <Textarea
                id="question"
                placeholder="e.g., Is your water pressure unusually low right now?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={2}
              />
              {errors.question && (
                <p className="text-sm text-destructive">{errors.question}</p>
              )}
            </div>

            {/* Category & Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as IssueCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={severity} onValueChange={(v) => setSeverity(v as IssueSeverity)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severities.map((sev) => (
                      <SelectItem key={sev.value} value={sev.value}>
                        {sev.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                className="flex-1"
                disabled={isSubmitting || !latitude || !longitude}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Report Issue"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateIssueModal;
