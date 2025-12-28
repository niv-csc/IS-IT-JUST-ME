import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MapPin {
  id: number;
  x: number;
  y: number;
  severity: "low" | "medium" | "high" | "critical";
  delay: number;
}

const severityColors = {
  low: "hsl(var(--severity-low))",
  medium: "hsl(var(--severity-medium))",
  high: "hsl(var(--severity-high))",
  critical: "hsl(var(--severity-critical))",
};

const AnimatedMap = () => {
  const [pins, setPins] = useState<MapPin[]>([]);

  useEffect(() => {
    const generatePins = () => {
      const newPins: MapPin[] = [];
      const severities: Array<"low" | "medium" | "high" | "critical"> = ["low", "medium", "high", "critical"];
      
      for (let i = 0; i < 12; i++) {
        newPins.push({
          id: i,
          x: 15 + Math.random() * 70,
          y: 15 + Math.random() * 70,
          severity: severities[Math.floor(Math.random() * severities.length)],
          delay: Math.random() * 2,
        });
      }
      setPins(newPins);
    };

    generatePins();
    const interval = setInterval(generatePins, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="hsl(var(--map-grid))"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <ellipse cx="50%" cy="50%" rx="40%" ry="40%" fill="url(#mapGlow)" />
      </svg>

      {/* Animated pins */}
      {pins.map((pin) => (
        <motion.div
          key={pin.id}
          className="absolute"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: pin.delay, duration: 0.5 }}
        >
          {/* Ripple effect */}
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{ backgroundColor: severityColors[pin.severity] }}
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2.5 }}
            transition={{
              delay: pin.delay,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
          {/* Pin dot */}
          <motion.div
            className="w-3 h-3 rounded-full shadow-lg"
            style={{ backgroundColor: severityColors[pin.severity] }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: pin.delay,
            }}
          />
        </motion.div>
      ))}

      {/* Floating connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {pins.slice(0, 6).map((pin, i) => {
          const nextPin = pins[(i + 1) % 6];
          if (!nextPin) return null;
          return (
            <motion.line
              key={`line-${pin.id}`}
              x1={`${pin.x}%`}
              y1={`${pin.y}%`}
              x2={`${nextPin.x}%`}
              y2={`${nextPin.y}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: pin.delay + 0.5, duration: 1.5 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default AnimatedMap;
