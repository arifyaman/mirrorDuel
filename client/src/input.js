import { Vec3 } from 'playcanvas';

export class Input {
  constructor(canvas, network) {
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this._rayOrigin = new Vec3();
    this._rayDir = new Vec3();
    this._intersection = new Vec3();
    this._cam = null;
    this._canvas = canvas;
  }

  setCamera(cameraComponent) {
    this._cam = cameraComponent.camera;
  }

  init() {
    window.addEventListener('keydown', e => this.keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);

    this._canvas.addEventListener('mousemove', e => this.onMouseMove(e));
    this._canvas.addEventListener('mousedown', e => { if (e.button === 0) this.mouseDown = true; });
    this._canvas.addEventListener('mouseup', e => { if (e.button === 0) this.mouseDown = false; });
  }

  onMouseMove(e) {
    const rect = this._canvas.getBoundingClientRect();
    const cam = this._cam;
    if (!cam) return;

    const from = this._rayOrigin;
    const to = this._rayDir;
    cam.screenToWorld(
      e.clientX - rect.left, e.clientY - rect.top,
      cam.nearClip, rect.width, rect.height, from
    );
    cam.screenToWorld(
      e.clientX - rect.left, e.clientY - rect.top,
      cam.farClip, rect.width, rect.height, to
    );

    this._rayDir.sub(to, from).normalize();

    const planeY = -0.5;
    if (Math.abs(this._rayDir.y) > 0.001) {
      const t = (planeY - this._rayOrigin.y) / this._rayDir.y;
      this._intersection.copy(this._rayOrigin).addScaled(this._rayDir, t);
      this.mouseX = this._intersection.x;
      this.mouseY = this._intersection.z;
    }
  }
}
