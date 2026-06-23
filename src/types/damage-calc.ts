// ========== 战斗属性Key ==========
export type CombatStatKey =
  // 基础战斗类
  | 'minExternalAttack'
  | 'maxExternalAttack'
  | 'minElementalAttack'
  | 'maxElementalAttack'
  | 'accuracyRate'
  | 'critRate'
  | 'critDamage'
  | 'masteryRate'
  | 'masteryDamage'
  // 穿透增伤类
  | 'externalPenetration'
  | 'elementalPenetration'
  | 'allMartialBonus'
  | 'umbrellaBonus'
  | 'fanBonus'
  | 'swordBonus'
  | 'spearBonus'
  | 'gauntletBonus'
  | 'dualBladeBonus'
  | 'ropeBonus'
  | 'drumBonus'
  | 'podaoBonus'
  | 'hengdaoBonus'
  | 'bossBonus'
  | 'playerBonus'
  | 'singleSkillBonus'
  | 'aoeSkillBonus'
  | 'dingyinBonus'
  // 四属攻类
  | 'minPozhuAttack'
  | 'maxPozhuAttack'
  | 'minQiansiAttack'
  | 'maxQiansiAttack'
  | 'minMingjinAttack'
  | 'maxMingjinAttack'
  | 'minLieshiAttack'
  | 'maxLieshiAttack'
  // 三维属性
  | 'jin'
  | 'min'
  | 'shi'
  | 'ti'
  | 'yu'
  // 生存类
  | 'survival'
  | 'defense'
  | 'maxHealth'
  | 'damageReduction'
  | 'healingBonus';

// ========== 武器类型 ==========
export type WeaponType = 'umbrella' | 'fan' | 'sword' | 'spear' | 'gauntlet' | 'dualBlade' | 'rope' | 'drum' | 'podao' | 'hengdao';

// ========== 装备部位 ==========
export type EquipmentSlot = 'weapon' | 'head' | 'chest' | 'ring' | 'pendant' | 'legs' | 'hands';

// ========== 装备品质 ==========
export type EquipmentQuality = 'gold' | 'purple' | 'blue';

// ========== 流派 ==========
export interface ISchool {
  id: string;
  name: string;
  category: string;
  element?: string;
  style: string;
  dpsRange: string;
  description: string;
  damageType?: 'crit' | 'mastery';
  weaponType?: WeaponType;
}

// ========== 武库 ==========
export interface IWuKu {
  id: string;
  name: string;
  category: string;
  minBonus: number;
  maxBonus: number;
  description?: string;
}

// ========== 套装 ==========
export interface IEquipmentSet {
  id: string;
  name: string;
  quality: EquipmentQuality;
  pieces: number;
  bonus2: string;
  bonus4: string;
  bonus6: string;
}

// ========== 心法 ==========
export interface IHeartMethod {
  id: string;
  name: string;
  schoolId: string;
  quality: EquipmentQuality;
  isUniversal: boolean;
  effect: string;
}

// ========== 装备属性 ==========
export interface IEquipmentAttribute {
  key: CombatStatKey;
  name: string;
  value: number;
  isPercent: boolean;
}

// ========== 装备 ==========
export interface IEquipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  quality: EquipmentQuality;
  level: number;
  setName: string | null;
  weaponType?: WeaponType;
  attributes: IEquipmentAttribute[];
}

// ========== 专属武学 ==========
export interface ISpecialSkill {
  id: string;
  name: string;
  schoolId: string;
  description: string;
  cooldown: number;
  castTime: number;
}

// ========== 增益药品/帖子 ==========
export interface IBuffItem {
  id: string;
  name: string;
  type: string;
  effect: string;
  duration: number;
}

// ========== 增伤乘区 ==========
export interface IDamageMultiplier {
  id: string;
  name: string;
  value: number;
  max: number;
  unit: string;
}

// ========== 技能序列 ==========
export interface ISkillSequence {
  id: string;
  schoolId: string;
  name: string;
  skills: string[];
}

// ========== 毕业率记录 ==========
export interface IGraduationRecord {
  schoolId: string;
  tier: string;
  minDps: number;
  maxDps: number;
  graduationRate: number;
}

// ========== 角色 ==========
export interface ICharacter {
  id: string;
  name: string;
  schoolId: string;
  baseAttack: number;
  baseDefense: number;
  critRate: number;
  critDamage: number;
  masteryRate: number;
  masteryDamage: number;
  fireAttack: number;
  iceAttack: number;
  thunderAttack: number;
  poisonAttack: number;
  equipmentIds: string[];
  gongjueSuit?: 'precision' | 'mastery' | 'crit';
}

// ========== 词条 ==========
export interface IAffix {
  key: CombatStatKey;
  name: string;
  value: number;
  isPercent: boolean;
}

// ========== 配装方案 ==========
export interface IEquipmentLoadout {
  id: string;
  name: string;
  schoolId: string;
  wuKu: string;
  gongjueSuit: string;
  equipmentIds: string[];
  characterSnapshot: {
    minExternalAttack: number; maxExternalAttack: number;
    accuracyRate: number;
    critRate: number; directCritRate: number; critDamageBonus: number;
    masteryRate: number; directMasteryRate: number; masteryDamageBonus: number;
    resistance: number;
    externalPenetration: number; elementalPenetration: number;
    externalDamageBonus: number; elementalDamageBonus: number; allMartialBonus: number; bossBonus: number; playerBonus: number;
    singleSkillBonus: number; aoeSkillBonus: number; dingyinBonus: number; externalDamageMultiplier: number; elementalDamageMultiplier: number; fixedDamage: number; externalAttackBonus: number; elementalAttackBonus: number; fixedDamageBonus: number; generalBonus: number;
    minWuxiangAttack: number; maxWuxiangAttack: number;
    minQiansiAttack: number; maxQiansiAttack: number;
    minPozhuAttack: number; maxPozhuAttack: number;
    minMingjinAttack: number; maxMingjinAttack: number;
    minLieshiAttack: number; maxLieshiAttack: number;
  };
  createdAt: number;
}

// ========== 属性分组 ==========
export interface IStatGroup {
  id: string;
  name: string;
  stats: CombatStatKey[];
  icon?: string;
}

// ========== 穿戴属性汇总 ==========
export interface IWearSummary {
  minExternalAttack: number;
  maxExternalAttack: number;
  critRate: number;
  critDamage: number;
  masteryRate: number;
  masteryDamage: number;
  externalPenetration: number;
  elementalPenetration: number;
  bossBonus: number;
  allMartialBonus: number;
  defense: number;
  maxHealth: number;
}
