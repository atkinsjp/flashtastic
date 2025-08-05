import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { SUBJECTS } from "@shared/schema";

interface SubjectGridProps {
  selectedGrade: string;
}

const subjectConfig = [
  {
    id: "vocabulary",
    name: "Vocabulary",
    icon: "📚",
    gradient: "from-coral to-pink",
    description: "Learn new words"
  },
  {
    id: "math", 
    name: "Math",
    icon: "🔢",
    gradient: "from-turquoise to-mint",
    description: "Numbers & facts"
  },
  {
    id: "science",
    name: "Science", 
    icon: "🔬",
    gradient: "from-sky to-blue-500",
    description: "Discover facts"
  },
  {
    id: "geography",
    name: "Geography",
    icon: "🌍", 
    gradient: "from-golden to-yellow-500",
    description: "Explore the world"
  },
  {
    id: "history",
    name: "History",
    icon: "🏛️",
    gradient: "from-purple-500 to-pink",
    description: "Journey through time"
  },
  {
    id: "biology",
    name: "Biology",
    icon: "🌱",
    gradient: "from-green-500 to-mint", 
    description: "Living things"
  },
  {
    id: "health",
    name: "Health",
    icon: "❤️",
    gradient: "from-red-500 to-coral",
    description: "Stay healthy"
  },
  {
    id: "music",
    name: "Music",
    icon: "🎵",
    gradient: "from-indigo-500 to-purple-600",
    description: "Musical notes"
  }
];

export default function SubjectGrid({ selectedGrade }: SubjectGridProps) {
  const [, setLocation] = useLocation();

  // Get flash cards for each subject to calculate progress
  const { data: subjectProgress } = useQuery({
    queryKey: ["/api/flashcards", selectedGrade],
    select: (data) => {
      if (!data) return {};
      
      // Group cards by subject and calculate mock progress
      const progressBySubject: Record<string, number> = {};
      
      subjectConfig.forEach(subject => {
        const subjectCards = (data as any[]).filter((card: any) => card.subject === subject.id);
        // Mock progress calculation - in real app this would come from user progress
        progressBySubject[subject.id] = subjectCards.length > 0 
          ? Math.floor(Math.random() * 40) + 40 // 40-80% progress
          : 0;
      });
      
      return progressBySubject;
    }
  });

  const handleSubjectClick = (subjectId: string) => {
    // Navigate to study page with subject pre-selected
    setLocation(`/study?subject=${subjectId}&grade=${selectedGrade}`);
  };

  return (
    <section className="mb-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Choose Your Subject</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subjectConfig.map((subject) => {
          const progress = subjectProgress?.[subject.id] || 0;
          
          return (
            <Card
              key={subject.id}
              className={`subject-card bg-gradient-to-br ${subject.gradient} rounded-xl shadow-lg text-white cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}
              onClick={() => handleSubjectClick(subject.id)}
            >
              <CardContent className="p-6 text-center h-full flex flex-col">
                <div className="text-4xl mb-3">{subject.icon}</div>
                <h4 className="text-lg font-bold mb-2 text-[#000000] drop-shadow-md">{subject.name}</h4>
                <p className="text-sm mb-4 flex-1 text-[#000000] font-semibold drop-shadow-md">{subject.description}</p>
                <div className="mt-auto">
                  <Badge 
                    variant="secondary" 
                    className="bg-white/90 text-xs text-[#000000] font-bold border border-gray-800/20"
                  >
                    {progress}% Complete
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
