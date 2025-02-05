import { GLTFLoader } from 'https://unpkg.com/three@0.147.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.147.0/examples/jsm/loaders/DRACOLoader.js';
import {
  Vector3,
  Box3,
} from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import { CAR_SETTINGS, MOVE_MAP } from '../constants/carConstants.js';
import BackgroundManager from '../managers/BackgroundManager.js';
import ColorPickerManager from '../managers/ColorPickerManager.js';

export default class CarController {
  #mesh;
  #wheels = [];
  #keyCodeMap = new Map();
  #carSize;
  #carMaterial;
  keydownListener;
  keyupListener;

  static async create(scene) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    );

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    return new Promise((resolve, reject) => {
      loader.load(
        CAR_SETTINGS.MODEL_URL,
        (gltf) => {
          scene.add(gltf.scene);
          resolve(new CarController(gltf.scene));
        },
        (xhr) => {
          console.log(parseInt((xhr.loaded / xhr.total) * 100) + '% 로딩됨');
        },
        (error) => {
          console.error('모델 로딩 중 오류가 발생했습니다:', error);
          reject(error);
        }
      );
    });
  }

  constructor(mesh) {
    this.#mesh = mesh;
    this.#initializeWheels();
    this.#initializeCarMaterial();
    new ColorPickerManager(this);

    const carBox = new Box3().setFromObject(this.#mesh);
    this.#carSize = {
      width: carBox.max.x - carBox.min.x,
      length: carBox.max.z - carBox.min.z,
    };

    this.keydownListener = (event) => this.handleKeyDown(event);
    this.keyupListener = (event) => this.handleKeyUp(event);

    window.addEventListener('keydown', this.keydownListener);
    window.addEventListener('keyup', this.keyupListener);
  }

  handleKeyDown(event) {
    if (MOVE_MAP.has(event.keyCode) && !this.#keyCodeMap[event.keyCode]) {
      this.#keyCodeMap[event.keyCode] = true;
    }
  }

  handleKeyUp(event) {
    if (MOVE_MAP.has(event.keyCode)) {
      this.#keyCodeMap[event.keyCode] = false;
    }
  }

  #initializeWheels() {
    const carModel = this.#mesh.children[0];
    this.#wheels.push(
      carModel.getObjectByName('wheel_fl'),
      carModel.getObjectByName('wheel_fr'),
      carModel.getObjectByName('wheel_rl'),
      carModel.getObjectByName('wheel_rr')
    );
  }

  #initializeCarMaterial() {
    const carBody = this.#mesh.children[0].getObjectByName('body');
    if (carBody && carBody.material) {
      this.#carMaterial = carBody.material;
    }
  }

  changeColor(color) {
    if (this.#carMaterial) {
      this.#carMaterial.color.set(color);
    }
  }

  validateKeyInput() {
    const pressedCount = Object.values(this.#keyCodeMap).filter(Boolean).length;

    if (pressedCount === 0) return false;
    if (pressedCount > CAR_SETTINGS.KEY_LIMIT) {
      Object.keys(this.#keyCodeMap).forEach(
        (key) => (this.#keyCodeMap[key] = false)
      );
      alert('4개 이상의 방향키가 눌렸습니다.');
      return false;
    }
    return true;
  }

  updateRotation() {
    if (this.#keyCodeMap[CAR_SETTINGS.CONTROLS.LEFT])
      this.#mesh.rotation.y += CAR_SETTINGS.TURN_SPEED;
    if (this.#keyCodeMap[CAR_SETTINGS.CONTROLS.RIGHT])
      this.#mesh.rotation.y -= CAR_SETTINGS.TURN_SPEED;
  }

  calculateMovement() {
    const moveVector = new Vector3(0, 0, 0);

    if (this.#keyCodeMap[CAR_SETTINGS.CONTROLS.FORWARD])
      moveVector.z -= CAR_SETTINGS.MOVE_SPEED;
    if (this.#keyCodeMap[CAR_SETTINGS.CONTROLS.BACKWARD])
      moveVector.z += CAR_SETTINGS.MOVE_SPEED;

    moveVector.applyQuaternion(this.#mesh.quaternion);
    return moveVector;
  }

  checkCollision(newPosition) {
    if (!this.#mesh) return false;

    for (const wall of BackgroundManager.getInstance().get('walls')) {
      const wallPosition = wall.position;
      const wallSize = {
        width: wall.geometry.parameters.width,
        length: wall.geometry.parameters.depth,
      };

      if (
        newPosition.x - this.#carSize.width / 2 <
          wallPosition.x + wallSize.width / 2 &&
        newPosition.x + this.#carSize.width / 2 >
          wallPosition.x - wallSize.width / 2 &&
        newPosition.z - this.#carSize.length / 2 <
          wallPosition.z + wallSize.length / 2 &&
        newPosition.z + this.#carSize.length / 2 >
          wallPosition.z - wallSize.length / 2
      ) {
        return true;
      }
    }
    return false;
  }

  updatePosition(moveVector) {
    const newPosition = this.#mesh.position.clone().add(moveVector);
    if (!this.checkCollision(newPosition)) {
      this.#mesh.position.copy(newPosition);
    }
  }

  updateWheels(time) {
    this.#wheels.forEach((wheel) => {
      wheel.rotation.x = -CAR_SETTINGS.WHEEL_ROTATION_SPEED * time;
    });
  }

  update(time) {
    if (!this.validateKeyInput()) return;

    if (
      this.#keyCodeMap[CAR_SETTINGS.CONTROLS.LEFT] ||
      this.#keyCodeMap[CAR_SETTINGS.CONTROLS.RIGHT]
    ) {
      this.updateRotation();
    }

    const moveVector = this.calculateMovement();
    this.updatePosition(moveVector);
    this.updateWheels(time);
  }

  getMesh() {
    return this.#mesh;
  }

  dispose() {
    window.removeEventListener('keydown', this.keydownListener);
    window.removeEventListener('keyup', this.keyupListener);
  }
}
