import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Hammer, Sparkles, Star, Lock, Unlock, RotateCcw, Settings,
  Shield, Target, TrendingUp, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ========== 类型 ==========
interface Affix {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  isPercent: boolean;
  quality: 'gold' | 'purple' | 'blue';
  category: string;
}

interface ReforgeHistory {
  id: number;
  affixes: Affix[];
  isGold: boolean;
  timestamp: number;
}

// ========== 常量 ==========
const AFFIX_POOL: Affix[] = [
  // 金色词条
  { id: 'g1', name: '外功攻击', value: 105.6, maxValue: 105.6, isPercent: false, quality: 'gold', category: '基础' },
  { id: 'g2', name: '会心率', value: 12.3, maxValue: 12.3, isPercent: true, quality: 'gold', category: '基础' },
  { id: 'g3', name: '会意率', value: 6.0, maxValue: 6.0, isPercent: true, quality: 'gold', category: '基础' },
  { id: 'g4', name: '外功穿透', value: 14.6, maxValue: 14.6, isPercent: false, quality: 'gold', category: '穿透' },
  { id: 'g5', name: '无相穿透', value: 15.6, maxValue: 15.6, isPercent: false, quality: 'gold', category: '穿透' },
  { id: 'g6', name: '全武学增效', value: 4.2, maxValue: 4.2, isPercent: true, quality: 'gold', category: '增伤' },
  { id: 'g7', name: '首领增伤', value: 4.4, maxValue: 4.4, isPercent: true, quality: 'gold', category: '增伤' },
  // 紫色词条
  { id: 'p1', name: '劲', value: 66.8, maxValue: 66.8, isPercent: false, quality: 'purple', category: '三维' },
  { id: 'p2', name: '敏', value: 66.8, maxValue: 66.8, isPercent: false, quality: 'purple', category: '三维' },
  { id: 'p3', name: '势', value: 66.8, maxValue: 66.8, isPercent: false, quality: 'purple', category: '三维' },
  { id: 'p4', name: '精准率', value: 10.8, maxValue: 10.8, isPercent: true, quality: 'purple', category: '基础' },
  { id: 'p5', name: '武学增效', value: 8.6, maxValue: 8.6, isPercent: true, quality: 'purple', category: '增伤' },
  { id: 'p6', name: '单体增伤', value: 13.4, maxValue: 13.4, isPercent: true, quality: 'purple', category: '增伤' },
  { id: 'p7', name: '群体增伤', value: 13.4, maxValue: 13.4, isPercent: true, quality: 'purple', category: '增伤' },
  { id: 'p8', name: '破竹属攻', value: 59.8, maxValue: 59.8, isPercent: false, quality: 'purple', category: '属攻' },
  { id: 'p9', name: '牵丝属攻', value: 59.8, maxValue: 59.8, isPercent: false, quality: 'purple', category: '属攻' },
  { id: 'p10', name: '鸣金属攻', value: 59.8, maxValue: 59.8, isPercent: false, quality: 'purple', category: '属攻' },
  { id: 'p11', name: '裂石属攻', value: 59.8, maxValue: 59.8, isPercent: false, quality: 'purple', category: '属攻' },
  // 蓝色词条
  { id: 'b1', name: '生命', value: 500, maxValue: 500, isPercent: false, quality: 'blue', category: '生存' },
  { id: 'b2', name: '防御', value: 100, maxValue: 100, isPercent: false, quality: 'blue', category: '生存' },
  { id: 'b3', name: '闪避', value: 5, maxValue: 5, isPercent: true, quality: 'blue', category: '生存' },
  { id: 'b4', name: '招架', value: 5, maxValue: 5, isPercent: true, quality: 'blue', category: '生存' },
];

const QUALITY_COLORS: Record<string, string> = {
  gold: 'text-amber-400 border-amber-400/50 bg-amber-400/10',
  purple: 'text-purple-400 border-purple-400/50 bg-purple-400/10',
  blue: 'text-blue-400 border-blue-400/50 bg-blue-400/10',
};

const QUALITY_NAMES: Record<string, string> = {
  gold: '砺金',
  purple: '承影',
  blue: '流风',
};

// ========== 工具函数 ==========
function getRandomAffix(excludeIds: string[] = [], quality?: 'gold' | 'purple' | 'blue'): Affix {
  let pool = AFFIX_POOL.filter(a => !excludeIds.includes(a.id));
  if (quality) {
    pool = pool.filter(a => a.quality === quality);
  }
  const affix = pool[Math.floor(Math.random() * pool.length)];
  // 随机数值（0.85 ~ 1.0 倍满值）
  const multiplier = 0.85 + Math.random() * 0.15;
  return {
    ...affix,
    value: Math.round(affix.maxValue * multiplier * 10) / 10,
  };
}

function rollReforgeQuality(pity: number): 'gold' | 'purple' | 'blue' {
  // 基础概率：金5%，紫30%，蓝65%
  // 保底：每10次必出紫，每50次必出金
  const goldProb = Math.min(0.05 + pity * 0.005, 0.5);
  const purpleProb = 0.3;
  
  const r = Math.random();
  if (pity >= 49 || r < goldProb) return 'gold';
  if (r < goldProb + purpleProb) return 'purple';
  return 'blue';
}

// ========== 主组件 ==========
export default function ReforgeSection() {
  // 当前词条
  const [currentAffixes, setCurrentAffixes] = useState<Affix[]>(() => {
    const affixes: Affix[] = [];
    const usedIds: string[] = [];
    // 初始：1金2紫3蓝
    affixes.push(getRandomAffix(usedIds, 'gold'));
    usedIds.push(affixes[0].id);
    affixes.push(getRandomAffix(usedIds, 'purple'));
    usedIds.push(affixes[1].id);
    affixes.push(getRandomAffix(usedIds, 'purple'));
    usedIds.push(affixes[2].id);
    affixes.push(getRandomAffix(usedIds, 'blue'));
    usedIds.push(affixes[3].id);
    affixes.push(getRandomAffix(usedIds, 'blue'));
    usedIds.push(affixes[4].id);
    affixes.push(getRandomAffix(usedIds, 'blue'));
    return affixes;
  });

  // 锁定状态
  const [lockedIndices, setLockedIndices] = useState<Set<number>>(new Set());

  // 保底计数
  const [goldPity, setGoldPity] = useState(0);
  const [purplePity, setPurplePity] = useState(0);

  // 重铸历史
  const [history, setHistory] = useState<ReforgeHistory[]>([]);
  const [reforgeCount, setReforgeCount] = useState(0);

  // 动画状态
  const [isReforging, setIsReforging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultAffixes, setResultAffixes] = useState<Affix[]>([]);
  const [resultIsGold, setResultIsGold] = useState(false);

  // 音效
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const goldAudioRef = useRef<HTMLAudioElement | null>(null);

  // 锁定/解锁
  const toggleLock = useCallback((index: number) => {
    setLockedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (next.size >= 3) {
          toast.error('最多锁定3条词条');
          return prev;
        }
        next.add(index);
      }
      return next;
    });
  }, []);

  // 重铸
  const doReforge = useCallback(() => {
    if (isReforging) return;
    setIsReforging(true);
    setShowResult(false);

    // 确定重铸质量
    const quality = rollReforgeQuality(goldPity);
    const isGold = quality === 'gold';

    // 生成新词条
    setTimeout(() => {
      const newAffixes: Affix[] = [];
      const usedIds: string[] = [];

      // 保留锁定的词条
      currentAffixes.forEach((affix, index) => {
        if (lockedIndices.has(index)) {
          newAffixes.push(affix);
          usedIds.push(affix.id);
        }
      });

      // 重新随机未锁定的词条
      const unlockedCount = currentAffixes.length - lockedIndices.size;
      for (let i = 0; i < unlockedCount; i++) {
        // 如果是金色重铸，至少有一条金色词条
        if (isGold && i === 0) {
          const affix = getRandomAffix(usedIds, 'gold');
          newAffixes.push(affix);
          usedIds.push(affix.id);
        } else {
          const affix = getRandomAffix(usedIds);
          newAffixes.push(affix);
          usedIds.push(affix.id);
        }
      }

      // 播放音效
      if (isGold) {
        // 金色专属音效
        toast.success('✨ 砺金品质！');
      } else {
        // 普通音效
      }

      setResultAffixes(newAffixes);
      setResultIsGold(isGold);
      setShowResult(true);
      setIsReforging(false);

      // 更新保底
      if (isGold) {
        setGoldPity(0);
        setPurplePity(0);
      } else {
        setGoldPity(p => p + 1);
        if (quality === 'purple') {
          setPurplePity(0);
        } else {
          setPurplePity(p => p + 1);
        }
      }

      setReforgeCount(c => c + 1);

      // 添加到历史
      setHistory(prev => [{
        id: Date.now(),
        affixes: newAffixes,
        isGold,
        timestamp: Date.now(),
      }, ...prev].slice(0, 50));
    }, 800);
  }, [isReforging, currentAffixes, lockedIndices, goldPity]);

  // 确认结果
  const confirmResult = useCallback(() => {
    setCurrentAffixes(resultAffixes);
    setShowResult(false);
    setLockedIndices(new Set());
    toast.success('已保存重铸结果');
  }, [resultAffixes]);

  // 取消结果
  const cancelResult = useCallback(() => {
    setShowResult(false);
    toast.info('已取消，保留原词条');
  }, []);

  // 重置
  const resetAll = useCallback(() => {
    const affixes: Affix[] = [];
    const usedIds: string[] = [];
    affixes.push(getRandomAffix(usedIds, 'gold'));
    usedIds.push(affixes[0].id);
    affixes.push(getRandomAffix(usedIds, 'purple'));
    usedIds.push(affixes[1].id);
    affixes.push(getRandomAffix(usedIds, 'purple'));
    usedIds.push(affixes[2].id);
    affixes.push(getRandomAffix(usedIds, 'blue'));
    usedIds.push(affixes[3].id);
    affixes.push(getRandomAffix(usedIds, 'blue'));
    usedIds.push(affixes[4].id);
    affixes.push(getRandomAffix(usedIds, 'blue'));
    setCurrentAffixes(affixes);
    setLockedIndices(new Set());
    setGoldPity(0);
    setPurplePity(0);
    setHistory([]);
    setReforgeCount(0);
    setShowResult(false);
    toast('已重置所有词条');
  }, []);

  // 计算承音值
  const getChengYinValue = (affix: Affix): number => {
    // 特殊词条直接满值
    if (['外功穿透', '无相穿透'].includes(affix.name)) {
      return affix.maxValue;
    }
    // 定音词条直接满值
    if (affix.name.includes('定音')) {
      return affix.maxValue;
    }
    // 其他词条94%
    return Math.round(affix.maxValue * 0.94 * 10) / 10;
  };

  const displayAffixes = showResult ? resultAffixes : currentAffixes;

  return (
    <div className="space-y-6">
      {/* ===== 顶部标题 ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-warning flex items-center justify-center">
            <Hammer className="size-4 text-warning-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">武器重铸模拟器</h2>
            <p className="text-xs text-muted-foreground">词条随机模拟与保底机制</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetAll}>
          <RotateCcw className="size-3.5 mr-1" /> 重置
        </Button>
      </div>

      {/* ===== 三栏布局 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ===== 左栏：当前词条 ===== */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              {showResult ? '重铸结果' : '当前词条'}
              {showResult && resultIsGold && (
                <Badge className="bg-amber-500 text-amber-950 ml-2">✨ 砺金</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* 词条列表 */}
            <div className="space-y-2">
              {displayAffixes.map((affix, index) => (
                <motion.div
                  key={`${affix.id}-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border transition-all',
                    QUALITY_COLORS[affix.quality],
                    showResult && 'animate-pulse'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn(
                      'text-[10px] font-bold',
                      affix.quality === 'gold' && 'border-amber-500 text-amber-400',
                      affix.quality === 'purple' && 'border-purple-500 text-purple-400',
                      affix.quality === 'blue' && 'border-blue-500 text-blue-400',
                    )}>
                      {QUALITY_NAMES[affix.quality]}
                    </Badge>
                    <span className="text-sm font-medium">{affix.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tabular-nums">
                      {affix.value}{affix.isPercent ? '%' : ''}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      / {affix.maxValue}{affix.isPercent ? '%' : ''}
                    </span>
                    {!showResult && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => toggleLock(index)}
                      >
                        {lockedIndices.has(index) ? (
                          <Lock className="size-3.5 text-amber-400" />
                        ) : (
                          <Unlock className="size-3.5 text-muted-foreground" />
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 承音参考 */}
            <div className="p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">承音参考（94%）</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                {displayAffixes.slice(0, 4).map((affix, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{affix.name}</span>
                    <span className="font-mono">
                      {getChengYinValue(affix)}{affix.isPercent ? '%' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            {showResult ? (
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={confirmResult}
                >
                  ✅ 确认保存
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={cancelResult}
                >
                  ❌ 取消保留
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={doReforge}
                disabled={isReforging}
                size="lg"
              >
                {isReforging ? (
                  <>
                    <span className="animate-spin mr-2">⚒️</span>
                    重铸中...
                  </>
                ) : (
                  <>
                    <Hammer className="size-4 mr-2" />
                    开始重铸（锁定 {lockedIndices.size}/3 条）
                  </>
                )}
              </Button>
            )}

            {/* 提示 */}
            <p className="text-[10px] text-muted-foreground text-center">
              💡 点击锁定图标可锁定词条，最多锁定3条；砺金品质有专属音效
            </p>
          </CardContent>
        </Card>

        {/* ===== 右栏：保底 + 统计 ===== */}
        <div className="space-y-4">
          {/* 保底进度 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="size-4 text-amber-400" />
                保底进度
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-400" />砺金保底
                  </span>
                  <span className="font-bold text-amber-400">{goldPity}/50</span>
                </div>
                <Progress value={(goldPity / 50) * 100} className="h-2 [&>div]:bg-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="size-3 text-purple-400" />承影保底
                  </span>
                  <span className="font-bold text-purple-400">{purplePity}/10</span>
                </div>
                <Progress value={(purplePity / 10) * 100} className="h-2 [&>div]:bg-purple-500" />
              </div>
              <div className="text-[10px] text-muted-foreground">
                累计重铸：<span className="font-bold text-foreground">{reforgeCount}</span> 次
              </div>
            </CardContent>
          </Card>

          {/* 词条池说明 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="size-4 text-info" />
                词条池说明
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-amber-400 font-medium">砺金（金色）</span>
                <span className="text-muted-foreground ml-auto">7种</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span className="text-purple-400 font-medium">承影（紫色）</span>
                <span className="text-muted-foreground ml-auto">11种</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="text-blue-400 font-medium">流风（蓝色）</span>
                <span className="text-muted-foreground ml-auto">4种</span>
              </div>
              <Separator />
              <div className="text-[10px] text-muted-foreground space-y-1">
                <p>• 基础概率：金5% / 紫30% / 蓝65%</p>
                <p>• 保底机制：50次必金，10次必紫</p>
                <p>• 锁定功能：最多锁定3条词条</p>
                <p>• 砺金重铸：专属金色音效</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== 重铸历史 ===== */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            重铸历史（最近50条）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-8">
                <Hammer className="size-4 mr-2" /> 暂无重铸记录
              </div>
            ) : (
              <div className="space-y-2 pr-2">
                {history.map((record, i) => (
                  <div
                    key={record.id}
                    className={cn(
                      'flex items-center justify-between p-2 rounded-lg border text-xs',
                      record.isGold
                        ? 'border-amber-400/30 bg-amber-400/5'
                        : 'border-border bg-card/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">#{history.length - i}</span>
                      {record.isGold && <Badge className="bg-amber-500 text-amber-950 text-[10px]">砺金</Badge>}
                      <span className="text-muted-foreground">
                        {record.affixes.length}条词条
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {record.affixes.slice(0, 3).map((affix, j) => (
                        <span
                          key={j}
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[10px]',
                            affix.quality === 'gold' && 'bg-amber-500/20 text-amber-400',
                            affix.quality === 'purple' && 'bg-purple-500/20 text-purple-400',
                            affix.quality === 'blue' && 'bg-blue-500/20 text-blue-400',
                          )}
                        >
                          {affix.name}
                        </span>
                      ))}
                      {record.affixes.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{record.affixes.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
