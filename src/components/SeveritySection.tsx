import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle, AlertCircle, Flame } from "lucide-react";

const severityLevels = [
  {
    level: "Low",
    icon: Info,
    variant: "low" as const,
    votes: "15+ votes",
    time: "7 days",
    examples: "Streetlight out, minor pothole",
    bgClass: "bg-severity-low/10 border-severity-low/30",
    iconColor: "text-severity-low",
  },
  {
    level: "Medium",
    icon: AlertTriangle,
    variant: "medium" as const,
    votes: "10+ votes",
    time: "3 days",
    examples: "Water discoloration, internet slowdown",
    bgClass: "bg-severity-medium/10 border-severity-medium/30",
    iconColor: "text-severity-medium",
  },
  {
    level: "High",
    icon: AlertCircle,
    variant: "high" as const,
    votes: "5+ votes",
    time: "24 hours",
    examples: "Power outage, major road damage",
    bgClass: "bg-severity-high/10 border-severity-high/30",
    iconColor: "text-severity-high",
  },
  {
    level: "Critical",
    icon: Flame,
    variant: "critical" as const,
    votes: "Immediate",
    time: "Auto-escalate",
    examples: "Gas leak, fire, flooding",
    bgClass: "bg-severity-critical/10 border-severity-critical/30",
    iconColor: "text-severity-critical",
  },
];

const SeveritySection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container relative z-10 px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Severity </span>
            <span className="text-gradient">Levels</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Issues are prioritized based on urgency and community impact
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {severityLevels.map((severity, index) => (
            <motion.div
              key={severity.level}
              className={`p-6 rounded-2xl border-2 ${severity.bgClass} relative overflow-hidden`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Glow effect for critical */}
              {severity.level === "Critical" && (
                <div className="absolute inset-0 bg-severity-critical/5 animate-pulse" />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <severity.icon className={`w-10 h-10 ${severity.iconColor}`} />
                  <Badge variant={severity.variant}>{severity.level}</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Threshold</p>
                    <p className="font-semibold text-foreground">{severity.votes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Escalation</p>
                    <p className="font-semibold text-foreground">{severity.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Examples</p>
                    <p className="text-sm text-foreground">{severity.examples}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeveritySection;
