import { Button } from "@/components/ui/button";
import { GRADES } from "@shared/schema";

interface GradeSelectorProps {
  selectedGrade: string;
  onGradeSelect: (grade: string) => void;
}

const gradeNames = {
  'K': 'Kindergarten',
  '1': '1st Grade',
  '2': '2nd Grade', 
  '3': '3rd Grade',
  '4': '4th Grade',
  '5': '5th Grade',
  '6': '6th Grade',
  '7': '7th Grade',
  '8': '8th Grade'
};

export default function GradeSelector({ selectedGrade, onGradeSelect }: GradeSelectorProps) {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Your Grade Level</h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {GRADES.map((grade) => (
          <Button
            key={grade}
            variant={selectedGrade === grade ? "default" : "outline"}
            className={`grade-btn transition-all duration-300 rounded-xl p-4 h-auto flex flex-col ${
              selectedGrade === grade 
                ? 'bg-coral text-white shadow-lg transform scale-105' 
                : 'bg-white hover:bg-coral hover:text-white transform hover:scale-105'
            }`}
            onClick={() => onGradeSelect(grade)}
          >
            <div className="text-2xl font-bold mb-1">
              {grade === 'K' ? 'K' : `${grade}${
                grade === '1' ? 'st' : 
                grade === '2' ? 'nd' : 
                grade === '3' ? 'rd' : 'th'
              }`}
            </div>
            <div className="text-sm opacity-90">
              {grade === 'K' ? 'Kindergarten' : 'Grade'}
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
}
