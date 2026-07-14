export class Network {
  constructor(client, game) {
    this.client = client;
    this.game = game;
    this.myPlayerId = 0;
    this.opponentName = null;
  }

  onJoin(myPlayerId, opponentName) {
    this.myPlayerId = myPlayerId;
    this.opponentName = opponentName || null;
    this.game.ui.clearDeathLabels();
  }

  onDisconnect() {
    this.game.physics.cleanupPlayerEntities();
    this.game.ui.clearDeathLabels();
    this.game.recreateHUD();
  }
}
