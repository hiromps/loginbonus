"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: number;
  name: string;
  streak: number;
  lastLogin: string | null;
}

interface StreakStatsProps {
  categories: Category[];
}

export function StreakStats({ categories }: StreakStatsProps) {
  const totalStreaks = categories.reduce((sum, cat) => sum + cat.streak, 0);
  const maxStreak = Math.max(...categories.map((cat) => cat.streak), 0);
  const activeCategories = categories.filter(
    (cat) => cat.lastLogin && new Date(cat.lastLogin).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      title: "総連続日数",
      value: totalStreaks,
    },
    {
      title: "最長連続日数",
      value: maxStreak,
    },
    {
      title: "今日の達成数",
      value: `${activeCategories}/${categories.length}`,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">統計</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 