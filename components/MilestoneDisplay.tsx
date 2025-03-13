"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: number;
  name: string;
  streak: number;
  lastLogin: string | null;
}

interface MilestoneDisplayProps {
  categories: Category[];
}

export function MilestoneDisplay({ categories }: MilestoneDisplayProps) {
  const milestones = [
    { days: 7, label: "1週間達成", emoji: "🌱" },
    { days: 30, label: "1ヶ月達成", emoji: "🌿" },
    { days: 100, label: "100日達成", emoji: "🌳" },
    { days: 365, label: "1年達成", emoji: "🌲" },
  ];

  const getCategoryMilestones = (category: Category) => {
    return milestones.map((milestone) => ({
      ...milestone,
      achieved: category.streak >= milestone.days,
      progress: Math.min(100, Math.round((category.streak / milestone.days) * 100)),
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">マイルストーン</h2>
      <div className="grid grid-cols-1 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getCategoryMilestones(category).map((milestone, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      milestone.achieved
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/50 border-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{milestone.emoji}</span>
                      <span className="text-sm font-medium">
                        {milestone.achieved ? "達成" : `${milestone.progress}%`}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{milestone.label}</div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 