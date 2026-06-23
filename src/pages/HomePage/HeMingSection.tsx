import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Gem, Music, Lock, Coins, Sparkles, Dices, Dice1, Flame, Zap,
  Star, TrendingUp, Gift, ShoppingCart, Layers, Trash2, RotateCcw, Clock
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
interface DrawRecord {
  sequence: number;
  itemName: string;
  rarity: 'legendary' | 'epic' | 'common';
  isLegendary: boolean;
  isEpic: boolean;
  isDecomposed: boolean;
  isBind: boolean;
  ruyiTriggered: boolean;
  convertedToBayin: boolean;
  isLegendaryItem: boolean;
  legendaryPityBefore: number;
}

interface PoolState {
  legendaryPity: number;
  epicPity: number;
  ruyi: number;
  bayinCount: number;
  lastBayinPity: number;
}

// ========== 常量 ==========
const LEGENDARY_PROB_BASE = 0.006;
const EPIC_PROB = 0.06;
const SOFT_PITY_START = 110;
const HARD_PITY_LIMIT = 150;

const EPIC_ITEMS = [
  '破竹·断玉', '牵丝·织梦', '裂石·崩山', '鸣金·破晓',
  '外功精通', '内功精通', '会心秘籍', '会意秘籍',
  '精准之书', '穿透要诀', '增伤秘典', '首领克星',
];

const COMMON_ITEMS = [
  '铜币', '材料碎片', '经验书', '强化石',
  '普通秘籍', '普通丹药', '普通符纸', '普通材料',
];

const LEGENDARY_ITEMS = [
  { name: '玄骨在渊', isCurrency: false, amount: 0 },
  { name: '无生蛊', isCurrency: false, amount: 0 },
  { name: '八音窍', isCurrency: true, amount: 2 },
];

const GIFT_MILESTONES = [10, 20, 30, 50, 70, 100, 150, 200, 250, 300];
const GIFT_TIANJING: Record<number, number> = {
  10: 50, 20: 100, 30: 150, 50: 200, 70: 300,
  100: 500, 150: 800, 200: 1000, 250: 1500, 300: 2000,
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ========== 主组件 ==========
export default function HeMingSection() {
  // 资源
  const [normalCurrency, setNormalCurrency] = useState(100);
  const [bindCurrency, setBindCurrency] = useState(50);
  const [bayinQiao, setBayinQiao] = useState(0);
  const [bindBayinQiao, setBindBayinQiao] = useState(0);
  const [qianYuan, setQianYuan] = useState(0);
  const [tianJing, setTianJing] = useState(0);

  // 池状态
  const [normalPool, setNormalPool] = useState<PoolState>({
    legendaryPity: 0, epicPity: 0, ruyi: 0, bayinCount: 0, lastBayinPity: 0,
  });
  const [bindPool, setBindPool] = useState<PoolState>({
    legendaryPity: 0, epicPity: 0, ruyi: 0, bayinCount: 0, lastBayinPity: 0,
  });

  // 当前池
  const [currentPool, setCurrentPool] = useState<'normal' | 'bind'>('normal');
  const [bindOnlyMode, setBindOnlyMode] = useState(false);

  // 抽卡模式
  const [drawMode, setDrawMode] = useState<'normal' | 'shuang5' | 'shuang10'>('normal');

  // 保底参数
  const [hardPityLimit, setHardPityLimit] = useState(HARD_PITY_LIMIT);
  const [softPityStart, setSoftPityStart] = useState(SOFT_PITY_START);

  // 剩余次数输入
  const [remainingInput, setRemainingInput] = useState('');
  const [autoResult, setAutoResult] = useState('');

  // 自动抽卡
  const [isAutoDrawing, setIsAutoDrawing] = useState(false);
  const isAutoDrawingRef = useRef(false);

  // 抽卡历史
  const [drawHistory, setDrawHistory] = useState<DrawRecord[]>([]);
  const [drawSequence, setDrawSequence] = useState(0);

  // 赠礼
  const [eventDrawCount, setEventDrawCount] = useState(0);
  const [giftClaimed, setGiftClaimed] = useState<Record<number, boolean>>({});

  // 拥有物品
  const [ownedEpic, setOwnedEpic] = useState<Record<string, number>>(() => {
    const obj: Record<string, number> = {};
    EPIC_ITEMS.forEach(item => { obj[item] = 0; });
    return obj;
  });
  const [ownedLegendary, setOwnedLegendary] = useState<Record<string, number>>({
    '玄骨在渊': 0, '无生蛊': 0,
  });

  // 统计
  const [totalHistoryDraws, setTotalHistoryDraws] = useState(0);

  // Refs for auto draw
  const currentPoolRef = useRef(currentPool);
  const bindOnlyModeRef = useRef(bindOnlyMode);
  const normalCurrencyRef = useRef(normalCurrency);
  const bindCurrencyRef = useRef(bindCurrency);

  useEffect(() => { currentPoolRef.current = currentPool; }, [currentPool]);
  useEffect(() => { bindOnlyModeRef.current = bindOnlyMode; }, [bindOnlyMode]);
  useEffect(() => { normalCurrencyRef.current = normalCurrency; }, [normalCurrency]);
  useEffect(() => { bindCurrencyRef.current = bindCurrency; }, [bindCurrency]);

  // ========== 工具函数 ==========
  const getPool = useCallback((): PoolState => {
    return currentPool === 'normal' ? normalPool : bindPool;
  }, [currentPool, normalPool, bindPool]);

  const setPool = useCallback((updater: (prev: PoolState) => PoolState) => {
    if (currentPool === 'normal') {
      setNormalPool(updater);
    } else {
      setBindPool(updater);
    }
  }, [currentPool]);

  const getAvailableCurrency = useCallback((): number => {
    if (currentPool === 'normal') return normalCurrency;
    if (bindOnlyMode) return bindCurrency + normalCurrency;
    return bindCurrency;
  }, [currentPool, bindOnlyMode, normalCurrency, bindCurrency]);

  const consumeCurrency = useCallback((count: number): boolean => {
    if (currentPool === 'normal') {
      if (normalCurrency < count) return false;
      setNormalCurrency(prev => prev - count);
      return true;
    }
    if (bindOnlyMode) {
      const total = bindCurrency + normalCurrency;
      if (total < count) return false;
      const fromBind = Math.min(bindCurrency, count);
      setBindCurrency(prev => prev - fromBind);
      setNormalCurrency(prev => prev - (count - fromBind));
      return true;
    }
    if (bindCurrency < count) return false;
    setBindCurrency(prev => prev - count);
    return true;
  }, [currentPool, bindOnlyMode, normalCurrency, bindCurrency]);

  const calcLegendaryProb = useCallback((pityLegendary: number): number => {
    let prob = LEGENDARY_PROB_BASE;
    const totalSteps = hardPityLimit - 1 - softPityStart;
    if (pityLegendary >= softPityStart && totalSteps > 0) {
      const steps = pityLegendary - softPityStart;
      const progress = Math.min(1, steps / totalSteps);
      prob = LEGENDARY_PROB_BASE + (0.999 - LEGENDARY_PROB_BASE) * progress * progress;
    }
    if (pityLegendary >= hardPityLimit - 1) prob = 1;
    return prob;
  }, [hardPityLimit, softPityStart]);

  const rollRarity = useCallback((pity: PoolState, forceLegendary: boolean): 'legendary' | 'epic' | 'common' => {
    if (forceLegendary) return 'legendary';
    let prob = LEGENDARY_PROB_BASE;
    const totalSteps = hardPityLimit - 1 - softPityStart;
    if (pity.legendaryPity >= softPityStart && totalSteps > 0) {
      const steps = pity.legendaryPity - softPityStart;
      const progress = Math.min(1, steps / totalSteps);
      prob = LEGENDARY_PROB_BASE + (0.999 - LEGENDARY_PROB_BASE) * progress * progress;
    }
    const r = Math.random();
    let rarity: 'legendary' | 'epic' | 'common';
    if (r < prob) rarity = 'legendary';
    else if (r < prob + EPIC_PROB) rarity = 'epic';
    else rarity = 'common';
    if (pity.legendaryPity >= hardPityLimit - 1 && rarity !== 'legendary') rarity = 'legendary';
    if (pity.epicPity >= 9 && rarity === 'common') rarity = 'epic';
    return rarity;
  }, [hardPityLimit, softPityStart]);

  const pickLegendaryNormal = useCallback(() => {
    return LEGENDARY_ITEMS[Math.floor(Math.random() * LEGENDARY_ITEMS.length)];
  }, []);

  const processSingleDraw = useCallback((forceLegendary: boolean): DrawRecord => {
    const seq = drawSequence + 1;
    setDrawSequence(seq);
    const pool = getPool();
    const rarity = rollRarity(pool, forceLegendary);
    const legendaryPityBefore = pool.legendaryPity;
    let itemName = '';
    let isLegendary = false;
    let isEpic = false;
    let isDecomposed = false;
    let ruyiTriggered = false;
    let convertedToBayin = false;
    let isLegendaryItem = false;
    if (rarity === 'legendary') {
      isLegendary = true;
      if (pool.ruyi >= 100) {
        itemName = '玄骨在渊';
        ruyiTriggered = true;
        setOwnedLegendary(prev => {
          if ((prev['玄骨在渊'] ?? 0) >= 1) {
            setBayinQiao(b => b + 2);
            convertedToBayin = true;
            isDecomposed = true;
            return prev;
          }
          return { ...prev, '玄骨在渊': (prev['玄骨在渊'] ?? 0) + 1 };
        });
        setPool(p => ({ ...p, legendaryPity: 0, epicPity: p.epicPity + 1, ruyi: 0 }));
        isLegendaryItem = true;
      } else {
        const item = pickLegendaryNormal();
        itemName = item.name;
        if (item.isCurrency) {
          setBayinQiao(b => b + item.amount);
          setPool(p => ({ ...p, legendaryPity: 0, epicPity: p.epicPity + 1, ruyi: p.legendaryPity >= 130 ? p.ruyi + 20 : p.ruyi }));
          isLegendaryItem = true;
        } else {
          setOwnedLegendary(prev => {
            if ((prev[item.name] ?? 0) >= 1) {
              setBayinQiao(b => b + 2);
              convertedToBayin = true;
              isDecomposed = true;
              return prev;
            }
            return { ...prev, [item.name]: (prev[item.name] ?? 0) + 1 };
          });
          setPool(p => ({ ...p, legendaryPity: 0, epicPity: p.epicPity + 1, ruyi: 0 }));
          isLegendaryItem = true;
        }
      }
    } else if (rarity === 'epic') {
      isEpic = true;
      itemName = EPIC_ITEMS[Math.floor(Math.random() * EPIC_ITEMS.length)];
      setOwnedEpic(prev => {
        if ((prev[itemName] ?? 0) >= 1) {
          setQianYuan(q => q + 1);
          isDecomposed = true;
          return prev;
        }
        return { ...prev, [itemName]: (prev[itemName] ?? 0) + 1 };
      });
      setPool(p => ({ ...p, legendaryPity: p.legendaryPity + 1, epicPity: 0, lastBayinPity: p.lastBayinPity + 1 }));
    } else {
      itemName = COMMON_ITEMS[Math.floor(Math.random() * COMMON_ITEMS.length)];
      setPool(p => ({ ...p, legendaryPity: p.legendaryPity + 1, epicPity: p.epicPity + 1, lastBayinPity: p.lastBayinPity + 1 }));
    }
    if (isLegendaryItem) {
      setPool(p => ({ ...p, bayinCount: p.bayinCount + 1, lastBayinPity: 0 }));
    }
    setTianJing(t => t + 3);
    setEventDrawCount(e => e + 1);
    setTotalHistoryDraws(t => t + 1);
    const record: DrawRecord = {
      sequence: seq,
      itemName,
      rarity,
      isLegendary,
      isEpic,
      isDecomposed,
      isBind: currentPool === 'bind' || bindOnlyMode,
      ruyiTriggered,
      convertedToBayin,
      isLegendaryItem,
      legendaryPityBefore,
    };
    if (isLegendaryItem) {
      setDrawHistory(prev => {
        const next = [record, ...prev];
        return next.length > 300 ? next.slice(0, 300) : next;
      });
    }
    return record;
  }, [drawSequence, getPool, rollRarity, setPool, currentPool, bindOnlyMode, pickLegendaryNormal]);

  // ---- 赠礼检查 ----
  const checkGiftMilestones = useCallback((drawCount: number) => {
    GIFT_MILESTONES.forEach(ms => {
      if (drawCount >= ms && !giftClaimed[ms]) {
        setGiftClaimed(prev => ({ ...prev, [ms]: true }));
        setTianJing(t => t + (GIFT_TIANJING[ms] ?? 0));
        toast(`🎁 赠礼！累计${ms}次 → 天精+${GIFT_TIANJING[ms]}`);
      }
    });
  }, [giftClaimed]);

  // ---- 抽卡 ----
  const doDraw = useCallback((count: number) => {
    if (isAutoDrawingRef.current) return;
    if (getAvailableCurrency() < count) {
      toast.error('袅袅之音不足');
      return;
    }
    if (!consumeCurrency(count)) return;
    let forceFlags = new Array(count).fill(false);
    if (drawMode === 'shuang10') {
      forceFlags.fill(true);
    } else if (drawMode === 'shuang5') {
      if (count === 10) {
        const flags = [true, true, true, true, true, false, false, false, false, false];
        forceFlags = shuffle(flags);
      } else {
        forceFlags.fill(true);
      }
    }
    let newEventCount = eventDrawCount;
    for (let i = 0; i < count; i++) {
      const record = processSingleDraw(forceFlags[i]);
      if (record.isLegendaryItem) newEventCount++;
    }
    setEventDrawCount(newEventCount);
    checkGiftMilestones(newEventCount);
  }, [getAvailableCurrency, consumeCurrency, drawMode, processSingleDraw, eventDrawCount, checkGiftMilestones]);

  // ---- 设置剩余次数 ----
  const setRemainingPity = useCallback(() => {
    const remaining = parseInt(remainingInput) || 0;
    if (remaining <= 0 || remaining > hardPityLimit) {
      toast.error(`剩余次数需在1~${hardPityLimit}之间`);
      return;
    }
    const pityValue = hardPityLimit - remaining;
    setPool(p => ({ ...p, legendaryPity: Math.max(0, pityValue) }));
    setAutoResult('');
    toast(`已设置：剩余${remaining}次，当前保底计数${pityValue}`);
  }, [remainingInput, hardPityLimit, setPool]);

  // ---- 自动抽卡至出绝世 ----
  const autoDrawUntilLegendary = useCallback(() => {
    if (isAutoDrawingRef.current) return;
    const avail = currentPool === 'normal' ? normalCurrency : (bindOnlyMode ? bindCurrency + normalCurrency : bindCurrency);
    if (avail < 1) {
      toast.error('袅袅之音不足，无法模拟');
      return;
    }
    isAutoDrawingRef.current = true;
    setIsAutoDrawing(true);
    setAutoResult('');
    const startPity = getPool().legendaryPity;
    let draws = 0;
    const maxDraws = hardPityLimit - startPity;
    const step = () => {
      if (draws >= maxDraws) {
        isAutoDrawingRef.current = false;
        setIsAutoDrawing(false);
        return;
      }
      const pool = currentPoolRef.current;
      const bm = bindOnlyModeRef.current;
      const curAvail = pool === 'normal' ? normalCurrencyRef.current : (bm ? bindCurrencyRef.current + normalCurrencyRef.current : bindCurrencyRef.current);
      if (curAvail < 1) {
        isAutoDrawingRef.current = false;
        setIsAutoDrawing(false);
        toast.error('袅袅之音耗尽！');
        return;
      }
      if (pool === 'normal') {
        if (normalCurrencyRef.current < 1) { isAutoDrawingRef.current = false; setIsAutoDrawing(false); return; }
        setNormalCurrency(p => p - 1);
      } else if (bm) {
        const total = bindCurrencyRef.current + normalCurrencyRef.current;
        if (total < 1) { isAutoDrawingRef.current = false; setIsAutoDrawing(false); return; }
        const fb = Math.min(bindCurrencyRef.current, 1);
        setBindCurrency(p => p - fb);
        setNormalCurrency(p => p - (1 - fb));
      } else {
        if (bindCurrencyRef.current < 1) { isAutoDrawingRef.current = false; setIsAutoDrawing(false); return; }
        setBindCurrency(p => p - 1);
      }
      const record = processSingleDraw(false);
      draws++;
      if (record.isLegendaryItem) {
        setEventDrawCount(prev => { const next = prev + 1; checkGiftMilestones(next); return next; });
        setAutoResult(`✅ 模拟完成！共抽${draws}次，获得${record.itemName}（起始保底${startPity}，第${record.legendaryPityBefore + 1}抽出货）`);
        isAutoDrawingRef.current = false;
        setIsAutoDrawing(false);
        toast(`🎉 出货！${record.itemName}，共抽${draws}次`);
        return;
      }
      if (draws < maxDraws) {
        setTimeout(step, 30);
      } else {
        isAutoDrawingRef.current = false;
        setIsAutoDrawing(false);
      }
    };
    toast('🔄 开始模拟抽卡...');
    step();
  }, [currentPool, bindOnlyMode, normalCurrency, bindCurrency, getPool, hardPityLimit, processSingleDraw, checkGiftMilestones]);

  // ---- 兑换 ----
  const shopExchange = useCallback((item: string, cost: number) => {
    if (bayinQiao < cost) {
      toast.error('普通八音窍不足');
      return;
    }
    setBayinQiao(b => b - cost);
    setOwnedLegendary(prev => {
      if ((prev[item] ?? 0) >= 1) {
        setBayinQiao(b => b + 2);
        toast(`已拥有${item}，自动分解为八音窍+2`);
        return prev;
      }
      toast.success(`兑换成功：${item}`);
      return { ...prev, [item]: (prev[item] ?? 0) + 1 };
    });
  }, [bayinQiao]);

  // ---- 重置 ----
  const resetEvent = useCallback(() => {
    setEventDrawCount(0);
    setGiftClaimed({});
    toast('赠礼已重置');
  }, []);

  const resetAllProgress = useCallback(() => {
    setNormalPool({ legendaryPity: 0, epicPity: 0, ruyi: 0, bayinCount: 0, lastBayinPity: 0 });
    setBindPool({ legendaryPity: 0, epicPity: 0, ruyi: 0, bayinCount: 0, lastBayinPity: 0 });
    setEventDrawCount(0);
    setGiftClaimed({});
    setTotalHistoryDraws(0);
    setDrawSequence(0);
    setBayinQiao(0);
    setBindBayinQiao(0);
    setQianYuan(0);
    setTianJing(0);
    setOwnedEpic(Object.fromEntries(EPIC_ITEMS.map(i => [i, 0])));
    setOwnedLegendary({ '玄骨在渊': 0, '无生蛊': 0 });
    setDrawHistory([]);
    setAutoResult('');
    toast('⚠️ 完全重置（含道具/如意/资源）');
  }, []);

  const clearHistory = useCallback(() => {
    setDrawHistory([]);
  }, []);

  // ---- 派生 ----
  const pool = getPool();
  const currentProb = calcLegendaryProb(pool.legendaryPity);
  const avail = getAvailableCurrency();
  const isShuang = drawMode !== 'normal';
  const legendaryCount = currentPool === 'normal' ? normalPool.bayinCount : bindPool.bayinCount;
  const legendaryPity = currentPool === 'normal' ? normalPool.lastBayinPity : bindPool.lastBayinPity;

  return (
    <div className="space-y-6">
      {/* ===== 资源面板 ===== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Gem className="size-4 text-primary" />
            资源
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 袅袅之音 */}
            <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Music className="size-3" />袅袅之音
              </span>
              <Input
                type="number"
                value={normalCurrency}
                onChange={e => setNormalCurrency(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-8 text-sm font-bold"
                min={0}
              />
            </div>
            {/* 袅袅之音·绑 */}
            <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="size-3" />袅袅之音·绑
              </span>
              <Input
                type="number"
                value={bindCurrency}
                onChange={e => setBindCurrency(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-8 text-sm font-bold"
                min={0}
              />
            </div>
            {/* 八音窍 */}
            <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/50 justify-center">
              <span className="text-xs text-muted-foreground">🔮八音窍</span>
              <span className="text-lg font-bold text-primary">{bayinQiao}</span>
            </div>
            {/* 八音窍·绑 */}
            <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/50 justify-center">
              <span className="text-xs text-muted-foreground">🔒八音窍·绑</span>
              <span className="text-lg font-bold text-primary">{bindBayinQiao}</span>
            </div>
            {/* 乾元 */}
            <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/50 justify-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Coins className="size-3" />乾元
              </span>
              <span className="text-lg font-bold text-amber-400">{qianYuan}</span>
            </div>
            {/* 天精 */}
            <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/50 justify-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-3" />天精
              </span>
              <span className="text-lg font-bold text-cyan-400">{tianJing}</span>
            </div>
          </div>
          {/* 如意值 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/50">
              <span className="text-xs text-muted-foreground">🧧普通池如意</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={normalPool.ruyi}
                  onChange={e => setNormalPool(p => ({ ...p, ruyi: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="h-8 text-sm font-bold w-20"
                  min={0}
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/50">
              <span className="text-xs text-muted-foreground">🧧绑定池如意</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={bindPool.ruyi}
                  onChange={e => setBindPool(p => ({ ...p, ruyi: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="h-8 text-sm font-bold w-20"
                  min={0}
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="destructive" size="sm" onClick={resetAllProgress}>
              <Trash2 className="size-3.5" /> 完全重置
            </Button>
            <Button variant="outline" size="sm" onClick={resetEvent}>
              <RotateCcw className="size-3.5" /> 重置赠礼
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== 抽卡 + 赠礼 双栏 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左栏：抽卡 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Dices className="size-4 text-primary" />
              和鸣抽奖
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 池切换 */}
            <Tabs value={currentPool} onValueChange={v => { setCurrentPool(v as 'normal' | 'bind'); setBindOnlyMode(false); setAutoResult(''); }}>
              <TabsList className="w-full">
                <TabsTrigger value="normal" className="flex-1 gap-1.5">
                  <Music className="size-3.5" />袅袅之音
                </TabsTrigger>
                <TabsTrigger value="bind" className="flex-1 gap-1.5">
                  <Lock className="size-3.5" />袅袅之音·绑
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {/* 模式切换 */}
            <div className="flex gap-1 p-1 rounded-lg bg-muted">
              {([
                { value: 'normal', label: '正常模式', icon: Dice1 },
                { value: 'shuang5', label: '🔥爽抽·5绝世', icon: Flame },
                { value: 'shuang10', label: '🔥爽抽·10绝世', icon: Zap },
              ] as const).map(m => (
                <button
                  key={m.value}
                  onClick={() => { setDrawMode(m.value); setAutoResult(''); }}
                  className={cn(
                    'flex-1 py-2 px-2 text-xs font-semibold rounded-md transition-all',
                    drawMode === m.value
                      ? m.value === 'normal'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground shadow-[0_0_12px_rgba(255_107_107_0.5)]'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <m.icon className="size-3 inline mr-1" />
                  {m.label}
                </button>
              ))}
            </div>
            {/* 池信息 */}
            <div className="text-sm text-muted-foreground">
              当前池：<strong className="text-foreground">
                {currentPool === 'normal' ? '普通' : (bindOnlyMode ? '绑定（仅绑）' : '绑定')}
              </strong>
            </div>
            {/* 绑定池选项 */}
            {currentPool === 'bind' && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="bindOnly"
                  checked={bindOnlyMode}
                  onCheckedChange={v => setBindOnlyMode(!!v)}
                />
                <Label htmlFor="bindOnly" className="text-xs text-muted-foreground cursor-pointer">
                  仅使用绑定（不足用普通抵扣）
                </Label>
              </div>
            )}
            {/* 抽卡按钮 */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => doDraw(1)}
                disabled={avail < 1 || isAutoDrawing}
                className={cn(isShuang && 'bg-accent hover:bg-accent/90 shadow-[0_0_16px_rgba(255_107_107_0.6)] animate-pulse')}
              >
                {isShuang ? <Flame className="size-4 mr-1" /> : null}
                单次
              </Button>
              <Button
                variant="secondary"
                onClick={() => doDraw(10)}
                disabled={avail < 10 || isAutoDrawing}
                className={cn(isShuang && 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-[0_0_16px_rgba(255_107_107_0.6)] animate-pulse')}
              >
                {isShuang ? <Flame className="size-4 mr-1" /> : null}
                十连{isShuang ? (drawMode === 'shuang5' ? '·5绝世' : '·10绝世') : ''}
              </Button>
              <Button
                variant="outline"
                onClick={() => doDraw(50)}
                disabled={avail < 50 || isAutoDrawing}
                className={cn(isShuang && 'border-accent text-accent-foreground shadow-[0_0_16px_rgba(255_107_107_0.6)] animate-pulse')}
              >
                {isShuang ? <Flame className="size-4 mr-1" /> : null}
                50连
              </Button>
            </div>
            {/* 保底进度 */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1"><Star className="size-3 text-primary" />绝世保底（{hardPityLimit}抽必出）</span>
                  <span className="font-bold text-primary">{pool.legendaryPity}/{hardPityLimit}</span>
                </div>
                <Progress value={Math.min(100, (pool.legendaryPity / hardPityLimit) * 100)} className="h-2 [&>div]:bg-primary" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1"><TrendingUp className="size-3 text-purple-400" />非凡保底</span>
                  <span className="font-bold">{pool.epicPity}/10</span>
                  {isShuang && <Badge variant="destructive" className="text-[10px] h-4 px-1">冻结</Badge>}
                </div>
                <Progress value={(pool.epicPity / 10) * 100} className="h-2 [&>div]:bg-purple-500" />
              </div>
            </div>
            {/* 如意值 */}
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1">🧧如意值</span>
                <span className="font-bold text-amber-400">{pool.ruyi}%</span>
              </div>
              <Progress value={Math.min(100, pool.ruyi)} className="h-2 [&>div]:bg-amber-500" />
              <p className="text-[11px] text-muted-foreground mt-1">
                {pool.ruyi >= 100
                  ? <span className="text-amber-400 font-semibold">✨ 如意权益激活！下次绝世必得玄骨在渊</span>
                  : `累计${pool.legendaryPity}次，≥130次出八音窍加如意`}
              </p>
            </div>
            {/* 八音窍追踪 */}
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card/50 text-sm flex-wrap">
              <div>🔮 绝世等效获取：<span className="font-bold text-primary">{legendaryCount}</span> 次</div>
              <div>| 上次后已抽 <span className="font-bold">{legendaryPity}</span> 次</div>
            </div>
            {/* 自定义参数（仅正常模式） */}
            {drawMode === 'normal' && (
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-dashed border-primary/40 bg-card/50 text-xs">
                <Label className="text-muted-foreground whitespace-nowrap">硬保底:</Label>
                <Input
                  type="number"
                  value={hardPityLimit}
                  onChange={e => {
                    const v = Math.max(2, parseInt(e.target.value) || 150);
                    setHardPityLimit(v);
                    setSoftPityStart(s => Math.min(s, v - 1));
                  }}
                  className="h-7 w-16 text-xs"
                  min={2}
                />
                <Label className="text-muted-foreground whitespace-nowrap">递增起:</Label>
                <Input
                  type="number"
                  value={softPityStart}
                  onChange={e => {
                    const v = Math.max(1, Math.min(parseInt(e.target.value) || 110, hardPityLimit - 1));
                    setSoftPityStart(v);
                  }}
                  className="h-7 w-16 text-xs"
                  min={1}
                />
                <span className="text-muted-foreground">当前概率:</span>
                <span className="font-bold text-primary">{(currentProb * 100).toFixed(2)}%</span>
              </div>
            )}
            {/* 剩余次数模拟 */}
            {drawMode === 'normal' && (
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-cyan-500/40 bg-cyan-500/5 text-xs">
                <Label className="text-muted-foreground whitespace-nowrap">🎯剩余次数:</Label>
                <Input
                  type="number"
                  value={remainingInput}
                  onChange={e => setRemainingInput(e.target.value)}
                  placeholder="如60"
                  className="h-7 w-20 text-xs"
                  min={1}
                />
                <Button size="sm" variant="secondary" onClick={setRemainingPity} className="h-7 text-xs">
                  设置
                </Button>
                <Button
                  size="sm"
                  onClick={autoDrawUntilLegendary}
                  disabled={isAutoDrawing}
                  className="h-7 text-xs bg-cyan-600 hover:bg-cyan-700 text-white w-full mt-1 sm:mt-0 sm:w-auto"
                >
                  <Clock className="size-3 mr-1" />
                  模拟至出绝世
                </Button>
                {autoResult && (
                  <div className="w-full mt-2 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                    {autoResult}
                  </div>
                )}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              ※ 基础绝世0.60%｜剩余次数=硬保底-已抽次数｜填入后自动设置当前池保底计数
            </p>
          </CardContent>
        </Card>
        {/* 右栏：赠礼 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="size-4 text-primary" />
              和鸣赠礼（天精）
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              活动累计：<span className="font-bold text-primary text-lg">{eventDrawCount}</span> 次
            </div>
            <Separator />
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-2">
                {GIFT_MILESTONES.map(ms => {
                  const claimed = giftClaimed[ms];
                  const reached = eventDrawCount >= ms;
                  return (
                    <div
                      key={ms}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-lg border text-xs',
                        claimed
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : reached
                            ? 'border-amber-500/30 bg-amber-500/5'
                            : 'border-border bg-card/50'
                      )}
                    >
                      <span>累计{ms}次</span>
                      <span className="text-cyan-400">天精+{GIFT_TIANJING[ms]}</span>
                      <Badge variant={claimed ? 'default' : reached ? 'secondary' : 'outline'} className="text-[10px] h-5">
                        {claimed ? '✅已领' : reached ? '🎁可领' : '🔒'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ===== 八音窍兑换 ===== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingCart className="size-4 text-primary" />
            八音窍兑换（消耗普通八音窍，重复自动分解）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: '玄骨在渊', cost: 2, icon: '🦴' },
            { name: '无生蛊', cost: 2, icon: '🐛' },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <span className="text-sm">{item.icon} {item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{item.cost}八音窍</span>
                <Button size="sm" variant="secondary" onClick={() => shopExchange(item.name, item.cost)}>
                  兑换
                </Button>
              </div>
            </div>
          ))}
          <div className="text-xs text-muted-foreground">
            历史抽数：<span className="font-bold">{totalHistoryDraws}</span>
          </div>
        </CardContent>
      </Card>

      {/* ===== 绝世记录 ===== */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              绝世记录（最多300条）
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 className="size-3.5" /> 清空
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {drawHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-12">
                <Sparkles className="size-4 mr-2" /> 暂无绝世记录
              </div>
            ) : (
              <div className="space-y-1.5 pr-2">
                {drawHistory.map((r, i) => (
                  <motion.div
                    key={`${r.sequence}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg border text-xs',
                      r.isLegendary
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-card/50'
                    )}
                  >
                    <Badge
                      variant={r.ruyiTriggered ? 'default' : 'secondary'}
                      className={cn('text-[10px] h-5 shrink-0', r.ruyiTriggered && 'bg-amber-500')}
                    >
                      {r.ruyiTriggered ? '如意' : '绝世'}
                    </Badge>
                    <span className="truncate flex-1 min-w-0">
                      第{r.sequence}抽：抽到 {r.itemName}（累计{r.legendaryPityBefore}抽）
                    </span>
                    {r.isBind && <span className="text-red-400 shrink-0">[绑]</span>}
                    {r.convertedToBayin && <span className="text-amber-400 shrink-0">→八音窍+2</span>}
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
