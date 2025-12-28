import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { useIssues, Issue } from "@/hooks/useIssues";
import VoteModal from "./VoteModal";
import { formatDistanceToNow } from "date-fns";

const BulletinBoard = () => {
  const { issues, loading } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  const handleVoteClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsVoteModalOpen(true);
  };

  const displayedIssues = issues.slice(0, 6);

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container relative z-10 px-4">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Live </span>
              <span className="text-gradient">Bulletin Board</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              Real-time issues reported in your region
            </p>
          </div>
          <Button variant="heroOutline" className="mt-4 md:mt-0">
            View All Issues
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : displayedIssues.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No issues reported yet</h3>
            <p className="text-muted-foreground">Be the first to report an issue in your area!</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 max-w-4xl mx-auto">
            {displayedIssues.map((issue, index) => {
              const voteProgress = Math.min((issue.yes_votes / issue.vote_threshold) * 100, 100);
              const isVerified = issue.status === "verified";

              return (
                <motion.div
                  key={issue.id}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                  onClick={() => handleVoteClick(issue)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={issue.severity}>{issue.severity}</Badge>
                        <Badge variant="secondary">{issue.category}</Badge>
                        {isVerified && (
                          <Badge variant="verified" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {issue.question}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDistanceToNow(new Date(issue.created_at))} ago
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Vote progress */}
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-foreground font-semibold">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{issue.yes_votes}</span>
                          <span className="text-muted-foreground font-normal">/ {issue.vote_threshold}</span>
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full mt-2 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              isVerified
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
                            whileInView={{ width: `${voteProgress}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVoteClick(issue);
                        }}
                      >
                        Vote
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <VoteModal
        issue={selectedIssue}
        isOpen={isVoteModalOpen}
        onClose={() => {
          setIsVoteModalOpen(false);
          setSelectedIssue(null);
        }}
      />
    </section>
  );
};

export default BulletinBoard;
