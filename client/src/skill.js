export class Skill {
  constructor(app) {
    this.app = app;
    this.cooldown = 0;
    this.maxCooldown = 0;
  }

  canActivate() {
    return this.cooldown <= 0;
  }

  activate() {
    this.cooldown = this.maxCooldown;
  }

  update(dt) {
    if (this.cooldown > 0) {
      this.cooldown -= dt;
    }
  }

  onRemove() {
  }
}
