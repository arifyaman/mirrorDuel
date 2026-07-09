import { Color, Entity, StandardMaterial, Vec3, CameraFrame, TONEMAP_ACES } from 'playcanvas';

export class Scene {
  constructor(app) {
    this.app = app;
    this.cameraNode = null;
    this.cameraComponent = null;
    this.cameraOffset = { x: 0, y: 10, z: 16 };
    this.cameraBaseY = 10;
    this.cameraBaseZ = 16;
    this.cameraFollowFactor = 0.4;
    this._playerPositions = [];
    this.cameraTargetMid = { x: 0, y: 0, z: 0 };
    this.createFloor();
    this.createCamera();
    this.createBoundaryWalls();
    this.setupPostProcessing();
  }

  createFloor() {
    const floor = new Entity('floor');
    const floorRender = floor.addComponent('render', { type: 'box' });
    floor.setLocalScale(20, 0.05, 20);
    floor.setPosition(0, -0.5, 0);
    const floorMaterial = new StandardMaterial();
    floorMaterial.diffuse = new Color(0.12, 0.12, 0.18);
    floorMaterial.roughness = 0.6;
    floorMaterial.metalness = 0.1;
    floorMaterial.receiveShadows = true;
    floorMaterial.update();
    floorRender.material = floorMaterial;
    this.app.root.addChild(floor);

    // Grid lines using a large thin box as a grid plane
    const grid = new Entity('grid');
    const gridRender = grid.addComponent('render', { type: 'box' });
    grid.setLocalScale(20, 0.01, 0.015);
    grid.setPosition(0, -0.47, 0);
    const gridMaterial = new StandardMaterial();
    gridMaterial.diffuse = new Color(0.0, 0.8, 0.3);
    gridMaterial.emissive = new Color(0.0, 0.5, 0.2);
    gridMaterial.emissiveIntensity = 0.5;
    gridMaterial.roughness = 0.5;
    gridMaterial.update();
    gridRender.material = gridMaterial;
    this.app.root.addChild(grid);

    // Perpendicular grid lines
    const grid2 = new Entity('grid2');
    const grid2Render = grid2.addComponent('render', { type: 'box' });
    grid2.setLocalScale(0.015, 0.01, 20);
    grid2.setPosition(0, -0.47, 0);
    grid2Render.material = gridMaterial.clone();
    grid2Render.material.update();
    this.app.root.addChild(grid2);

    // Add multiple grid lines for a full grid pattern
    for (let i = -8; i <= 8; i++) {
      if (i === 0) continue;

      const gx = new Entity('gx' + i);
      const gxRender = gx.addComponent('render', { type: 'box' });
      gx.setLocalScale(20, 0.01, 0.008);
      gx.setPosition(0, -0.47, i);
      const gxMat = gridMaterial.clone();
      gxMat.diffuse = new Color(0.0, 0.35, 0.15);
      gxMat.emissive = new Color(0.0, 0.2, 0.1);
      gxMat.emissiveIntensity = 0.3;
      gxMat.update();
      gxRender.material = gxMat;
      this.app.root.addChild(gx);

      const gz = new Entity('gz' + i);
      const gzRender = gz.addComponent('render', { type: 'box' });
      gz.setLocalScale(0.008, 0.01, 20);
      gz.setPosition(i, -0.47, 0);
      const gzMat = gxMat.clone();
      gzRender.material = gzMat;
      this.app.root.addChild(gz);
    }
  }

  createCamera() {
    const camera = new Entity('camera');
    this.cameraComponent = camera.addComponent('camera', {
      clearColor: new Color(0.03, 0.03, 0.04)
    });
    this.cameraNode = camera;
    this.app.root.addChild(camera);
    camera.setPosition(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z);
    camera.lookAt(new Vec3(0, 0, 0));
  }

updateCamera(dt) {
    const off = this.cameraOffset;
    const target = this.cameraTargetMid;
    const lerpFactor = 1 - Math.exp(-4 * (dt || 0.016));

    // Calculate zoom scale based on player spread
    let zoomScale = 1;
    if (this._playerPositions.length >= 2) {
      const p0 = this._playerPositions[0];
      const p1 = this._playerPositions[1];
      const dist = Math.sqrt(
        (p1.x - p0.x) ** 2 + (p1.z - p0.z) ** 2
      );
      // Scale up when players are far apart
      zoomScale = 1 + Math.max(0, dist - 10) * 0.08;
    }

    const baseY = this.cameraBaseY * zoomScale;
    const baseZ = this.cameraBaseZ * zoomScale;
    const baseX = 0;
    const pos = this.cameraNode.getPosition();
    this.cameraNode.setPosition(
      pos.x + (baseX + target.x * this.cameraFollowFactor - pos.x) * lerpFactor,
      pos.y + (baseY - pos.y) * lerpFactor,
      pos.z + (baseZ + target.z * this.cameraFollowFactor - pos.z) * lerpFactor
    );
  }

  setPlayerPositions(positions) {
    this._playerPositions = positions;
  }



  createBoundaryWalls() {
    const wallMat = new StandardMaterial();
    wallMat.diffuse = new Color(0.4, 0.4, 0.4);
    wallMat.emissive = new Color(0.3, 0.0, 0.0);
    wallMat.emissiveIntensity = 0.3;
    wallMat.alphaWrite = false;
    wallMat.blendType = 2;
    wallMat.opacity = 0.25;
    wallMat.receiveShadows = true;
    wallMat.update();

    const wallEdgeMat = new StandardMaterial();
    wallEdgeMat.diffuse = new Color(1.0, 0.15, 0.15);
    wallEdgeMat.emissive = new Color(0.8, 0.1, 0.1);
    wallEdgeMat.emissiveIntensity = 1.0;
    wallEdgeMat.update();

    // 4 boundary walls
    const halfSize = 10;
    const wallThickness = 0.1;
    const wallHeight = 0.6;

    const walls = [
      { pos: [0, -0.2, -halfSize], scale: [20 + wallThickness * 2, wallHeight, wallThickness] },
      { pos: [0, -0.2, halfSize], scale: [20 + wallThickness * 2, wallHeight, wallThickness] },
      { pos: [-halfSize, -0.2, 0], scale: [wallThickness, wallHeight, 20 + wallThickness * 2] },
      { pos: [halfSize, -0.2, 0], scale: [wallThickness, wallHeight, 20 + wallThickness * 2] }
    ];

    walls.forEach((w, i) => {
      const wall = new Entity('wall' + i);
      const render = wall.addComponent('render', { type: 'box' });
      wall.setLocalScale(...w.scale);
      wall.setPosition(...w.pos);
      render.material = wallMat.clone();
      render.material.update();
      this.app.root.addChild(wall);
    });
  }

  setupPostProcessing() {
  }

  applyPostProcessing() {
    this.cameraFrame = new CameraFrame(this.app, this.cameraComponent);
    this.cameraFrame.rendering.toneMapping = TONEMAP_ACES;
    this.cameraFrame.bloom.intensity = 0.10;
    this.cameraFrame.taa.enabled = true;
    this.cameraFrame.taa.jitter = 1;
    this.cameraFrame.update();
  }

  createGlowingPlayer(color, emissiveColor) {
    const entity = new Entity('glowingPlayer');
    const render = entity.addComponent('render', { type: 'box' });
    const material = new StandardMaterial();
    material.diffuse = color;
    material.emissive = emissiveColor;
    material.emissiveIntensity = 0.8;
    material.roughness = 0.3;
    material.metalness = 0.7;
    material.castShadows = true;
    material.receiveShadows = true;
    material.update();
    render.material = material;
    entity.setLocalScale(0.5, 0.5, 0.5);

    // Wireframe edge overlay
    const edges = new Entity('edges');
    const edgeRender = edges.addComponent('render', { type: 'box' });
    const edgeMat = new StandardMaterial();
    edgeMat.diffuse = emissiveColor;
    edgeMat.emissive = emissiveColor;
    edgeMat.emissiveIntensity = 1.0;
    edgeMat.update();
    edgeRender.material = edgeMat;
    edges.setLocalScale(0.52, 0.52, 0.52);
    edges.render.material = edgeMat;

    entity.addChild(edges);
    this.app.root.addChild(entity);
    return entity;
  }
}
