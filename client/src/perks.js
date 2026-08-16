import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

export const PERK_POOL = [
  {
    id: 'dual_wield',
    title: 'DUAL WIELD RIFLES',
    subtitle: 'Çift Silah Kuşanma',
    icon: '🔫🔫',
    rarity: 'legendary',
    rarityColor: '#ffaa00',
    description: 'Sol eline ikinci bir APOC-1 tüfeği verir. Şarjör kapasitesi 10 mermiye çıkar ve çift namlulu ateş eder!'
  },
  {
    id: 'sentry_turret',
    title: 'ORBITAL AUTO-TURRET',
    subtitle: 'Otomatik Savunma Tareti',
    icon: '🤖⚡',
    rarity: 'epic',
    rarityColor: '#b388ff',
    description: 'Omuzunun üstünde uçan otomatik lazer tareti yerleştirir. Yakındaki zombilere otonom olarak ateş açar!'
  },
  {
    id: 'explosive_rounds',
    title: 'EXPLOSIVE AMMO',
    subtitle: 'Patlayıcı Alan Mermileri',
    icon: '💥🔥',
    rarity: 'epic',
    rarityColor: '#ff5252',
    description: 'Mermiler çarptığında patlayarak etraftaki tüm zombilere yüksek alan hasarı (AoE) vurur!'
  },
  {
    id: 'piercing_plasma',
    title: 'PLASMA RICOCHET',
    subtitle: 'Delici Plazma Mermileri',
    icon: '⚡🌀',
    rarity: 'rare',
    rarityColor: '#00e5ff',
    description: 'Mermilerini neon plazmaya dönüştürür. Zombileri delip geçer ve duvarlardan sekerek katliam yapar!'
  },
  {
    id: 'nano_armor',
    title: 'NANO-COMPOSITE ARMOR',
    subtitle: 'Maksimum Can & Zırh',
    icon: '🛡️❤️',
    rarity: 'rare',
    rarityColor: '#00e676',
    description: 'Maksimum canını 150\'ye yükseltir ve etrafına zırh kalkanı ekleyerek gelen hasarı %25 azaltır!'
  },
  {
    id: 'cyber_dash',
    title: 'CYBER LIGHTNING DASH',
    subtitle: 'Yıldırım Atılması',
    icon: '⚡💨',
    rarity: 'rare',
    rarityColor: '#ffd600',
    description: 'Dash atıldığında arkanda elektrik fırtınası bırakır, içinden geçtiğin zombileri anında sersemletip yakar!'
  }
];

export class PerkManager {
  constructor() {
    this.activePerks = new Set();
    this.turretEntity = null;
    this.turretCooldown = 0;
  }

  has(perkId) {
    return this.activePerks.has(perkId);
  }

  add(perkId) {
    this.activePerks.add(perkId);
  }

  getRandomChoices(count = 3) {
    // Filter out unique perks already owned (like dual_wield or sentry_turret)
    const available = PERK_POOL.filter(p => !this.activePerks.has(p.id));
    if (available.length < count) return PERK_POOL.slice(0, count);

    // Shuffle and pick 3
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  reset(physics) {
    this.activePerks.clear();
    if (physics && physics.groundTurret) {
      if (physics.groundTurret.entity.parent) {
        physics.groundTurret.entity.parent.removeChild(physics.groundTurret.entity);
      }
      physics.groundTurret.entity.destroy();
      physics.groundTurret = null;
    }
  }
}
