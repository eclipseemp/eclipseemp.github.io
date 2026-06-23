import { useState, useMemo } from 'react';
import {
  Swords, User, BarChart3, Sparkles, Shield, List, Package,
  Play, Heart, ClipboardList, Plus, ChevronDown, ChevronUp,
  Target, Zap, TrendingUp, Crosshair, Users, Flame, Snowflake,
  CloudLightning, Wind, Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SCHOOLS,
  WU_KU_LIST,
  DPS_REFERENCE,
  HEART_METHOD_SLOTS,
  WEAR_SLOTS,
  EQUIPMENT_POOL,
  EQUIPMENT_SETS,
  getHeartMethodsBySchool,
  getEquipmentsBySlot,
  sortEquipmentsByQuality,
  DEFAULT_CHARACTER_STATS,
  getBaseStatsBySchool,
} from '@/data/damage-calc';
import type { IEquipment, IHeartMethod, IWearSummary, EquipmentSlot } from '@/types/damage-calc';

// ========== 类型定义 ==========
interface ICharacter {
  id: string;
  name: string;
  schoolId: string;
}

interface IAttributeStats {
  // 外功攻击
  minExternalAttack: number;
  maxExternalAttack: number;
  externalMultiplier: number;
  externalBonusPercent: number;
  // 伤害倍率与固伤
  elementalMultiplier: number;
  elementalBonusPercent: number;
  fixedDamage: number;
  // 精准率
  accuracyRate: number;
  // 判定抗性
  resistance: number;
  // 会心系统
  critRate: number;
  directCritRate: number;
  critDamageBonus: number;
  // 会意系统
  masteryRate: number;
  directMasteryRate: number;
  masteryDamageBonus: number;
  // 穿透系统
  externalPenetration: number;
  elementalPenetration: number;
  // 增伤乘区
  externalDamageBonus: number;
  elementalDamageBonus: number;
  allMartialBonus: number;
  bossBonus: number;
  singleSkillBonus: number;
  aoeSkillBonus: number;
  dingyinBonus: number;
  fixedDamageBonus: number;
  generalBonus: number;
  playerBonus: number;
  // 属攻系统
  minWuxiangAttack: number;
  maxWuxiangAttack: number;
  minQiansiAttack: number;
  maxQiansiAttack: number;
  minPozhuAttack: number;
  maxPozhuAttack: number;
  minMingjinAttack: number;
  maxMingjinAttack: number;
  minLieshiAttack: number;
  maxLieshiAttack: number;
}

interface IWearSlot {
  key: string;
  label: string;
  slotType: EquipmentSlot | 'weapon';
  equipmentId: string | null;
}

const DEFAULT_CHARACTERS: ICharacter[] = [
  { id: 'char-1', name: '默认角色', schoolId: '' },
];

const DEFAULT_STATS: IAttributeStats = {
  minExternalAttack: 10000,
  maxExternalAttack: 12000,
  externalMultiplier: 1,
  externalBonusPercent: 0,
  elementalMultiplier: 1,
  elementalBonusPercent: 0,
  fixedDamage: 0,
  accuracyRate: 100,
  resistance: 0,
  critRate: 25,
  directCritRate: 15,
  critDamageBonus: 54,
  masteryRate: 15,
  directMasteryRate: 10,
  masteryDamageBonus: 35,
  externalPenetration: 500,
  elementalPenetration: 300,
  externalDamageBonus: 10,
  elementalDamageBonus: 8,
  allMartialBonus: 5,
  bossBonus: 3,
  singleSkillBonus: 5,
  aoeSkillBonus: 3,
  dingyinBonus: 0,
  fixedDamageBonus: 200,
  generalBonus: 5,
  playerBonus: 0,
  minWuxiangAttack: 300,
  maxWuxiangAttack: 500,
  minQiansiAttack: 300,
  maxQiansiAttack: 500,
  minPozhuAttack: 465,
  maxPozhuAttack: 831,
  minMingjinAttack: 300,
  maxMingjinAttack: 500,
  minLieshiAttack: 300,
  maxLieshiAttack: 500,
};

// ========== 子组件 ==========
function StatInput({ label, value, onChange, suffix }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="h-9 text-sm bg-background border-border"
        />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function EquipmentSlotItem({
  slot,
  equipments,
  selectedEquipmentId,
  onSelect,
  disabled,
}: {
  slot: IWearSlot;
  equipments: IEquipment[];
  selectedEquipmentId: string | null;
  onSelect: (equipmentId: string | null) => void;
  disabled?: boolean;
}) {
  const selectedEquipment = equipments.find(e => e.id === selectedEquipmentId);
  const quality = selectedEquipment?.quality;

  const qualityClass = quality === 'gold'
    ? 'border-amber-500/50 ring-1 ring-amber-500/30'
    : quality === 'purple'
    ? 'border-purple-500/50 ring-1 ring-purple-500/30'
    : '';

  const qualityTextClass = quality === 'gold'
    ? 'text-amber-400'
    : quality === 'purple'
    ? 'text-purple-400'
    : quality === 'blue'
    ? 'text-blue-400'
    : '';

  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{slot.label}</Label>
      <Select
        disabled={disabled}
        value={selectedEquipmentId || ''}
        onValueChange={(v) => onSelect(v || null)}
      >
        <SelectTrigger className={`h-10 bg-background border-border ${qualityClass}`}>
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent>
          {equipments.length === 0 ? (
            <SelectItem value="none" disabled>暂无装备</SelectItem>
          ) : (
            equipments.map(equip => (
              <SelectItem key={equip.id} value={equip.id}>
                <span className={
                  equip.quality === 'gold' ? 'text-amber-400' :
                  equip.quality === 'purple' ? 'text-purple-400' :
                  'text-blue-400'
                }>
                  {equip.name}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {equip.level}级
                </span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// ========== 主组件 ==========
export default function DamageCalcSection() {
  // 流派选择
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [isBigExternal, setIsBigExternal] = useState(true);

  // 角色管理
  const [characters, setCharacters] = useState<ICharacter[]>(DEFAULT_CHARACTERS);
  const [selectedCharId, setSelectedCharId] = useState<string>('char-1');
  const [showNewChar, setShowNewChar] = useState(false);
  const [newCharName, setNewCharName] = useState('');

  // 属性配置折叠
  const [statsOpen, setStatsOpen] = useState(true);
  const [stats, setStats] = useState<IAttributeStats>(DEFAULT_STATS);

  // 装备仓库折叠
  const [warehouseOpen, setWarehouseOpen] = useState(false);

  // 装备穿戴
  const [wearSlots, setWearSlots] = useState<IWearSlot[]>(
    WEAR_SLOTS.map(slot => ({ ...slot, equipmentId: null }))
  );
  const [selectedSet, setSelectedSet] = useState('');

  // 心法配置
  const [heartMethods, setHeartMethods] = useState<Record<string, string>>({
    slot1: '',
    slot2: '',
    slot3: '',
    slot4: '',
  });

  // 计算当前武库
  const currentWuKu = useMemo(() => {
    if (!selectedSchoolId) return null;
    const school = SCHOOLS.find(s => s.id === selectedSchoolId);
    if (!school) return null;
    return WU_KU_LIST.find(w => w.category === school.category) || WU_KU_LIST[4];
  }, [selectedSchoolId]);

  // 获取当前门派可用心法
  const availableHeartMethods = useMemo(() => {
    if (!selectedSchoolId) return [];
    return getHeartMethodsBySchool(selectedSchoolId);
  }, [selectedSchoolId]);

  // 获取已选择的心法ID列表（用于去重）
  const selectedHeartMethodIds = useMemo(() => {
    return Object.values(heartMethods).filter(Boolean);
  }, [heartMethods]);

  // 获取每个部位的装备列表
  const getEquipmentsForSlot = (slotType: EquipmentSlot | 'weapon') => {
    const equipments = getEquipmentsBySlot(slotType);
    return sortEquipmentsByQuality(equipments);
  };

  // 穿戴属性汇总（真实计算）
  const wearSummary: IWearSummary = useMemo(() => {
    const summary: IWearSummary = {
      minExternalAttack: 0,
      maxExternalAttack: 0,
      critRate: 0,
      critDamage: 0,
      masteryRate: 0,
      masteryDamage: 0,
      externalPenetration: 0,
      elementalPenetration: 0,
      bossBonus: 0,
      allMartialBonus: 0,
      defense: 0,
      maxHealth: 0,
    };

    // 统计套装数量
    const setCounts: Record<string, number> = {};

    // 遍历所有穿戴栏位
    wearSlots.forEach(slot => {
      if (!slot.equipmentId) return;

      const equipment = EQUIPMENT_POOL.find(e => e.id === slot.equipmentId);
      if (!equipment) return;

      // 累加装备属性
      equipment.attributes.forEach(attr => {
        switch (attr.key) {
          case 'minExternalAttack':
            summary.minExternalAttack += attr.value;
            break;
          case 'maxExternalAttack':
            summary.maxExternalAttack += attr.value;
            break;
          case 'critRate':
            summary.critRate += attr.value;
            break;
          case 'critDamage':
            summary.critDamage += attr.value;
            break;
          case 'masteryRate':
            summary.masteryRate += attr.value;
            break;
          case 'masteryDamage':
            summary.masteryDamage += attr.value;
            break;
          case 'externalPenetration':
            summary.externalPenetration += attr.value;
            break;
          case 'elementalPenetration':
            summary.elementalPenetration += attr.value;
            break;
          case 'bossBonus':
            summary.bossBonus += attr.value;
            break;
          case 'allMartialBonus':
            summary.allMartialBonus += attr.value;
            break;
          case 'defense':
            summary.defense += attr.value;
            break;
          case 'maxHealth':
            summary.maxHealth += attr.value;
            break;
        }
      });

      // 统计套装
      if (equipment.setName) {
        setCounts[equipment.setName] = (setCounts[equipment.setName] || 0) + 1;
      }
    });

    return summary;
  }, [wearSlots]);

  // 处理装备选择
  const handleEquipmentSelect = (slotKey: string, equipmentId: string | null) => {
    setWearSlots(prev =>
      prev.map(slot =>
        slot.key === slotKey ? { ...slot, equipmentId } : slot
      )
    );
  };

  // 处理心法选择
  const handleHeartMethodSelect = (slotKey: string, methodId: string) => {
    setHeartMethods(prev => ({
      ...prev,
      [slotKey]: methodId,
    }));
  };

  // 一键填入基础属性
  const handleFillBaseStats = () => {
    setStats(prev => ({
      ...prev,
      minExternalAttack: prev.minExternalAttack + wearSummary.minExternalAttack,
      maxExternalAttack: prev.maxExternalAttack + wearSummary.maxExternalAttack,
      critRate: prev.critRate + wearSummary.critRate,
      critDamageBonus: prev.critDamageBonus + wearSummary.critDamage,
      masteryRate: prev.masteryRate + wearSummary.masteryRate,
      masteryDamageBonus: prev.masteryDamageBonus + wearSummary.masteryDamage,
      externalPenetration: prev.externalPenetration + wearSummary.externalPenetration,
      elementalPenetration: prev.elementalPenetration + wearSummary.elementalPenetration,
      bossBonus: prev.bossBonus + wearSummary.bossBonus,
      allMartialBonus: prev.allMartialBonus + wearSummary.allMartialBonus,
    }));
  };

  // 更新属性
  function updateStat<K extends keyof IAttributeStats>(key: K, value: number) {
    setStats(prev => ({ ...prev, [key]: value }));
  }

  // 选择流派
  function handleSchoolSelect(schoolId: string) {
    setSelectedSchoolId(schoolId);
    // 重置心法
    setHeartMethods({ slot1: '', slot2: '', slot3: '', slot4: '' });
  }

  // 新建角色
  function handleAddCharacter() {
    if (!newCharName.trim()) return;
    const newChar: ICharacter = {
      id: `char-${Date.now()}`,
      name: newCharName.trim(),
      schoolId: selectedSchoolId,
    };
    setCharacters(prev => [...prev, newChar]);
    setSelectedCharId(newChar.id);
    setNewCharName('');
    setShowNewChar(false);
  }

  // 获取当前角色
  const currentCharacter = characters.find(c => c.id === selectedCharId);

  return (
    <div className="space-y-6">
      {/* ===== 第一行：三个卡片 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 左卡片：流派选择 */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Swords className="size-4 text-primary" />
                流派选择
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <ClipboardList className="size-3.5 mr-1" />
                方案
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 流派选择 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">流派：</Label>
                <Select value={selectedSchoolId} onValueChange={handleSchoolSelect}>
                  <SelectTrigger className="h-9 bg-background border-border">
                    <SelectValue placeholder="请选择流派" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOLS.map(school => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name} · {school.style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <span className={`text-xs ${!isBigExternal ? 'text-primary' : 'text-muted-foreground'}`}>小外</span>
                <Switch
                  checked={isBigExternal}
                  onCheckedChange={setIsBigExternal}
                  className="data-[state=checked]:bg-primary"
                />
                <span className={`text-xs ${isBigExternal ? 'text-primary' : 'text-muted-foreground'}`}>大外</span>
              </div>
            </div>

            {/* 武库 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">武库：</Label>
                <Select disabled={!selectedSchoolId} value={currentWuKu?.id || ''}>
                  <SelectTrigger className="h-9 bg-background border-border">
                    <SelectValue placeholder="无" />
                  </SelectTrigger>
                  <SelectContent>
                    {WU_KU_LIST.map(wk => (
                      <SelectItem key={wk.id} value={wk.id}>{wk.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-5">
                {currentWuKu ? (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    +{currentWuKu.minBonus} ~ +{currentWuKu.maxBonus}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    +0 ~ +0
                  </Badge>
                )}
              </div>
            </div>

            {/* 心法配置 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Heart className="size-3.5 text-red-400" />
                <span className="text-xs font-medium">心法配置</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {HEART_METHOD_SLOTS.map(slot => {
                  const currentValue = heartMethods[slot.key as keyof typeof heartMethods];
                  // 过滤已选择的心法（除了当前选中的）
                  const filteredMethods = availableHeartMethods.filter(
                    m => !selectedHeartMethodIds.includes(m.id) || m.id === currentValue
                  );

                  return (
                    <div key={slot.key} className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">{slot.label}</Label>
                      <Select
                        disabled={!selectedSchoolId}
                        value={currentValue}
                        onValueChange={(v) => handleHeartMethodSelect(slot.key, v)}
                      >
                        <SelectTrigger className="h-8 bg-background border-border">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredMethods.length === 0 ? (
                            <SelectItem value="none" disabled>暂无可选心法</SelectItem>
                          ) : (
                            filteredMethods.map(method => (
                              <SelectItem key={method.id} value={method.id}>
                                <span className={
                                  method.quality === 'gold' ? 'text-amber-400' :
                                  method.quality === 'purple' ? 'text-purple-400' :
                                  'text-blue-400'
                                }>
                                  {method.name}
                                </span>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 中卡片：角色管理 */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="size-4 text-primary" />
              角色管理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* 角色选择 */}
            <div className="flex items-center gap-2">
              <Select value={selectedCharId} onValueChange={setSelectedCharId}>
                <SelectTrigger className="h-9 bg-background border-border flex-1">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {characters.map(char => (
                    <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => setShowNewChar(!showNewChar)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {/* 新建角色输入 */}
            {showNewChar && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="输入角色名称"
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCharacter()}
                />
                <Button size="sm" className="h-8" onClick={handleAddCharacter}>
                  创建
                </Button>
              </div>
            )}

            {/* 当前角色信息 */}
            <div className="rounded-lg border border-border bg-card/50 p-3 min-h-[120px]">
              {currentCharacter ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                      <User className="size-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{currentCharacter.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {currentCharacter.schoolId
                          ? SCHOOLS.find(s => s.id === currentCharacter.schoolId)?.name || '未知流派'
                          : '未选择流派'}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    角色属性配置区域
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-8">
                  请选择角色
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 右卡片：DPS参考 */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              DPS参考
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {DPS_REFERENCE.map(item => (
              <div
                key={item.name}
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-bold text-primary tabular-nums">
                  {item.dps}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ===== 未选择流派时的提示 ===== */}
      {!selectedSchoolId && (
        <Card className="border-border">
          <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
            <Swords className="size-12 mb-3 opacity-30" />
            <p className="text-sm">请先选择流派</p>
          </CardContent>
        </Card>
      )}

      {/* ===== 第二行：属性配置（选择流派后显示） ===== */}
      {selectedSchoolId && (
        <Collapsible open={statsOpen} onOpenChange={setStatsOpen}>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    属性配置
                  </CardTitle>
                  {statsOpen ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                {/* 外功攻击 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">外功攻击</Label>
                  <div className="grid grid-cols-4 gap-3">
                    <StatInput
                      label="最小外功攻击"
                      value={stats.minExternalAttack}
                      onChange={(v) => updateStat('minExternalAttack', v)}
                    />
                    <StatInput
                      label="最大外功攻击"
                      value={stats.maxExternalAttack}
                      onChange={(v) => updateStat('maxExternalAttack', v)}
                    />
                    <StatInput
                      label="外功倍率"
                      value={stats.externalMultiplier}
                      onChange={(v) => updateStat('externalMultiplier', v)}
                    />
                    <StatInput
                      label="外功加成%"
                      value={stats.externalBonusPercent}
                      onChange={(v) => updateStat('externalBonusPercent', v)}
                      suffix="%"
                    />
                  </div>
                </div>

                <Separator />

                {/* 伤害倍率与固伤 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">伤害倍率与固伤</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <StatInput
                      label="属攻倍率"
                      value={stats.elementalMultiplier}
                      onChange={(v) => updateStat('elementalMultiplier', v)}
                    />
                    <StatInput
                      label="属攻加成%"
                      value={stats.elementalBonusPercent}
                      onChange={(v) => updateStat('elementalBonusPercent', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="固伤"
                      value={stats.fixedDamage}
                      onChange={(v) => updateStat('fixedDamage', v)}
                    />
                  </div>
                </div>

                <Separator />

                {/* 精准率 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">精准率(%)</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <StatInput
                      label="精准率"
                      value={stats.accuracyRate}
                      onChange={(v) => updateStat('accuracyRate', v)}
                      suffix="%"
                    />
                  </div>
                </div>

                <Separator />

                {/* 判定抗性 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">判定抗性(%)</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <StatInput
                      label="判定抗性"
                      value={stats.resistance}
                      onChange={(v) => updateStat('resistance', v)}
                      suffix="%"
                    />
                  </div>
                </div>

                <Separator />

                {/* 会心系统 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Target className="size-3" />
                    会心系统
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <StatInput
                      label="会心率%"
                      value={stats.critRate}
                      onChange={(v) => updateStat('critRate', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="直接会心率%"
                      value={stats.directCritRate}
                      onChange={(v) => updateStat('directCritRate', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="会心伤害加成%"
                      value={stats.critDamageBonus}
                      onChange={(v) => updateStat('critDamageBonus', v)}
                      suffix="%"
                    />
                  </div>
                </div>

                <Separator />

                {/* 会意系统 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    会意系统
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <StatInput
                      label="会意率%"
                      value={stats.masteryRate}
                      onChange={(v) => updateStat('masteryRate', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="直接会意率%"
                      value={stats.directMasteryRate}
                      onChange={(v) => updateStat('directMasteryRate', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="会意伤害加成%"
                      value={stats.masteryDamageBonus}
                      onChange={(v) => updateStat('masteryDamageBonus', v)}
                      suffix="%"
                    />
                  </div>
                </div>

                <Separator />

                {/* 穿透系统 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Zap className="size-3" />
                    穿透系统
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <StatInput
                      label="外功穿透"
                      value={stats.externalPenetration}
                      onChange={(v) => updateStat('externalPenetration', v)}
                    />
                    <StatInput
                      label="属攻穿透"
                      value={stats.elementalPenetration}
                      onChange={(v) => updateStat('elementalPenetration', v)}
                    />
                  </div>
                </div>

                <Separator />

                {/* 增伤乘区 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Sparkles className="size-3" />
                    增伤乘区
                  </Label>
                  <div className="grid grid-cols-5 gap-3">
                    <StatInput
                      label="外伤加成%"
                      value={stats.externalDamageBonus}
                      onChange={(v) => updateStat('externalDamageBonus', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="属伤加成%"
                      value={stats.elementalDamageBonus}
                      onChange={(v) => updateStat('elementalDamageBonus', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="全部武学增伤%"
                      value={stats.allMartialBonus}
                      onChange={(v) => updateStat('allMartialBonus', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="首领增伤%"
                      value={stats.bossBonus}
                      onChange={(v) => updateStat('bossBonus', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="单体奇术增伤%"
                      value={stats.singleSkillBonus}
                      onChange={(v) => updateStat('singleSkillBonus', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="群体奇术增伤%"
                      value={stats.aoeSkillBonus}
                      onChange={(v) => updateStat('aoeSkillBonus', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="指定武学技定音%"
                      value={stats.dingyinBonus}
                      onChange={(v) => updateStat('dingyinBonus', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="固伤加成"
                      value={stats.fixedDamageBonus}
                      onChange={(v) => updateStat('fixedDamageBonus', v)}
                    />
                    <StatInput
                      label="通用增伤%"
                      value={stats.generalBonus}
                      onChange={(v) => updateStat('generalBonus', v)}
                      suffix="%"
                    />
                    <StatInput
                      label="对玩家单位增效%"
                      value={stats.playerBonus}
                      onChange={(v) => updateStat('playerBonus', v)}
                      suffix="%"
                    />
                  </div>
                </div>

                <Separator />

                {/* 属攻系统 */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Flame className="size-3" />
                    属攻系统
                  </Label>
                  <div className="grid grid-cols-5 gap-3">
                    <StatInput
                      label="无相-最小"
                      value={stats.minWuxiangAttack}
                      onChange={(v) => updateStat('minWuxiangAttack', v)}
                    />
                    <StatInput
                      label="无相-最大"
                      value={stats.maxWuxiangAttack}
                      onChange={(v) => updateStat('maxWuxiangAttack', v)}
                    />
                    <StatInput
                      label="牵丝-最小"
                      value={stats.minQiansiAttack}
                      onChange={(v) => updateStat('minQiansiAttack', v)}
                    />
                    <StatInput
                      label="牵丝-最大"
                      value={stats.maxQiansiAttack}
                      onChange={(v) => updateStat('maxQiansiAttack', v)}
                    />
                    <StatInput
                      label="破竹-最小"
                      value={stats.minPozhuAttack}
                      onChange={(v) => updateStat('minPozhuAttack', v)}
                    />
                    <StatInput
                      label="破竹-最大"
                      value={stats.maxPozhuAttack}
                      onChange={(v) => updateStat('maxPozhuAttack', v)}
                    />
                    <StatInput
                      label="鸣金-最小"
                      value={stats.minMingjinAttack}
                      onChange={(v) => updateStat('minMingjinAttack', v)}
                    />
                    <StatInput
                      label="鸣金-最大"
                      value={stats.maxMingjinAttack}
                      onChange={(v) => updateStat('maxMingjinAttack', v)}
                    />
                    <StatInput
                      label="裂石-最小"
                      value={stats.minLieshiAttack}
                      onChange={(v) => updateStat('minLieshiAttack', v)}
                    />
                    <StatInput
                      label="裂石-最大"
                      value={stats.maxLieshiAttack}
                      onChange={(v) => updateStat('maxLieshiAttack', v)}
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* ===== 第三行：装备区域 ===== */}
      {selectedSchoolId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 装备穿戴栏 */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                装备穿戴栏
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {wearSlots.map(slot => (
                  <EquipmentSlotItem
                    key={slot.key}
                    slot={slot}
                    equipments={getEquipmentsForSlot(slot.slotType)}
                    selectedEquipmentId={slot.equipmentId}
                    onSelect={(equipId) => handleEquipmentSelect(slot.key, equipId)}
                    disabled={!selectedSchoolId}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 穿戴属性汇总 */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <List className="size-4 text-primary" />
                穿戴属性汇总
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 套装选择 */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">套装</Label>
                <Select value={selectedSet} onValueChange={setSelectedSet}>
                  <SelectTrigger className="h-9 bg-background border-border">
                    <SelectValue placeholder="选择套装" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_SETS.map(set => (
                      <SelectItem key={set.id} value={set.id}>{set.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* 属性列表 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">最小外功</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.minExternalAttack}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">最大外功</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.maxExternalAttack}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">会心率</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.critRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">会心伤害</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.critDamage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">会意率</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.masteryRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">会意伤害</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.masteryDamage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">外功穿透</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.externalPenetration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">属攻穿透</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.elementalPenetration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">首领增伤</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.bossBonus}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">全部武学增效</span>
                  <span className="text-sm font-medium text-primary tabular-nums">
                    +{wearSummary.allMartialBonus}%
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-2"
                size="sm"
                onClick={handleFillBaseStats}
              >
                一键填入基础属性
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== 第四行：装备仓库 ===== */}
      <Collapsible open={warehouseOpen} onOpenChange={setWarehouseOpen}>
        <Card className="border-border">
          <CardHeader className="py-3">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="size-4 text-primary" />
                  装备仓库
                </CardTitle>
                {warehouseOpen ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {selectedSchoolId ? (
                <div className="text-xs text-muted-foreground py-8 text-center">
                  装备仓库列表（开发中）
                </div>
              ) : (
                <div className="text-xs text-muted-foreground py-8 text-center">
                  请先选择流派以查看对应装备
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* ===== 第五行：伤害演算 ===== */}
      <Card className="border-border">
        <CardContent className="py-8">
          {selectedSchoolId ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings2 className="size-4 text-primary" />
                <span className="text-sm font-medium">技能循环模拟</span>
              </div>
              <div className="text-xs text-muted-foreground text-center py-8">
                伤害演算功能（开发中）
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm">
                  单次模拟 (1,000次)
                </Button>
                <Button size="sm">
                  <Play className="size-3.5 mr-1.5" />
                  执行 10,000 次伤害演算
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Play className="size-10 mb-3 opacity-30" />
              <p className="text-sm">请先选择流派后再进行伤害演算</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
