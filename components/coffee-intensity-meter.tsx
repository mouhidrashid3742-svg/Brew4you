interface CoffeeIntensityMeterProps {
  level: number;
}

const labels = ["Mild", "Balanced", "Bold", "Intense", "Strong"];

export default function CoffeeIntensityMeter({ level }: CoffeeIntensityMeterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-ink/70">
        <span>Intensity</span>
        <span>{labels[level - 1]}</span>
      </div>
      <div className="flex h-3 gap-2 rounded-full bg-white/5 p-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`h-full rounded-full transition-all ${index < level ? "bg-gold/90 flex-1" : "bg-white/10 flex-1"}`}
          />
        ))}
      </div>
    </div>
  );
}
