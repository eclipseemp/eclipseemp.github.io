// ============================================
// 武器重铸词条数据
// ============================================

export type RuneQuality = '霁青' | '紫绶' | '砺金';

export interface IRuneEntry {
  name: string;
  quality: RuneQuality;
  isSet?: boolean; // 是否是套装词条
}

// 公共颜色词条
export const COLOR_RUNES: Record<RuneQuality, string[]> = {
  霁青: ['胭脂', '青金', '苍茫', '朱栏', '松绿', '芽黄', '暮紫', '羽灰', '墨尘'],
  紫绶: ['杏粉', '烟蓝', '水色', '杜鹃', '微草', '南桔', '藤紫', '白贝', '寒鸦'],
  砺金: ['桃晶', '龙渊', '冰泉', '红锦', '碧玉', '黄金', '紫琉', '珍珠', '黑曜'],
};

// 武器套装词条数据
export interface IWeaponSetRunes {
  weaponName: string;
  霁青: string[];
  紫绶: string[];
  砺金: string[];
}

export const WEAPON_SET_RUNES: IWeaponSetRunes[] = [
  {
    weaponName: '伞·北冥有鱼',
    霁青: ['崔嵬'],
    紫绶: ['虹霓', '太清'],
    砺金: ['街光', '层霄', '重溟'],
  },
  {
    weaponName: '伞·星河欲曙',
    霁青: ['欢宴'],
    紫绶: ['惊梦', '玉颜'],
    砺金: ['碧落', '太真'],
  },
  {
    weaponName: '剑·千古断云',
    霁青: ['朔风'],
    紫绶: ['夜岚', '明空'],
    砺金: ['流火', '惊霆'],
  },
  {
    weaponName: '剑·龙跃霄汉',
    霁青: ['负岳'],
    紫绶: ['蟠枝', '衔锋'],
    砺金: ['炼虹', '擎冰'],
  },
  {
    weaponName: '枪·昆山玉碎',
    霁青: ['重华'],
    紫绶: ['镇瑞', '辰星'],
    砺金: ['长庚', '荧惑'],
  },
  {
    weaponName: '枪·潜龙在渊',
    霁青: ['潜蛟'],
    紫绶: ['清光', '素冰'],
    砺金: ['九霄', '亢龙'],
  },
  {
    weaponName: '弓·凤凰于飞',
    霁青: ['逸羽'],
    紫绶: ['宵影', '晨晖'],
    砺金: ['清仪', '腾光'],
  },
  {
    weaponName: '扇·霓裳天风',
    霁青: ['春泽'],
    紫绶: ['急鼓', '秾华'],
    砺金: ['银汉', '蓬瀛'],
  },
  {
    weaponName: '扇·韶光四极',
    霁青: ['玉台'],
    紫绶: ['金阙', '关山'],
    砺金: ['瀚海', '九域'],
  },
  {
    weaponName: '双刀·苦昼难长',
    霁青: ['滞骨'],
    紫绶: ['天东', '烛龙'],
    砺金: ['飞光', '太一'],
  },
  {
    weaponName: '陌刀·万古同悲',
    霁青: ['石火'],
    紫绶: ['阆风', '酌酒'],
    砺金: ['宵梦', '西荒'],
  },
  {
    weaponName: '绳镖·何非法相',
    霁青: ['净莲'],
    紫绶: ['魍魉', '谛听'],
    砺金: ['生灭', '玲珑'],
  },
  {
    weaponName: '横刀·羲和敲日',
    霁青: ['烛烟'],
    紫绶: ['海清', '劼烬'],
    砺金: ['霜月', '焚羲'],
  },
  {
    weaponName: '手甲·丹霄清鸣',
    霁青: ['净琮'],
    紫绶: ['幽响', '云韶'],
    砺金: ['焚歌', '玄籁'],
  },
  {
    weaponName: '鼓·霓裳清响',
    霁青: ['苎萝'],
    紫绶: ['虹裳', '冰坼'],
    砺金: ['昭阳', '翔鸾'],
  },
];

// 孔位名称
export const RUNE_SLOT_NAMES = ['一孔', '二孔', '三孔', '四孔', '明光'];

// 词条池规则：
// 一孔：颜色词条 + 套装词条（所有品质）
// 二/三/四孔：只有套装词条
// 五孔：明光（固定）

// 获取指定武器和孔位的词条池
export function getRunePool(weaponName: string, slotIndex: number): IRuneEntry[] {
  const weaponData = WEAPON_SET_RUNES.find(w => w.weaponName === weaponName);
  if (!weaponData) return [];

  const pool: IRuneEntry[] = [];

  if (slotIndex === 0) {
    // 一孔：颜色词条 + 套装词条
    // 霁青：9颜色 + 1套装
    COLOR_RUNES.霁青.forEach(name => {
      pool.push({ name, quality: '霁青' });
    });
    weaponData.霁青.forEach(name => {
      pool.push({ name, quality: '霁青', isSet: true });
    });

    // 紫绶：9颜色 + 2套装
    COLOR_RUNES.紫绶.forEach(name => {
      pool.push({ name, quality: '紫绶' });
    });
    weaponData.紫绶.forEach(name => {
      pool.push({ name, quality: '紫绶', isSet: true });
    });

    // 砺金：9颜色 + 2~3套装
    COLOR_RUNES.砺金.forEach(name => {
      pool.push({ name, quality: '砺金' });
    });
    weaponData.砺金.forEach(name => {
      pool.push({ name, quality: '砺金', isSet: true });
    });
  } else if (slotIndex >= 1 && slotIndex <= 3) {
    // 二/三/四孔：只有套装词条
    weaponData.霁青.forEach(name => {
      pool.push({ name, quality: '霁青', isSet: true });
    });
    weaponData.紫绶.forEach(name => {
      pool.push({ name, quality: '紫绶', isSet: true });
    });
    weaponData.砺金.forEach(name => {
      pool.push({ name, quality: '砺金', isSet: true });
    });
  }

  return pool;
}

// 从词条池中随机抽取一个指定品质的词条
export function pickRuneByQuality(pool: IRuneEntry[], quality: RuneQuality): IRuneEntry | null {
  const filtered = pool.filter(r => r.quality === quality);
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// 砺金颜色词条列表（用于音效判断）
export const GOLD_COLOR_RUNES = new Set(COLOR_RUNES.砺金);

// 判断词条是否是砺金品质（颜色词条或套装词条）
export function isGoldRune(rune: IRuneEntry): boolean {
  return rune.quality === '砺金';
}
