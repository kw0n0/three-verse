import { DirectionalLight } from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import CarController from './controllers/CarController.js';
import BackgroundManager from './managers/BackgroundManager.js';

const LIGHT = {
  COLOR: 0xffffff,
  INTENSITY: 1,
  POSITION: [-1, 2, 4],
};

export default class SceneManager {
  #scene;
  #cameraController;
  #carController;

  constructor(scene, cameraController) {
    this.#scene = scene;
    this.#cameraController = cameraController;
    this.#setupLight();
    this.#setupModels();
    new BackgroundManager(this.#scene);
  }

  #setupLight() {
    const light = new DirectionalLight(LIGHT.COLOR, LIGHT.INTENSITY);
    light.position.set(...LIGHT.POSITION);
    this.#scene.add(light);
  }

  async #setupModels() {
    try {
      this.#carController = await CarController.create(this.#scene);
    } catch (error) {
      alert('자동차 모델 로딩 실패!');
      console.error('자동차 모델 로딩 실패:', error);
    }
  }

  updatePosition(time) {
    if (!this.#carController) return;

    this.#carController.update(time);
    this.#cameraController.update(this.#carController);
  }
}
