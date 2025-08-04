import LearningAvatar from "./learning-avatar";

interface AvatarProgressWidgetProps {
  points: number;
  level: number;
  streak: number;
  avatarGrowth: {
    stage: number;
    experience: number;
    unlocks: string[];
    accessories: string[];
    mood: string;
  };
  onGrowthUpdate?: (growth: any) => void;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export default function AvatarProgressWidget({
  points,
  level,
  streak,
  avatarGrowth,
  onGrowthUpdate,
  size = "md",
  showDetails = true
}: AvatarProgressWidgetProps) {
  const sizeClasses = {
    sm: "w-16 h-20",
    md: "w-20 h-24", 
    lg: "w-24 h-28"
  };

  return (
    <div className={`${sizeClasses[size]} ${showDetails ? '' : 'pointer-events-none'}`}>
      <LearningAvatar
        points={points}
        level={level}
        streak={streak}
        avatarGrowth={avatarGrowth}
        onGrowthUpdate={onGrowthUpdate}
        className="w-full h-full"
      />
    </div>
  );
}