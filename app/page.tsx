"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Plus, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryStreak } from "@/components/CategoryStreak";
import { StreakStats } from "@/components/StreakStats";
import { MilestoneDisplay } from "@/components/MilestoneDisplay";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  streak: number;
  lastLogin: string | null;
}

export default function Home() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "学習", streak: 0, lastLogin: null },
    { id: 2, name: "運動", streak: 0, lastLogin: null },
    { id: 3, name: "読書", streak: 0, lastLogin: null },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("streakData");
    if (savedData) {
      setCategories(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    // Check for streak resets at midnight
    const checkMidnight = () => {
      const now = new Date();
      categories.forEach((category) => {
        if (category.lastLogin) {
          const lastLogin = new Date(category.lastLogin);
          if (lastLogin.getDate() !== now.getDate()) {
            handleStreakReset(category.id);
          }
        }
      });
    };

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - new Date().getTime();

    const timer = setTimeout(checkMidnight, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [categories]);

  const handleStreakReset = (categoryId: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              streak: 0,
              lastLogin: null,
            }
          : cat
      )
    );
  };

  const handleLogin = (categoryId: number) => {
    const now = new Date();
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const lastLogin = cat.lastLogin ? new Date(cat.lastLogin) : null;
          const isConsecutive =
            lastLogin &&
            now.getDate() - lastLogin.getDate() === 1 &&
            now.getMonth() === lastLogin.getMonth() &&
            now.getFullYear() === lastLogin.getFullYear();

          const newStreak = isConsecutive ? cat.streak + 1 : 1;

          if (newStreak > cat.streak && [7, 30, 100, 365].includes(newStreak)) {
            toast({
              title: "🎉 マイルストーン達成！",
              description: `${cat.name}で${newStreak}日連続達成しました！`,
            });
          }

          return {
            ...cat,
            streak: newStreak,
            lastLogin: now.toISOString(),
          };
        }
        return cat;
      })
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = Math.max(...categories.map(c => c.id), 0) + 1;
      setCategories(prev => [...prev, {
        id: newId,
        name: newCategoryName.trim(),
        streak: 0,
        lastLogin: null
      }]);
      setNewCategoryName("");
      setIsDialogOpen(false);
      toast({
        title: "カテゴリーを追加しました",
        description: `${newCategoryName}を新しく追加しました。`,
      });
    }
  };

  const handleEditCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: editingCategory.name.trim() }
          : cat
      ));
      setEditingCategory(null);
      setIsDialogOpen(false);
      toast({
        title: "カテゴリーを更新しました",
        description: `カテゴリー名を${editingCategory.name}に変更しました。`,
      });
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      toast({
        title: "カテゴリーを削除しました",
        description: `${category.name}を削除しました。`,
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("streakData", JSON.stringify(categories));
  }, [categories]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">継続の炎</h1>
          <p className="text-muted-foreground">
            毎日の達成を記録し、継続の力を実感しよう
          </p>
        </motion.div>

        <div className="flex justify-end mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCategory(null);
                setNewCategoryName("");
              }}>
                <Plus className="mr-2 h-4 w-4" />
                新しいカテゴリー
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "カテゴリーの編集" : "新しいカテゴリーの追加"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="カテゴリー名を入力"
                  value={editingCategory ? editingCategory.name : newCategoryName}
                  onChange={(e) => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, name: e.target.value });
                    } else {
                      setNewCategoryName(e.target.value);
                    }
                  }}
                />
                <Button onClick={editingCategory ? handleEditCategory : handleAddCategory}>
                  {editingCategory ? "更新" : "追加"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="relative">
              <CategoryStreak
                category={category}
                onLogin={() => handleLogin(category.id)}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingCategory(category);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <StreakStats categories={categories} />
        </div>

        <div className="mt-12">
          <MilestoneDisplay categories={categories} />
        </div>
      </main>
    </div>
  );
}
