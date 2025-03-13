"use client";

import { motion } from "framer-motion";
import { Flame, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

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
  const [timeUntilReset, setTimeUntilReset] = useState<string | null>(null);

  const isLoggedInToday = category.lastLogin
    ? new Date(category.lastLogin).toDateString() === new Date().toDateString()
    : false;

  useEffect(() => {
    const calculateTimeUntilReset = () => {
      if (!category.lastLogin || isLoggedInToday) {
        setTimeUntilReset(null);
        return;
      }

      const lastLogin = new Date(category.lastLogin);
      const nextMidnight = new Date(lastLogin);
      nextMidnight.setDate(nextMidnight.getDate() + 2);
      nextMidnight.setHours(0, 0, 0, 0);

      const now = new Date();
      const timeLeft = nextMidnight.getTime() - now.getTime();

      if (timeLeft <= 0) {
        setTimeUntilReset(null);
        return;
      }

      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      if (hoursLeft < 24) {
        setTimeUntilReset(`${hoursLeft}時間${minutesLeft}分`);
      } else {
        setTimeUntilReset(null);
      }
    };

    calculateTimeUntilReset();
    const interval = setInterval(calculateTimeUntilReset, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [category.lastLogin, isLoggedInToday]);

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

          {timeUntilReset && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md w-full">
              <AlertCircle className="h-4 w-4" />
              <span>リセットまであと{timeUntilReset}</span>
            </div>
          )}

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