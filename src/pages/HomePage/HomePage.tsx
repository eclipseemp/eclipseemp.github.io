import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { Swords, Music, Hammer, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DamageCalcSection from './DamageCalcSection';
import HeMingSection from './HeMingSection';
import ReforgeSection from './ReforgeSection';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('damage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* ===== 顶部导航 ===== */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="size-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  燕云十六声工具集
                </h1>
                <p className="text-[10px] text-muted-foreground">游戏工具合集 · 伤害计算 · 和鸣模拟 · 重铸模拟</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                v2.0.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* ===== 主内容区 ===== */}
      <main className="container mx-auto px-4 py-6">
        {/* 标签页切换 */}
        <Card className="mb-6">
          <CardContent className="p-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-auto p-1">
                <TabsTrigger
                  value="damage"
                  className="py-2.5 data-[state=active]:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Swords className="size-4 mr-2" />
                  <span className="text-sm font-medium">伤害计算器</span>
                </TabsTrigger>
                <TabsTrigger
                  value="heming"
                  className="py-2.5 data-[state=active]:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Music className="size-4 mr-2" />
                  <span className="text-sm font-medium">和鸣模拟器</span>
                </TabsTrigger>
                <TabsTrigger
                  value="reforge"
                  className="py-2.5 data-[state=active]:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Hammer className="size-4 mr-2" />
                  <span className="text-sm font-medium">重铸模拟器</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* 内容区域 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'damage' && <DamageCalcSection />}
          {activeTab === 'heming' && <HeMingSection />}
          {activeTab === 'reforge' && <ReforgeSection />}
        </motion.div>
      </main>

      {/* ===== 底部 ===== */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            燕云十六声工具集 · 仅供学习交流使用 · 数据仅供参考
          </p>
        </div>
      </footer>

      {/* Toast 提示 */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          },
        }}
      />
    </div>
  );
}
