import { ISchool, IWuKu, IHeartMethod, IEquipment, IEquipmentSet, EquipmentSlot, WeaponType } from '../types/damage-calc';
import { Swords, Circle, Gem, Shield } from 'lucide-react';

// ============================================
// 1. 门派数据（10个门派）
// ============================================
export const SCHOOLS: ISchool[] = [
  {
    id: 'pozhu-yuan',
    name: '破竹鸢',
    category: 'pozhu',
    style: '输出',
    dpsRange: '245-280万',
    description: '外功爆发型，以鸢击长空为核心，瞬间爆发极高，是团队主力输出',
    damageType: 'crit',
    weaponType: 'spear',
  },
  {
    id: 'pozhu-feng',
    name: '破竹风',
    category: 'pozhu',
    style: '输出',
    dpsRange: '220-260万',
    description: '外功持续型，以风刃连击为特点，输出稳定持久',
    damageType: 'crit',
    weaponType: 'dualBlade',
  },
  {
    id: 'pozhu-chen',
    name: '破竹尘',
    category: 'pozhu',
    style: '输出',
    dpsRange: '230-265万',
    description: '外功均衡型，攻守兼备，适应各种战斗场景',
    damageType: 'crit',
    weaponType: 'sword',
  },
  {
    id: 'qiansi-yu',
    name: '牵丝玉',
    category: 'qiansi',
    style: '输出',
    dpsRange: '200-240万',
    description: '内功爆发型，技能连携性强，玉碎连招伤害爆炸',
    damageType: 'crit',
    weaponType: 'fan',
  },
  {
    id: 'qiansi-lin',
    name: '牵丝霖',
    category: 'qiansi',
    style: '治疗',
    dpsRange: '210-250万',
    description: '治疗辅助型，霖雨霏霏持续回血，团队核心治疗',
    damageType: 'mastery',
    weaponType: 'umbrella',
  },
  {
    id: 'qiansi-yi',
    name: '牵丝翊',
    category: 'qiansi',
    style: '辅助',
    dpsRange: '205-245万',
    description: '内功辅助型，提供各种增益buff，提升团队整体输出',
    damageType: 'mastery',
    weaponType: 'rope',
  },
  {
    id: 'lieshi-wei',
    name: '裂石威',
    category: 'lieshi',
    style: '承伤',
    dpsRange: '240-280万',
    description: '外功承伤型，威镇山岳，团队主T，承伤能力极强',
    damageType: 'crit',
    weaponType: 'gauntlet',
  },
  {
    id: 'lieshi-jun',
    name: '裂石钧',
    category: 'lieshi',
    style: '输出',
    dpsRange: '250-290万',
    description: '重型输出型，钧天裂地一击必杀，输出上限最高',
    damageType: 'crit',
    weaponType: 'podao',
  },
  {
    id: 'mingjin-hong',
    name: '鸣金虹',
    category: 'mingjin',
    style: '输出',
    dpsRange: '230-270万',
    description: '内功均衡型，虹光贯日，攻防兼备，会意流派代表',
    damageType: 'mastery',
    weaponType: 'drum',
  },
  {
    id: 'mingjin-ying',
    name: '鸣金影',
    category: 'mingjin',
    style: '输出',
    dpsRange: '225-265万',
    description: '内功爆发型，暗影突袭，影杀连招瞬间爆发',
    damageType: 'mastery',
    weaponType: 'hengdao',
  },
];

// 门派类别映射
export const SCHOOL_CATEGORIES = [
  { key: 'pozhu', name: '破竹' },
  { key: 'qiansi', name: '牵丝' },
  { key: 'lieshi', name: '裂石' },
  { key: 'mingjin', name: '鸣金' },
];

// ============================================
// 2. 武库数据（5种武库）
// ============================================
export const WU_KU_LIST: IWuKu[] = [
  {
    id: 'pozhu',
    name: '破竹武库',
    category: 'pozhu',
    minBonus: 165,
    maxBonus: 331,
    description: '破竹门派专属武库，提升外功攻击与破甲能力',
  },
  {
    id: 'qiansi',
    name: '牵丝武库',
    category: 'qiansi',
    minBonus: 150,
    maxBonus: 300,
    description: '牵丝门派专属武库，提升内功攻击与治疗效果',
  },
  {
    id: 'lieshi',
    name: '裂石武库',
    category: 'lieshi',
    minBonus: 180,
    maxBonus: 360,
    description: '裂石门派专属武库，提升外功攻击与防御能力',
  },
  {
    id: 'mingjin',
    name: '鸣金武库',
    category: 'mingjin',
    minBonus: 160,
    maxBonus: 320,
    description: '鸣金门派专属武库，提升内功攻击与会意效果',
  },
  {
    id: 'universal',
    name: '通用武库',
    category: 'universal',
    minBonus: 100,
    maxBonus: 200,
    description: '全门派通用武库，基础属性加成较低但适应性强',
  },
];

// ============================================
// 3. 心法数据
// ============================================

// 3.1 通用心法（所有门派可用）
export const UNIVERSAL_HEART_METHODS: IHeartMethod[] = [
  // 金色品质
  {
    id: 'um-gold-1',
    name: '金刚不坏',
    quality: 'gold',
    isUniversal: true,
    schoolId: 'universal',
    effect: '外功防御提升15%，受到伤害降低10%，生命值上限提升10%',
  },
  {
    id: 'um-gold-2',
    name: '混元一气',
    quality: 'gold',
    isUniversal: true,
    schoolId: 'universal',
    effect: '全属性提升8%，暴击伤害提升25%，会意伤害提升20%',
  },
  {
    id: 'um-gold-3',
    name: '太玄经',
    quality: 'gold',
    isUniversal: true,
    schoolId: 'universal',
    effect: '攻击力提升12%，技能伤害提升10%，内力恢复速度提升30%',
  },
  {
    id: 'um-gold-4',
    name: '易筋经',
    quality: 'gold',
    isUniversal: true,
    schoolId: 'universal',
    effect: '体质提升20%，防御力提升15%，受到治疗效果提升25%',
  },
  {
    id: 'um-gold-5',
    name: '九阳神功',
    quality: 'gold',
    isUniversal: true,
    schoolId: 'universal',
    effect: '攻击力提升15%，暴击率提升8%，火属性攻击提升20%',
  },
  // 紫色品质
  {
    id: 'um-purple-1',
    name: '铁布衫',
    quality: 'purple',
    isUniversal: true,
    schoolId: 'universal',
    effect: '外功防御提升10%，物理减伤提升5%',
  },
  {
    id: 'um-purple-2',
    name: '金钟罩',
    quality: 'purple',
    isUniversal: true,
    schoolId: 'universal',
    effect: '防御力提升12%，生命值上限提升8%',
  },
  {
    id: 'um-purple-3',
    name: '梯云纵',
    quality: 'purple',
    isUniversal: true,
    schoolId: 'universal',
    effect: '敏捷提升15%，闪避率提升8%，移动速度提升10%',
  },
  {
    id: 'um-purple-4',
    name: '凝神静气',
    quality: 'purple',
    isUniversal: true,
    schoolId: 'universal',
    effect: '命中率提升10%，会意率提升6%，技能命中提升5%',
  },
  {
    id: 'um-purple-5',
    name: '铁骨铮铮',
    quality: 'purple',
    isUniversal: true,
    schoolId: 'universal',
    effect: '体质提升12%，生存能力提升10%，霸体时长提升15%',
  },
  {
    id: 'um-purple-6',
    name: '身轻如燕',
    quality: 'purple',
    isUniversal: true,
    schoolId: 'universal',
    effect: '敏捷提升15%，闪避率提升8%，轻功消耗降低20%',
  },
  // 蓝色品质
  {
    id: 'um-blue-1',
    name: '基础心法',
    quality: 'blue',
    isUniversal: true,
    schoolId: 'universal',
    effect: '外功攻击提升5%，内功攻击提升5%',
  },
  {
    id: 'um-blue-2',
    name: '强身术',
    quality: 'blue',
    isUniversal: true,
    schoolId: 'universal',
    effect: '生命值上限提升8%，体力恢复速度提升15%',
  },
  {
    id: 'um-blue-3',
    name: '吐纳术',
    quality: 'blue',
    isUniversal: true,
    schoolId: 'universal',
    effect: '内力恢复速度提升20%，技能冷却缩短5%',
  },
  {
    id: 'um-blue-4',
    name: '聚气诀',
    quality: 'blue',
    isUniversal: true,
    schoolId: 'universal',
    effect: '攻击力提升4%，暴击率提升3%',
  },
];

// 3.2 门派专属心法
export const SCHOOL_HEART_METHODS: IHeartMethod[] = [
  // ===== 破竹门派 =====
  {
    id: 'pozhu-gold-1',
    name: '破竹·裂空',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'pozhu',
    effect: '破竹属性攻击提升25%，破甲能力提升20%，外功穿透提升15%',
  },
  {
    id: 'pozhu-gold-2',
    name: '破竹·惊雷',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'pozhu',
    effect: '破竹技能伤害提升20%，暴击伤害提升30%，惊雷触发概率提升15%',
  },
  {
    id: 'pozhu-gold-3',
    name: '破竹·无双',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'pozhu',
    effect: '破竹无双状态下，攻击力提升35%，攻速提升25%，持续时间延长50%',
  },
  {
    id: 'pozhu-purple-1',
    name: '破竹·破阵',
    quality: 'purple',
    isUniversal: false,
    schoolId: 'pozhu',
    effect: '破竹技能伤害提升12%，对首领目标额外增伤8%',
  },
  {
    id: 'pozhu-purple-2',
    name: '破竹·穿云',
    quality: 'purple',
    isUniversal: false,
    schoolId: 'pozhu',
    effect: '外功穿透提升10%，穿云箭伤害提升15%',
  },
  {
    id: 'pozhu-blue-1',
    name: '破竹·基础',
    quality: 'blue',
    isUniversal: false,
    schoolId: 'pozhu',
    effect: '破竹攻击提升6%，外功攻击提升4%',
  },

  // ===== 牵丝门派 =====
  {
    id: 'qiansi-gold-1',
    name: '牵丝·织梦',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'qiansi',
    effect: '牵丝属性攻击提升25%，治疗效果提升30%，织梦状态下额外提升15%',
  },
  {
    id: 'qiansi-gold-2',
    name: '牵丝·化雨',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'qiansi',
    effect: '霖雨霏霏治疗量提升35%，持续时间延长50%，覆盖范围扩大30%',
  },
  {
    id: 'qiansi-gold-3',
    name: '牵丝·玲珑',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'qiansi',
    effect: '牵丝技能伤害提升20%，玲珑心触发时全属性提升15%',
  },
  {
    id: 'qiansi-purple-1',
    name: '牵丝·缠丝',
    quality: 'purple',
    isUniversal: false,
    schoolId: 'qiansi',
    effect: '牵丝技能伤害提升12%，控制效果持续时间延长20%',
  },
  {
    id: 'qiansi-purple-2',
    name: '牵丝·续命',
    quality: 'purple',
    isUniversal: false,
    schoolId: 'qiansi',
    effect: '治疗量提升18%，续命针可立即恢复目标20%最大生命',
  },
  {
    id: 'qiansi-blue-1',
    name: '牵丝·基础',
    quality: 'blue',
    isUniversal: false,
    schoolId: 'qiansi',
    effect: '牵丝攻击提升6%，内功攻击提升4%',
  },

  // ===== 裂石门派 =====
  {
    id: 'lieshi-gold-1',
    name: '裂石·崩山',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'lieshi',
    effect: '裂石属性攻击提升25%，崩山击伤害提升35%，破防效果提升25%',
  },
  {
    id: 'lieshi-gold-2',
    name: '裂石·镇岳',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'lieshi',
    effect: '防御力提升25%，生命值上限提升20%，镇岳状态下减伤提升15%',
  },
  {
    id: 'lieshi-gold-3',
    name: '裂石·破军',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'lieshi',
    effect: '裂石技能伤害提升20%，破军形态下攻击力提升30%',
  },
  {
    id: 'lieshi-purple-1',
    name: '裂石·磐石',
    quality: 'purple',
    isUniversal: false,
    schoolId: 'lieshi',
    effect: '防御力提升15%，磐石状态下受到伤害降低12%',
  },
  {
    id: 'lieshi-purple-2',
    name: '裂石·裂地',
    quality: 'purple',
    isUniversal: false,
    schoolId: 'lieshi',
    effect: '裂地斩伤害提升18%，范围扩大25%',
  },
  {
    id: 'lieshi-blue-1',
    name: '裂石·基础',
    quality: 'blue',
    isUniversal: false,
    schoolId: 'lieshi',
    effect: '裂石攻击提升6%，外功攻击提升4%',
  },

  // ===== 鸣金门派 =====
  {
    id: 'mingjin-gold-1',
    name: '鸣金·破晓',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'mingjin',
    effect: '鸣金属性攻击提升25%，破晓一击伤害提升40%，会意伤害提升25%',
  },
  {
    id: 'mingjin-gold-2',
    name: '鸣金·流光',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'mingjin',
    effect: '鸣金技能伤害提升20%，流光状态下攻速提升30%，移速提升20%',
  },
  {
    id: 'mingjin-gold-3',
    name: '鸣金·残影',
    quality: 'gold',
    isUniversal: false,
    schoolId: 'mingjin',
    effect: '鸣金残影伤害提升35%，残影数量+1，持续时间延长50%',
  },
  {
    id: 'mingjin-purple-1',
    name: '鸣金·金钟',
    quality: 'purple',
    isUniversal: false,
    schoolId: 'mingjin',
    effect: '金钟护体减伤提升15%，持续时间延长30%',
  },
  {
    id: 'mingjin-purple-2',
    name: '鸣金·疾影',
    quality: 'purple',
    isUniversal: false,
    schoolId: 'mingjin',
    effect: '攻击速度提升15%，疾影步冷却缩短25%',
  },
  {
    id: 'mingjin-blue-1',
    name: '鸣金·基础',
    quality: 'blue',
    isUniversal: false,
    schoolId: 'mingjin',
    effect: '鸣金攻击提升6%，内功攻击提升4%',
  },
];

// 全部心法
export const ALL_HEART_METHODS = [...UNIVERSAL_HEART_METHODS, ...SCHOOL_HEART_METHODS];

// 根据门派获取可用心法（通用 + 门派专属）
export function getHeartMethodsBySchool(schoolId: string): IHeartMethod[] {
  const school = SCHOOLS.find(s => s.id === schoolId);
  if (!school) return UNIVERSAL_HEART_METHODS;
  
  const schoolMethods = SCHOOL_HEART_METHODS.filter(m => m.schoolId === school.category);
  const allMethods = [...UNIVERSAL_HEART_METHODS, ...schoolMethods];
  
  // 按品质排序：金色 > 紫色 > 蓝色
  const qualityOrder = { gold: 0, purple: 1, blue: 2 };
  return allMethods.sort((a, b) => qualityOrder[a.quality] - qualityOrder[b.quality]);
}

// ============================================
// 4. 装备数据
// ============================================

// 4.1 装备部位定义
export const EQUIPMENT_SLOTS = [
  { key: 'weapon1' as EquipmentSlot, label: '武器1', slotType: 'weapon' },
  { key: 'weapon2' as EquipmentSlot, label: '武器2', slotType: 'weapon' },
  { key: 'head' as EquipmentSlot, label: '冠胄', slotType: 'head' },
  { key: 'chest' as EquipmentSlot, label: '胸甲', slotType: 'chest' },
  { key: 'ring' as EquipmentSlot, label: '环', slotType: 'ring' },
  { key: 'pendant' as EquipmentSlot, label: '佩', slotType: 'pendant' },
  { key: 'legs' as EquipmentSlot, label: '胫甲', slotType: 'legs' },
  { key: 'hands' as EquipmentSlot, label: '腕甲', slotType: 'hands' },
];

// 4.2 套装数据
export const EQUIPMENT_SETS: IEquipmentSet[] = [
  {
    id: 'hantian',
    name: '撼天套装',
    quality: 'gold',
    pieces: 6,
    bonus2: '外功攻击提升8%',
    bonus4: '会心率提升6%，会心伤害提升15%',
    bonus6: '全部武学增伤提升10%，首领增伤提升8%',
  },
  {
    id: 'chuanyun',
    name: '穿云套装',
    quality: 'purple',
    pieces: 6,
    bonus2: '外功攻击提升5%',
    bonus4: '会心率提升4%，外功穿透提升5%',
    bonus6: '全部武学增伤提升6%',
  },
  {
    id: 'pojun',
    name: '破军套装',
    quality: 'gold',
    pieces: 6,
    bonus2: '外功攻击提升8%',
    bonus4: '防御力提升10%，生命值上限提升10%',
    bonus6: '对首领增伤提升12%，承伤降低8%',
  },
  {
    id: 'zhenhai',
    name: '镇海套装',
    quality: 'gold',
    pieces: 6,
    bonus2: '内功攻击提升8%',
    bonus4: '会意率提升6%，会意伤害提升15%',
    bonus6: '全部武学增伤提升10%，治疗效果提升12%',
  },
  {
    id: 'pozhen',
    name: '破阵套装',
    quality: 'purple',
    pieces: 6,
    bonus2: '外功攻击提升5%',
    bonus4: '外功穿透提升6%，破甲效果提升8%',
    bonus6: '单体奇术增伤提升8%',
  },
  {
    id: 'linglong',
    name: '玲珑套装',
    quality: 'purple',
    pieces: 6,
    bonus2: '内功攻击提升5%',
    bonus4: '会意率提升4%，治疗效果提升8%',
    bonus6: '群体奇术增伤提升6%',
  },
  {
    id: 'xuanbing',
    name: '玄冰套装',
    quality: 'blue',
    pieces: 6,
    bonus2: '内功攻击提升3%',
    bonus4: '冰属性攻击提升8%',
    bonus6: '技能冷却缩短5%',
  },
  {
    id: 'lieyan',
    name: '烈焰套装',
    quality: 'blue',
    pieces: 6,
    bonus2: '外功攻击提升3%',
    bonus4: '火属性攻击提升8%',
    bonus6: '暴击伤害提升8%',
  },
];

// 4.3 装备池
export const EQUIPMENT_POOL: IEquipment[] = [
  // ===== 武器 =====
  // 金色武器
  {
    id: 'w-gold-1',
    name: '撼天龙枪',
    slot: 'weapon',
    quality: 'gold',
    level: 85,
    setName: 'hantian',
    weaponType: 'spear',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 165, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 331, isPercent: false },
      { key: 'critRate', name: '会心率', value: 4.2, isPercent: true },
      { key: 'critDamage', name: '会心伤害', value: 12.5, isPercent: true },
    ],
  },
  {
    id: 'w-gold-2',
    name: '破军陌刀',
    slot: 'weapon',
    quality: 'gold',
    level: 85,
    setName: 'pojun',
    weaponType: 'podao',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 175, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 350, isPercent: false },
      { key: 'bossBonus', name: '首领增伤', value: 5.5, isPercent: true },
      { key: 'allMartialBonus', name: '全部武学增伤', value: 3.2, isPercent: true },
    ],
  },
  {
    id: 'w-gold-3',
    name: '镇海灵伞',
    slot: 'weapon',
    quality: 'gold',
    level: 85,
    setName: 'zhenhai',
    weaponType: 'umbrella',
    attributes: [
      { key: 'minElementalAttack', name: '最小内功攻击', value: 155, isPercent: false },
      { key: 'maxElementalAttack', name: '最大内功攻击', value: 310, isPercent: false },
      { key: 'masteryRate', name: '会意率', value: 3.8, isPercent: true },
      { key: 'masteryDamage', name: '会意伤害', value: 11.2, isPercent: true },
    ],
  },
  {
    id: 'w-gold-4',
    name: '破晓金鼓',
    slot: 'weapon',
    quality: 'gold',
    level: 85,
    setName: 'zhenhai',
    weaponType: 'drum',
    attributes: [
      { key: 'minElementalAttack', name: '最小内功攻击', value: 160, isPercent: false },
      { key: 'maxElementalAttack', name: '最大内功攻击', value: 320, isPercent: false },
      { key: 'masteryRate', name: '会意率', value: 4.0, isPercent: true },
      { key: 'allMartialBonus', name: '全部武学增伤', value: 3.5, isPercent: true },
    ],
  },
  // 紫色武器
  {
    id: 'w-purple-1',
    name: '穿云枪',
    slot: 'weapon',
    quality: 'purple',
    level: 80,
    setName: 'chuanyun',
    weaponType: 'spear',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 120, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 240, isPercent: false },
      { key: 'critRate', name: '会心率', value: 3.0, isPercent: true },
    ],
  },
  {
    id: 'w-purple-2',
    name: '破阵双刀',
    slot: 'weapon',
    quality: 'purple',
    level: 80,
    setName: 'pozhen',
    weaponType: 'dualBlade',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 115, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 230, isPercent: false },
      { key: 'externalPenetration', name: '外功穿透', value: 45, isPercent: false },
    ],
  },
  {
    id: 'w-purple-3',
    name: '玲珑玉扇',
    slot: 'weapon',
    quality: 'purple',
    level: 80,
    setName: 'linglong',
    weaponType: 'fan',
    attributes: [
      { key: 'minElementalAttack', name: '最小内功攻击', value: 110, isPercent: false },
      { key: 'maxElementalAttack', name: '最大内功攻击', value: 220, isPercent: false },
      { key: 'masteryRate', name: '会意率', value: 2.8, isPercent: true },
    ],
  },
  {
    id: 'w-purple-4',
    name: '青钢剑',
    slot: 'weapon',
    quality: 'purple',
    level: 80,
    setName: null,
    weaponType: 'sword',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 118, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 236, isPercent: false },
      { key: 'critDamage', name: '会心伤害', value: 8.0, isPercent: true },
    ],
  },
  // 蓝色武器
  {
    id: 'w-blue-1',
    name: '烈焰枪',
    slot: 'weapon',
    quality: 'blue',
    level: 75,
    setName: 'lieyan',
    weaponType: 'spear',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 85, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 170, isPercent: false },
    ],
  },
  {
    id: 'w-blue-2',
    name: '玄冰扇',
    slot: 'weapon',
    quality: 'blue',
    level: 75,
    setName: 'xuanbing',
    weaponType: 'fan',
    attributes: [
      { key: 'minElementalAttack', name: '最小内功攻击', value: 80, isPercent: false },
      { key: 'maxElementalAttack', name: '最大内功攻击', value: 160, isPercent: false },
    ],
  },
  {
    id: 'w-blue-3',
    name: '铁剑',
    slot: 'weapon',
    quality: 'blue',
    level: 70,
    setName: null,
    weaponType: 'sword',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 70, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 140, isPercent: false },
    ],
  },
  {
    id: 'w-blue-4',
    name: '木枪',
    slot: 'weapon',
    quality: 'blue',
    level: 65,
    setName: null,
    weaponType: 'spear',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 55, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 110, isPercent: false },
    ],
  },

  // ===== 冠胄（头盔）=====
  {
    id: 'h-gold-1',
    name: '撼天盔',
    slot: 'head',
    quality: 'gold',
    level: 85,
    setName: 'hantian',
    attributes: [
      { key: 'critRate', name: '会心率', value: 3.5, isPercent: true },
      { key: 'critDamage', name: '会心伤害', value: 10.5, isPercent: true },
      { key: 'accuracyRate', name: '精准率', value: 4.2, isPercent: true },
    ],
  },
  {
    id: 'h-gold-2',
    name: '破军盔',
    slot: 'head',
    quality: 'gold',
    level: 85,
    setName: 'pojun',
    attributes: [
      { key: 'defense', name: '防御力', value: 120, isPercent: false },
      { key: 'maxHealth', name: '生命上限', value: 800, isPercent: false },
      { key: 'bossBonus', name: '首领增伤', value: 4.0, isPercent: true },
    ],
  },
  {
    id: 'h-purple-1',
    name: '穿云冠',
    slot: 'head',
    quality: 'purple',
    level: 80,
    setName: 'chuanyun',
    attributes: [
      { key: 'critRate', name: '会心率', value: 2.5, isPercent: true },
      { key: 'externalPenetration', name: '外功穿透', value: 30, isPercent: false },
    ],
  },
  {
    id: 'h-purple-2',
    name: '镇海冠',
    slot: 'head',
    quality: 'purple',
    level: 80,
    setName: 'zhenhai',
    attributes: [
      { key: 'masteryRate', name: '会意率', value: 2.8, isPercent: true },
      { key: 'elementalPenetration', name: '属攻穿透', value: 25, isPercent: false },
    ],
  },
  {
    id: 'h-blue-1',
    name: '烈焰冠',
    slot: 'head',
    quality: 'blue',
    level: 75,
    setName: 'lieyan',
    attributes: [
      { key: 'critRate', name: '会心率', value: 1.8, isPercent: true },
    ],
  },
  {
    id: 'h-blue-2',
    name: '玄冰冠',
    slot: 'head',
    quality: 'blue',
    level: 75,
    setName: 'xuanbing',
    attributes: [
      { key: 'masteryRate', name: '会意率', value: 1.6, isPercent: true },
    ],
  },

  // ===== 胸甲 =====
  {
    id: 'c-gold-1',
    name: '撼天胸甲',
    slot: 'chest',
    quality: 'gold',
    level: 85,
    setName: 'hantian',
    attributes: [
      { key: 'maxHealth', name: '生命上限', value: 1200, isPercent: false },
      { key: 'defense', name: '防御力', value: 180, isPercent: false },
      { key: 'allMartialBonus', name: '全部武学增伤', value: 3.5, isPercent: true },
    ],
  },
  {
    id: 'c-gold-2',
    name: '破军胸甲',
    slot: 'chest',
    quality: 'gold',
    level: 85,
    setName: 'pojun',
    attributes: [
      { key: 'maxHealth', name: '生命上限', value: 1500, isPercent: false },
      { key: 'defense', name: '防御力', value: 220, isPercent: false },
      { key: 'damageReduction', name: '伤害减免', value: 4.5, isPercent: true },
    ],
  },
  {
    id: 'c-purple-1',
    name: '穿云胸甲',
    slot: 'chest',
    quality: 'purple',
    level: 80,
    setName: 'chuanyun',
    attributes: [
      { key: 'maxHealth', name: '生命上限', value: 900, isPercent: false },
      { key: 'externalPenetration', name: '外功穿透', value: 35, isPercent: false },
    ],
  },
  {
    id: 'c-purple-2',
    name: '镇海胸甲',
    slot: 'chest',
    quality: 'purple',
    level: 80,
    setName: 'zhenhai',
    attributes: [
      { key: 'maxHealth', name: '生命上限', value: 850, isPercent: false },
      { key: 'masteryDamage', name: '会意伤害', value: 7.5, isPercent: true },
    ],
  },
  {
    id: 'c-blue-1',
    name: '烈焰胸甲',
    slot: 'chest',
    quality: 'blue',
    level: 75,
    setName: 'lieyan',
    attributes: [
      { key: 'maxHealth', name: '生命上限', value: 600, isPercent: false },
    ],
  },
  {
    id: 'c-blue-2',
    name: '玄冰胸甲',
    slot: 'chest',
    quality: 'blue',
    level: 75,
    setName: 'xuanbing',
    attributes: [
      { key: 'maxHealth', name: '生命上限', value: 580, isPercent: false },
    ],
  },

  // ===== 环（手镯）=====
  {
    id: 'r-gold-1',
    name: '撼天环',
    slot: 'ring',
    quality: 'gold',
    level: 85,
    setName: 'hantian',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 55, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 110, isPercent: false },
      { key: 'critRate', name: '会心率', value: 2.8, isPercent: true },
    ],
  },
  {
    id: 'r-gold-2',
    name: '镇海环',
    slot: 'ring',
    quality: 'gold',
    level: 85,
    setName: 'zhenhai',
    attributes: [
      { key: 'minElementalAttack', name: '最小内功攻击', value: 50, isPercent: false },
      { key: 'maxElementalAttack', name: '最大内功攻击', value: 100, isPercent: false },
      { key: 'masteryRate', name: '会意率', value: 2.5, isPercent: true },
    ],
  },
  {
    id: 'r-purple-1',
    name: '穿云环',
    slot: 'ring',
    quality: 'purple',
    level: 80,
    setName: 'chuanyun',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 40, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 80, isPercent: false },
    ],
  },
  {
    id: 'r-purple-2',
    name: '破阵环',
    slot: 'ring',
    quality: 'purple',
    level: 80,
    setName: 'pozhen',
    attributes: [
      { key: 'externalPenetration', name: '外功穿透', value: 40, isPercent: false },
      { key: 'singleSkillBonus', name: '单体奇术增伤', value: 3.5, isPercent: true },
    ],
  },
  {
    id: 'r-blue-1',
    name: '烈焰环',
    slot: 'ring',
    quality: 'blue',
    level: 75,
    setName: 'lieyan',
    attributes: [
      { key: 'minExternalAttack', name: '最小外功攻击', value: 28, isPercent: false },
      { key: 'maxExternalAttack', name: '最大外功攻击', value: 56, isPercent: false },
    ],
  },
  {
    id: 'r-blue-2',
    name: '玄冰环',
    slot: 'ring',
    quality: 'blue',
    level: 75,
    setName: 'xuanbing',
    attributes: [
      { key: 'minElementalAttack', name: '最小内功攻击', value: 26, isPercent: false },
      { key: 'maxElementalAttack', name: '最大内功攻击', value: 52, isPercent: false },
    ],
  },

  // ===== 佩（玉佩）=====
  {
    id: 'p-gold-1',
    name: '撼天佩',
    slot: 'pendant',
    quality: 'gold',
    level: 85,
    setName: 'hantian',
    attributes: [
      { key: 'critDamage', name: '会心伤害', value: 8.5, isPercent: true },
      { key: 'bossBonus', name: '首领增伤', value: 4.5, isPercent: true },
      { key: 'allMartialBonus', name: '全部武学增伤', value: 2.8, isPercent: true },
    ],
  },
  {
    id: 'p-gold-2',
    name: '破军佩',
    slot: 'pendant',
    quality: 'gold',
    level: 85,
    setName: 'pojun',
    attributes: [
      { key: 'maxHealth', name: '生命上限', value: 600, isPercent: false },
      { key: 'defense', name: '防御力', value: 80, isPercent: false },
      { key: 'bossBonus', name: '首领增伤', value: 5.0, isPercent: true },
    ],
  },
  {
    id: 'p-purple-1',
    name: '穿云佩',
    slot: 'pendant',
    quality: 'purple',
    level: 80,
    setName: 'chuanyun',
    attributes: [
      { key: 'critRate', name: '会心率', value: 2.2, isPercent: true },
      { key: 'critDamage', name: '会心伤害', value: 6.0, isPercent: true },
    ],
  },
  {
    id: 'p-purple-2',
    name: '玲珑佩',
    slot: 'pendant',
    quality: 'purple',
    level: 80,
    setName: 'linglong',
    attributes: [
      { key: 'masteryRate', name: '会意率', value: 2.0, isPercent: true },
      { key: 'aoeSkillBonus', name: '群体奇术增伤', value: 3.0, isPercent: true },
    ],
  },
  {
    id: 'p-blue-1',
    name: '烈焰佩',
    slot: 'pendant',
    quality: 'blue',
    level: 75,
    setName: 'lieyan',
    attributes: [
      { key: 'critDamage', name: '会心伤害', value: 4.0, isPercent: true },
    ],
  },
  {
    id: 'p-blue-2',
    name: '玄冰佩',
    slot: 'pendant',
    quality: 'blue',
    level: 75,
    setName: 'xuanbing',
    attributes: [
      { key: 'masteryDamage', name: '会意伤害', value: 3.5, isPercent: true },
    ],
  },

  // ===== 胫甲（裤子）=====
  {
    id: 'l-gold-1',
    name: '撼天胫甲',
    slot: 'legs',
    quality: 'gold',
    level: 85,
    setName: 'hantian',
    attributes: [
      { key: 'critRate', name: '会心率', value: 3.0, isPercent: true },
      { key: 'externalPenetration', name: '外功穿透', value: 50, isPercent: false },
      { key: 'bossBonus', name: '首领增伤', value: 3.5, isPercent: true },
    ],
  },
  {
    id: 'l-gold-2',
    name: '镇海胫甲',
    slot: 'legs',
    quality: 'gold',
    level: 85,
    setName: 'zhenhai',
    attributes: [
      { key: 'masteryRate', name: '会意率', value: 2.8, isPercent: true },
      { key: 'elementalPenetration', name: '属攻穿透', value: 45, isPercent: false },
      { key: 'healingBonus', name: '治疗效果', value: 6.0, isPercent: true },
    ],
  },
  {
    id: 'l-purple-1',
    name: '穿云胫甲',
    slot: 'legs',
    quality: 'purple',
    level: 80,
    setName: 'chuanyun',
    attributes: [
      { key: 'critRate', name: '会心率', value: 2.0, isPercent: true },
      { key: 'externalPenetration', name: '外功穿透', value: 35, isPercent: false },
    ],
  },
  {
    id: 'l-purple-2',
    name: '破阵胫甲',
    slot: 'legs',
    quality: 'purple',
    level: 80,
    setName: 'pozhen',
    attributes: [
      { key: 'externalPenetration', name: '外功穿透', value: 45, isPercent: false },
      { key: 'singleSkillBonus', name: '单体奇术增伤', value: 2.5, isPercent: true },
    ],
  },
  {
    id: 'l-blue-1',
    name: '烈焰胫甲',
    slot: 'legs',
    quality: 'blue',
    level: 75,
    setName: 'lieyan',
    attributes: [
      { key: 'critRate', name: '会心率', value: 1.5, isPercent: true },
    ],
  },
  {
    id: 'l-blue-2',
    name: '玄冰胫甲',
    slot: 'legs',
    quality: 'blue',
    level: 75,
    setName: 'xuanbing',
    attributes: [
      { key: 'masteryRate', name: '会意率', value: 1.3, isPercent: true },
    ],
  },

  // ===== 腕甲（护腕）=====
  {
    id: 'a-gold-1',
    name: '撼天腕甲',
    slot: 'hands',
    quality: 'gold',
    level: 85,
    setName: 'hantian',
    attributes: [
      { key: 'critRate', name: '会心率', value: 2.5, isPercent: true },
      { key: 'critDamage', name: '会心伤害', value: 7.5, isPercent: true },
      { key: 'accuracyRate', name: '精准率', value: 3.0, isPercent: true },
    ],
  },
  {
    id: 'a-gold-2',
    name: '破军腕甲',
    slot: 'hands',
    quality: 'gold',
    level: 85,
    setName: 'pojun',
    attributes: [
      { key: 'defense', name: '防御力', value: 70, isPercent: false },
      { key: 'maxHealth', name: '生命上限', value: 400, isPercent: false },
      { key: 'playerBonus', name: '对玩家增效', value: 4.0, isPercent: true },
    ],
  },
  {
    id: 'a-purple-1',
    name: '穿云腕甲',
    slot: 'hands',
    quality: 'purple',
    level: 80,
    setName: 'chuanyun',
    attributes: [
      { key: 'critRate', name: '会心率', value: 1.8, isPercent: true },
      { key: 'accuracyRate', name: '精准率', value: 2.5, isPercent: true },
    ],
  },
  {
    id: 'a-purple-2',
    name: '玲珑腕甲',
    slot: 'hands',
    quality: 'purple',
    level: 80,
    setName: 'linglong',
    attributes: [
      { key: 'masteryRate', name: '会意率', value: 1.6, isPercent: true },
      { key: 'healingBonus', name: '治疗效果', value: 4.0, isPercent: true },
    ],
  },
  {
    id: 'a-blue-1',
    name: '烈焰腕甲',
    slot: 'hands',
    quality: 'blue',
    level: 75,
    setName: 'lieyan',
    attributes: [
      { key: 'critRate', name: '会心率', value: 1.2, isPercent: true },
    ],
  },
  {
    id: 'a-blue-2',
    name: '玄冰腕甲',
    slot: 'hands',
    quality: 'blue',
    level: 75,
    setName: 'xuanbing',
    attributes: [
      { key: 'masteryRate', name: '会意率', value: 1.0, isPercent: true },
    ],
  },
];

// 根据部位获取装备
export function getEquipmentsBySlot(slot: EquipmentSlot | 'weapon'): IEquipment[] {
  if (slot === 'weapon') {
    return EQUIPMENT_POOL.filter(e => e.slot === 'weapon');
  }
  return EQUIPMENT_POOL.filter(e => e.slot === slot);
}

// 按品质排序装备
export function sortEquipmentsByQuality(equipments: IEquipment[]): IEquipment[] {
  const qualityOrder = { gold: 0, purple: 1, blue: 2 };
  return [...equipments].sort((a, b) => qualityOrder[a.quality] - qualityOrder[b.quality]);
}

// ============================================
// 5. 角色属性默认值
// ============================================
export const DEFAULT_CHARACTER_STATS = {
  // 外功攻击
  minExternalAttack: 10000,
  maxExternalAttack: 12000,
  externalMultiplier: 1,
  externalBonusPercent: 0,
  // 伤害倍率与固伤
  elementalMultiplier: 1,
  elementalBonusPercent: 0,
  fixedDamage: 0,
  // 精准率
  accuracyRate: 100,
  // 判定抗性
  resistance: 0,
  // 会心系统
  critRate: 25,
  directCritRate: 15,
  critDamageBonus: 54,
  // 会意系统
  masteryRate: 15,
  directMasteryRate: 10,
  masteryDamageBonus: 35,
  // 穿透系统
  externalPenetration: 500,
  elementalPenetration: 300,
  // 增伤乘区
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
  // 属攻系统
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
  // 防御生命
  defense: 2000,
  maxHealth: 20000,
  damageReduction: 0,
  healingBonus: 0,
};

// 根据流派获取基础属性
export function getBaseStatsBySchool(schoolId: string) {
  const base = { ...DEFAULT_CHARACTER_STATS };
  const school = SCHOOLS.find(s => s.id === schoolId);
  
  if (!school) return base;
  
  // 根据门派类别调整基础属性
  switch (school.category) {
    case 'pozhu':
      base.minExternalAttack = 11000;
      base.maxExternalAttack = 13500;
      base.critRate = 28;
      base.critDamageBonus = 58;
      break;
    case 'qiansi':
      base.minQiansiAttack = 500;
      base.maxQiansiAttack = 800;
      base.masteryRate = 20;
      base.masteryDamageBonus = 40;
      base.healingBonus = 15;
      break;
    case 'lieshi':
      base.minExternalAttack = 11500;
      base.maxExternalAttack = 14000;
      base.defense = 3000;
      base.maxHealth = 30000;
      base.damageReduction = 8;
      break;
    case 'mingjin':
      base.minMingjinAttack = 520;
      base.maxMingjinAttack = 850;
      base.masteryRate = 22;
      base.masteryDamageBonus = 45;
      break;
  }
  
  return base;
}

// ============================================
// 6. DPS参考数据
// ============================================
export const DPS_REFERENCE = [
  { name: '破竹鸢', dps: '245-280万' },
  { name: '牵丝霖', dps: '210-250万' },
  { name: '鸣金虹', dps: '230-270万' },
  { name: '裂石钧', dps: '250-290万' },
];

// ============================================
// 7. 心法槽位
// ============================================
export const HEART_METHOD_SLOTS = [
  { key: 'slot1', label: '心法1' },
  { key: 'slot2', label: '心法2' },
  { key: 'slot3', label: '心法3' },
  { key: 'slot4', label: '心法4' },
];

// ============================================
// 8. 穿戴栏位
// ============================================
export const WEAR_SLOTS = [
  { key: 'weapon1', label: '武器1', slotType: 'weapon' as const },
  { key: 'weapon2', label: '武器2', slotType: 'weapon' as const },
  { key: 'head', label: '冠胄', slotType: 'head' as const },
  { key: 'chest', label: '胸甲', slotType: 'chest' as const },
  { key: 'ring', label: '环', slotType: 'ring' as const },
  { key: 'pendant', label: '佩', slotType: 'pendant' as const },
  { key: 'legs', label: '胫甲', slotType: 'legs' as const },
  { key: 'hands', label: '腕甲', slotType: 'hands' as const },
];
