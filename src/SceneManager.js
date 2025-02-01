import { DirectionalLight, PlaneGeometry, Mesh, MeshBasicMaterial } from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import CarController from './controllers/CarController.js';

export default class SceneManager {
  static #LIGHT = {
    COLOR: 0xffffff,
    INTENSITY: 1,
    POSITION: [-1, 2, 4]
  };

  static #PLANE = {
    SIZE: 100,
    COLOR: 'white',
    POSITION_Y: -1
  };

  #scene;
  #cameraController;
  #carController;

  constructor(scene, cameraController) {
    this.#scene = scene;
    this.#cameraController = cameraController;
    this.#setupLight();
    this.#setupModels();
  }

  #setupLight() {
    const light = new DirectionalLight(
      SceneManager.#LIGHT.COLOR, 
      SceneManager.#LIGHT.INTENSITY
    );
    light.position.set(...SceneManager.#LIGHT.POSITION);
    this.#scene.add(light);
  }

  #setupPlane() {
    const planeGeometry = new PlaneGeometry(SceneManager.#PLANE.SIZE, SceneManager.#PLANE.SIZE);
    const planeMaterial = new MeshBasicMaterial({ color: SceneManager.#PLANE.COLOR });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = SceneManager.#PLANE.POSITION_Y;
    this.#scene.add(plane);
  }

  async #setupModels() {
    this.#setupPlane();
    try {
      this.#carController = await CarController.create(this.#scene);
    } catch (error) {
      alert('자동차 모델 로딩 실패!');
      console.error('자동차 모델 로딩 실패:', error);
    }
  }

  updatePosition(time) {
    if(!this.#carController) return;
    
    this.#carController.update(time);
    this.#cameraController.update(this.#carController);
  }
}
