import {
  PerspectiveCamera,
  Vector3,
} from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import { CAMERA_SETTINGS } from '../constants/cameraConstants.js';

export default class CameraController {
  static #instance = null;
  #camera;

  constructor() {
    if (CameraController.#instance) {
      return CameraController.#instance;
    }
    this.#camera = new PerspectiveCamera(
      CAMERA_SETTINGS.FOV,
      CAMERA_SETTINGS.WIDTH / CAMERA_SETTINGS.HEIGHT,
      ...CAMERA_SETTINGS.DISTANCE
    );
    this.#camera.position.z = CAMERA_SETTINGS.POSITION_Z;
    CameraController.#instance = this;
  }

  static getInstance() {
    if (!CameraController.#instance) {
      CameraController.#instance = new CameraController();
    }
    return CameraController.#instance;
  }

  #calculateCameraOffset(targetMesh) {
    const cameraOffset = new Vector3(
      CAMERA_SETTINGS.OFFSET.X,
      CAMERA_SETTINGS.OFFSET.Y,
      CAMERA_SETTINGS.OFFSET.Z
    );
    cameraOffset.applyQuaternion(targetMesh.quaternion);
    return cameraOffset;
  }

  update(carController) {
    if (!carController) return;

    const car = carController.getElement();
    const cameraOffset = this.#calculateCameraOffset(car);
    const cameraPosition = car.position.clone().add(cameraOffset);

    this.#camera.position.lerp(cameraPosition, 0.1);
    this.#camera.lookAt(car.position);
  }

  getCamera() {
    return this.#camera;
  }
}
