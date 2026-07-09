export class Network {
  constructor(client, game) {
    this.client = client;
    this.game = game;
    this.myPlayerId = 0;
  }

  onJoin(myPlayerId) {
    this.myPlayerId = myPlayerId;
    this.game.ui.clearDeathLabels();
  }

  onDisconnect() {
    this.game.physics.cleanupPlayerEntities();
    this.game.ui.clearDeathLabels();
    this.game.recreateHUD();
  }
}
