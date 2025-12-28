import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type IssueCategory = "water" | "power" | "internet" | "roads" | "safety" | "sanitation" | "noise" | "other";
export type IssueSeverity = "low" | "medium" | "high" | "critical";
export type IssueStatus = "active" | "verified" | "acknowledged" | "in_progress" | "resolved";

export interface Issue {
  id: string;
  user_id: string;
  title: string;
  question: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  radius_meters: number;
  vote_threshold: number;
  yes_votes: number;
  no_votes: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIssueData {
  title: string;
  question: string;
  category: IssueCategory;
  severity: IssueSeverity;
  latitude: number;
  longitude: number;
  radius_meters?: number;
  vote_threshold?: number;
}

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchIssues = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching issues:", error);
      toast({
        title: "Error",
        description: "Failed to load issues",
        variant: "destructive",
      });
    } else {
      setIssues(data as Issue[]);
    }
    setLoading(false);
  };

  const createIssue = async (issueData: CreateIssueData) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to report an issue",
        variant: "destructive",
      });
      return { error: new Error("Not authenticated") };
    }

    const { data, error } = await supabase
      .from("issues")
      .insert({
        user_id: user.id,
        ...issueData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating issue:", error);
      toast({
        title: "Error",
        description: "Failed to create issue",
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Issue reported!",
      description: "Your issue has been posted for community verification.",
    });

    setIssues((prev) => [data as Issue, ...prev]);
    return { data };
  };

  const voteOnIssue = async (issueId: string, vote: boolean, latitude: number, longitude: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return { error: new Error("Not authenticated") };
    }

    const { error } = await supabase.from("votes").insert({
      issue_id: issueId,
      user_id: user.id,
      vote,
      latitude,
      longitude,
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already voted",
          description: "You have already voted on this issue",
          variant: "destructive",
        });
      } else {
        console.error("Error voting:", error);
        toast({
          title: "Error",
          description: "Failed to submit vote",
          variant: "destructive",
        });
      }
      return { error };
    }

    toast({
      title: "Vote submitted!",
      description: `You voted ${vote ? "Yes" : "No"} on this issue.`,
    });

    // Refresh issues to get updated vote counts
    await fetchIssues();
    return { success: true };
  };

  useEffect(() => {
    fetchIssues();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("issues-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "issues",
        },
        (payload) => {
          console.log("Issue change:", payload);
          if (payload.eventType === "INSERT") {
            setIssues((prev) => [payload.new as Issue, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setIssues((prev) =>
              prev.map((issue) =>
                issue.id === payload.new.id ? (payload.new as Issue) : issue
              )
            );
          } else if (payload.eventType === "DELETE") {
            setIssues((prev) =>
              prev.filter((issue) => issue.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { issues, loading, createIssue, voteOnIssue, refetch: fetchIssues };
};
