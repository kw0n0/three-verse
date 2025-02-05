import {
  PerspectiveCamera,
  Vector3,
} from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import { CAMERA_SETTINGS } from '../constants/cameraConstants.js';

export default class CameraController {
  #camera;

  constructor(width, height) {
    this.#setupCamera(width, height);
  }

  #setupCamera(width, height) {
    this.#camera = new PerspectiveCamera(
      CAMERA_SETTINGS.FOV,
      width / height,
      ...CAMERA_SETTINGS.DISTANCE
    );
    this.#camera.position.z = CAMERA_SETTINGS.POSITION_Z;
  }

  update(targetController) {
    if (!targetController) return;

    const targetMesh = targetController.getMesh();
    const cameraOffset = new Vector3(
      CAMERA_SETTINGS.OFFSET.X,
      CAMERA_SETTINGS.OFFSET.Y,
      CAMERA_SETTINGS.OFFSET.Z
    );

    cameraOffset.applyQuaternion(targetMesh.quaternion);
    const cameraPosition = targetMesh.position.clone().add(cameraOffset);
    this.#camera.position.lerp(cameraPosition, 0.1);
    this.#camera.lookAt(targetMesh.position);
  }

  getCamera() {
    return this.#camera;
  }
}
