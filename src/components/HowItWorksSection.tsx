import { motion } from "framer-motion";
import { MapPin, Users, CheckCircle, Bell } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Drop a Pin",
    description: "Report an issue at your exact location with a simple yes/no question",
    color: "from-primary to-cyan-400",
  },
  {
    icon: Users,
    title: "Community Verifies",
    description: "Nearby residents vote on whether they're experiencing the same issue",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: CheckCircle,
    title: "Issue Validated",
    description: "Once enough neighbors confirm, the issue becomes verified",
    color: "from-severity-low to-emerald-400",
  },
  {
    icon: Bell,
    title: "Auto-Escalation",
    description: "Verified issues are automatically sent to responsible authorities",
    color: "from-severity-high to-red-400",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container relative z-10 px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">How It </span>
            <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to validate and resolve community issues
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Step number */}
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary z-10"
                  whileHover={{ scale: 1.2 }}
                >
                  {index + 1}
                </motion.div>

                {/* Icon container */}
                <motion.div
                  className={`w-20 h-20 mx-auto mb-6 mt-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <step.icon className="w-10 h-10 text-foreground" />
                </motion.div>

                <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
