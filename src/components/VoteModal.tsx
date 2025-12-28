import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ThumbsUp, ThumbsDown, MapPin, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIssues, Issue } from "@/hooks/useIssues";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface VoteModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
}

const VoteModal = ({ issue, isOpen, onClose }: VoteModalProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const { voteOnIssue } = useIssues();
  const { latitude, longitude, error: locationError, loading: locationLoading, requestLocation } = useGeolocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVote = async (vote: boolean) => {
    if (!user) {
      navigate("/auth");
      onClose();
      return;
    }

    if (!latitude || !longitude || !issue) return;

    setIsVoting(true);
    await voteOnIssue(issue.id, vote, latitude, longitude);
    setIsVoting(false);
    onClose();
  };

  if (!isOpen || !issue) return null;

  const voteProgress = Math.min((issue.yes_votes / issue.vote_threshold) * 100, 100);

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
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Badge variant={issue.severity}>{issue.severity}</Badge>
              <Badge variant="secondary">{issue.category}</Badge>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-2">{issue.title}</h2>
            <p className="text-lg text-muted-foreground mb-4">{issue.question}</p>

            {/* Vote Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Verification Progress</span>
                <span className="font-semibold text-foreground">
                  {issue.yes_votes} / {issue.vote_threshold} votes
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    issue.status === "verified"
                      ? "bg-primary"
                      : issue.severity === "critical"
                      ? "bg-severity-critical"
                      : issue.severity === "high"
                      ? "bg-severity-high"
                      : issue.severity === "medium"
                      ? "bg-severity-medium"
                      : "bg-severity-low"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${voteProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Location Status */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 mb-6">
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
                    Your location will be used for verification
                  </span>
                </>
              )}
            </div>

            {/* Issue Meta */}
            <p className="text-xs text-muted-foreground mb-6">
              Posted {formatDistanceToNow(new Date(issue.created_at))} ago
            </p>

            {/* Vote Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleVote(true)}
                disabled={isVoting || !latitude || !longitude}
                className="h-14 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
              >
                {isVoting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    Yes, same here
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleVote(false)}
                disabled={isVoting || !latitude || !longitude}
                variant="outline"
                className="h-14"
              >
                {isVoting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ThumbsDown className="w-5 h-5 mr-2" />
                    Not for me
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoteModal;
