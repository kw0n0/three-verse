import { WebGLRenderer, Scene } from 'three';
import TimeDisplay from './TimeDisplay.js';
import SceneManager from './SceneManager.js';
import { getContainerSize } from './utils.js';

class App {
  #renderer;
  #scene;
  #timeDisplay;
  #sceneManager;
  #cameraController;

  constructor() {
    const divContainer = document.querySelector('#container');

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this.#renderer = renderer;

    const scene = new Scene();
    this.#scene = scene;

    this.#cameraController = new CameraController(getContainerSize());
    this.#sceneManager = new SceneManager(scene, this.#cameraController);
    this.#timeDisplay = new TimeDisplay(scene);
    this.#timeDisplay.initialize();

    this.resize();
    this.render();

    window.addEventListener('resize', (event) => this.resize(event));
  }

  resize() {
    const { width, height } = getContainerSize();
    const camera = this.#cameraController.getCamera();
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    this.#renderer.setSize(width, height);
  }

  render(time) {
    this.#renderer.render(this.#scene, this.#cameraController.getCamera());
    this.#sceneManager.updatePosition(time);
    this.#timeDisplay.update();

    requestAnimationFrame((time) => this.render(time));
  }
}

window.onload = () => {
  new App();
};
