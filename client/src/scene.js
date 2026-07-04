import { Color, Entity, StandardMaterial, Vec3, CameraFrame, TONEMAP_ACES } from 'playcanvas';

export class Scene {
  constructor(app) {
    this.app = app;
    this.cameraNode = null;
    this.cameraComponent = null;
    this.createFloor();
    this.createCamera();
    this.createLight();
    this.setupPostProcessing();
  }

  createFloor() {
    const floor = new Entity('floor');
    const floorRender = floor.addComponent('render', { type: 'box' });
    floor.setLocalScale(10, 0.1, 10);
    floor.setPosition(0, -0.5, 0);
    const floorMaterial = new StandardMaterial();
    floorMaterial.diffuse = new Color(0.75, 0.75, 0.75);
    floorMaterial.receiveShadows = true;
    floorMaterial.update();
    floorRender.material = floorMaterial;
    this.app.root.addChild(floor);
  }

  createCamera() {
    const camera = new Entity('camera');
    this.cameraComponent = camera.addComponent('camera', {
      clearColor: new Color(0.1, 0.2, 0.3)
    });
    this.cameraNode = camera;
    this.app.root.addChild(camera);
    camera.setPosition(0, 10, 10);
    camera.lookAt(new Vec3(0, 0, 0));
  }

  createLight() {
    const directionalLight = new Entity('sun');
    directionalLight.addComponent('light', {
      type: 'directional',
      color: new Color(1, 0.95, 0.8),
      intensity: 2,
      castShadows: true,
      shadowBias: 0.3,
      normalOffsetBias: 0.02,
      shadowResolution: 2048,
      shadowDistance: 20,
      shadowType: 'pc.SHADOW_SOFT'
    });
    this.app.root.addChild(directionalLight);
    directionalLight.setEulerAngles(45, -30, 0);
    directionalLight.setPosition(5, 15, 5);
  }

  setupPostProcessing() {
  }

  applyPostProcessing() {
    this.cameraFrame = new CameraFrame(this.app, this.cameraComponent);
    this.cameraFrame.rendering.toneMapping = TONEMAP_ACES;
    this.cameraFrame.bloom.intensity = 0.02;
    this.cameraFrame.taa.enabled = true;
    this.cameraFrame.taa.jitter = 1;
    this.cameraFrame.update();
  }
}
