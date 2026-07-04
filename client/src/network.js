export class Network {
  constructor(client, game) {
    this.client = client;
    this.game = game;
    this.myPlayerId = 0;
    this.opponentName = '';
  }

  onJoin(myPlayerId, opponentName = '') {
    this.myPlayerId = myPlayerId;
    this.opponentName = opponentName;
  }

  onDisconnect() {
    this.game.physics.cleanupPlayerEntities();
    this.game.recreateHUD();
  }
}
