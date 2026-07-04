import { Vec3 } from 'playcanvas';

export class Input {
  constructor(canvas, network) {
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.fire = false;
    this._rayOrigin = new Vec3();
    this._rayDir = new Vec3();
    this._cam = null;
    this._canvas = canvas;
  }

  setCamera(cameraComponent) {
    this._cam = cameraComponent.camera;
  }

  init() {
    window.addEventListener('keydown', e => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'r') this.fire = true;
    });
    window.addEventListener('keyup', e => {
      this.keys[e.key.toLowerCase()] = false;
      if (e.key.toLowerCase() === 'r') this.fire = false;
    });

    this._canvas.addEventListener('mousemove', e => this.onMouseMove(e));
    this._canvas.addEventListener('mousedown', e => { if (e.button === 0) this.mouseDown = true; });
    this._canvas.addEventListener('mouseup', e => { if (e.button === 0) this.mouseDown = false; });
  }

  onMouseMove(e) {
    const rect = this._canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const screenX = (e.clientX - rect.left) * dpr;
    const screenY = (e.clientY - rect.top) * dpr;
    const canvasW = this._canvas.width;
    const canvasH = this._canvas.height;

    const cam = this._cam;
    if (!cam) return;

    const from = this._rayOrigin;
    const to = this._rayDir;
    cam.screenToWorld(screenX, screenY, cam.nearClip, canvasW, canvasH, from);
    cam.screenToWorld(screenX, screenY, cam.farClip, canvasW, canvasH, to);

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;

    const planeY = -0.5;
    if (Math.abs(dy) > 0.001) {
      const t = (planeY - from.y) / dy;
      this.mouseX = from.x + dx * t;
      this.mouseY = from.z + dz * t;
    }
  }
}
