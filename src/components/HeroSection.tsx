import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedMap from "./AnimatedMap";
import CreateIssueModal from "./CreateIssueModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    issuesReported: 0,
    activeUsers: 0,
    issuesResolved: 0,
    verificationRate: 0,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch total issues
      const { count: totalIssues } = await supabase
        .from("issues")
        .select("*", { count: "exact", head: true });

      // Fetch resolved issues
      const { count: resolvedIssues } = await supabase
        .from("issues")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved");

      // Fetch verified issues
      const { count: verifiedIssues } = await supabase
        .from("issues")
        .select("*", { count: "exact", head: true })
        .eq("status", "verified");

      // Fetch active users (profiles count)
      const { count: activeUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const total = totalIssues || 0;
      const verified = verifiedIssues || 0;
      const rate = total > 0 ? Math.round((verified / total) * 100) : 0;

      setStats({
        issuesReported: total,
        activeUsers: activeUsers || 0,
        issuesResolved: resolvedIssues || 0,
        verificationRate: rate,
      });
    };

    fetchStats();
  }, []);

  const handleReportIssue = () => {
    if (!user) {
      navigate("/auth");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleViewIssues = () => {
    const bulletinSection = document.getElementById("bulletin");
    if (bulletinSection) {
      bulletinSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        <AnimatedMap />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

        <div className="container relative z-10 px-4 py-20">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm font-medium text-primary">Real-time Community Verification</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-foreground">Is It </span>
              <span className="text-gradient">Just Me</span>
              <span className="text-foreground">?</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Verify local issues with your neighbors. 
              Power outage? Water pressure low? Drop a pin, get answers, solve problems together.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="hero" size="xl" onClick={handleReportIssue}>
                <MapPin className="w-5 h-5" />
                Report an Issue
              </Button>
              <Button variant="heroOutline" size="xl" onClick={handleViewIssues}>
                View Local Issues
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: MapPin, value: stats.issuesReported.toLocaleString(), label: "Issues Reported" },
                { icon: Users, value: stats.activeUsers.toLocaleString(), label: "Active Users" },
                { icon: Bell, value: stats.issuesResolved.toLocaleString(), label: "Issues Resolved" },
                { icon: Shield, value: `${stats.verificationRate}%`, label: "Verification Rate" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm"
                  whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--card))" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-6 h-6 text-primary mb-2" />
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div className="w-1.5 h-3 bg-primary rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </section>

      <CreateIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default HeroSection;
