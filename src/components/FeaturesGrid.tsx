import { motion } from "framer-motion";
import { 
  Radar, 
  UserCheck, 
  RefreshCw, 
  Smartphone, 
  BarChart3, 
  Lock,
  Zap,
  Globe
} from "lucide-react";

const features = [
  {
    icon: Radar,
    title: "Location-Based Verification",
    description: "Only nearby users can vote, preventing false reports and ensuring authenticity",
  },
  {
    icon: UserCheck,
    title: "Trust Scoring",
    description: "Earn reputation through accurate reports and verified participation",
  },
  {
    icon: RefreshCw,
    title: "Auto-Reposting",
    description: "Unresolved issues automatically repost with expanded radius",
  },
  {
    icon: Smartphone,
    title: "Emergency Mode",
    description: "SMS/USSD support for critical issues during connectivity outages",
  },
  {
    icon: BarChart3,
    title: "Authority Dashboard",
    description: "Heat maps and analytics for utilities and city officials",
  },
  {
    icon: Lock,
    title: "Privacy Protection",
    description: "Exact locations never public, displayed as approximate zones only",
  },
  {
    icon: Zap,
    title: "Instant Escalation",
    description: "Critical issues bypass thresholds and alert authorities immediately",
  },
  {
    icon: Globe,
    title: "Range Control",
    description: "Adjustable geographic impact from street-level to city-wide",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const FeaturesGrid = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />

      <div className="container relative z-10 px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Powerful </span>
            <span className="text-gradient">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for communities, designed for impact
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/50 backdrop-blur-sm transition-all duration-300"
              variants={item}
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
