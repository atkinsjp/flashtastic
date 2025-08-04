import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, Lightbulb, Target } from "lucide-react";

interface InsightData {
  type: string;
  title: string;
  description: string;
  childId?: string;
  confidence?: number;
  priority?: "low" | "medium" | "high";
}

interface ParentInsightsCardProps {
  insights: InsightData[];
  type: "patterns" | "recommendations";
  children?: { id: string; name: string }[];
}

export default function ParentInsightsCard({ 
  insights, 
  type, 
  children = [] 
}: ParentInsightsCardProps) {
  const getChildName = (childId: string) => {
    const child = children.find(c => c.id === childId);
    return child?.name || "Unknown";
  };

  const getIcon = (insightType: string) => {
    switch (insightType) {
      case "peak_hours":
      case "consistency":
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case "subject_focus":
        return <Target className="h-5 w-5 text-orange-600" />;
      case "math_improvement":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getBorderColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {type === "patterns" ? (
            <TrendingUp className="h-5 w-5 mr-2" />
          ) : (
            <Lightbulb className="h-5 w-5 mr-2" />
          )}
          {type === "patterns" ? "Learning Patterns" : "Recommendations"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 border-l-4 rounded-lg ${getBorderColor(insight.priority)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getIcon(insight.type)}
                  <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  {insight.childId && (
                    <Badge variant="secondary" className="text-xs">
                      {getChildName(insight.childId)}
                    </Badge>
                  )}
                  {insight.confidence && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  )}
                  {insight.priority && (
                    <Badge 
                      variant={insight.priority === "high" ? "destructive" : 
                              insight.priority === "medium" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {insight.priority}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}