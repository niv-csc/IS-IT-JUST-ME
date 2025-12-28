import { motion } from "framer-motion";
import { 
  Droplets, 
  Zap, 
  Wifi, 
  Construction, 
  Shield, 
  Trash2, 
  ThermometerSun, 
  Car 
} from "lucide-react";

const categories = [
  { icon: Droplets, name: "Water", description: "Low pressure, leaks, quality issues", color: "from-blue-500 to-cyan-500" },
  { icon: Zap, name: "Power", description: "Outages, flickers, voltage problems", color: "from-yellow-500 to-orange-500" },
  { icon: Wifi, name: "Internet", description: "Connectivity, slow speeds, outages", color: "from-purple-500 to-pink-500" },
  { icon: Construction, name: "Roads", description: "Potholes, damage, obstructions", color: "from-gray-500 to-slate-500" },
  { icon: Shield, name: "Safety", description: "Hazards, suspicious activity", color: "from-red-500 to-rose-500" },
  { icon: Trash2, name: "Sanitation", description: "Garbage, drainage, cleanliness", color: "from-green-500 to-emerald-500" },
  { icon: ThermometerSun, name: "Environment", description: "Air quality, noise, pollution", color: "from-teal-500 to-green-500" },
  { icon: Car, name: "Traffic", description: "Signals, congestion, parking", color: "from-indigo-500 to-violet-500" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CategoriesSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />

      <div className="container relative z-10 px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Report Any Issue</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From infrastructure to safety, track and verify problems across your community
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.name}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden"
              variants={item}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <category.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
