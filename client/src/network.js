export class Network {
  constructor(client, game) {
    this.client = client;
    this.game = game;
    this.myPlayerId = 0;
  }

  onJoin(myPlayerId) {
    this.myPlayerId = myPlayerId;
  }

  onDisconnect() {
    this.game.physics.cleanupPlayerEntities();
    this.game.recreateHUD();
    setTimeout(() => this.game.networkClient.connect(), 1000);
  }
}
