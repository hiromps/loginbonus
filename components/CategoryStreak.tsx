"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
  streak: number;
  lastLogin: string | null;
}

interface CategoryStreakProps {
  category: Category;
  onLogin: () => void;
}

export function CategoryStreak({ category, onLogin }: CategoryStreakProps) {
  const isLoggedInToday = category.lastLogin
    ? new Date(category.lastLogin).toDateString() === new Date().toDateString()
    : false;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          {category.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-primary"
            >
              {category.streak}
            </motion.div>
            <p className="text-sm text-muted-foreground">連続日数</p>
          </div>

          <Button
            onClick={onLogin}
            disabled={isLoggedInToday}
            className="w-full"
          >
            {isLoggedInToday ? "今日は達成済み" : "今日の達成を記録"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 