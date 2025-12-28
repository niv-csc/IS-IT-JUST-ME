import { motion } from "framer-motion";
import { FileText, Eye, Wrench, CheckCircle2 } from "lucide-react";

const stages = [
  { icon: FileText, label: "Reported", color: "bg-muted" },
  { icon: Eye, label: "Acknowledged", color: "bg-severity-medium" },
  { icon: Wrench, label: "In Progress", color: "bg-severity-high" },
  { icon: CheckCircle2, label: "Resolved", color: "bg-severity-low" },
];

const ResolutionTracking = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container relative z-10 px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Transparent </span>
              <span className="text-gradient">Resolution</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Track every issue from report to resolution. Get notified at each stage and know exactly when your problem is fixed.
            </p>

            <div className="space-y-4">
              {[
                "Real-time status updates",
                "Email & push notifications",
                "Authority response tracking",
                "Historical issue data",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-8 rounded-3xl bg-card border border-border shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-severity-critical" />
                <div className="w-3 h-3 rounded-full bg-severity-medium" />
                <div className="w-3 h-3 rounded-full bg-severity-low" />
              </div>

              <h4 className="font-semibold mb-6 text-foreground">Issue #12847 - Water Pressure</h4>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />

                <div className="space-y-6">
                  {stages.map((stage, index) => (
                    <motion.div
                      key={stage.label}
                      className="flex items-center gap-4 relative"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                    >
                      <div className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center z-10`}>
                        <stage.icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{stage.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {index === 0 && "Dec 20, 2024 - 2:30 PM"}
                          {index === 1 && "Dec 20, 2024 - 4:15 PM"}
                          {index === 2 && "Dec 21, 2024 - 9:00 AM"}
                          {index === 3 && "Dec 22, 2024 - 11:30 AM"}
                        </p>
                      </div>
                      {index === 3 && (
                        <motion.div
                          className="ml-auto"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1, type: "spring" }}
                        >
                          <span className="px-3 py-1 rounded-full bg-severity-low/20 text-severity-low text-sm font-medium">
                            Complete
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResolutionTracking;
