// Shared game constants (loaded from config.yaml, parsed at startup)
export interface GameConfig {
  floorSize: number;
  playerSpeed: number;
  lerpFactor: number;
  speedStrafeFactor: number;
  skills: {
    projectile: {
      cooldown: number;
      projectileSpeed: number;
      maxReach: number;
      maxBurstParticles: number;
      burstSpeed: number;
      burstDuration: number;
    };
  };
}

export const DEFAULT_CONFIG: GameConfig = {
  floorSize: 10,
  playerSpeed: 5,
  lerpFactor: 8,
  speedStrafeFactor: 0.75,
  skills: {
    projectile: {
      cooldown: 3,
      projectileSpeed: 7.5,
      maxReach: 4,
      maxBurstParticles: 18,
      burstSpeed: 8,
      burstDuration: 1.5,
    },
  },
};

export function loadConfig(): GameConfig {
  return { ...DEFAULT_CONFIG };
}
