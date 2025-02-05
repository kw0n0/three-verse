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
    this.#setupBackground();
    this.#setupModels();
  }

  #setupLight() {
    const light = new DirectionalLight(LIGHT.COLOR, LIGHT.INTENSITY);
    light.position.set(...LIGHT.POSITION);
    this.#scene.add(light);
  }

  #setupBackground() {
    const background = BackgroundManager.getInstance().getElement();
    Object.values(background).forEach((obj) => {
      if (Array.isArray(obj)) {
        obj.forEach((item) => this.#scene.add(item));
      } else {
        this.#scene.add(obj);
      }
    });
  }

  async #setupModels() {
    //FIXME: 에러처리 보류
    this.#carController = await new CarController().initialize();
    this.#scene.add(this.#carController.getElement());
  }

  updatePosition(time) {
    if (!this.#carController) return;

    this.#carController.update(time);
    this.#cameraController.update(this.#carController);
  }
}
