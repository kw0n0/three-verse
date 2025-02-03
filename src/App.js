import { WebGLRenderer, Scene } from 'three';
import TimeDisplay from './TimeDisplay.js';
import SceneManager from './SceneManager.js';
import { getContainerSize } from './utils.js';
import CameraController from './controllers/CameraController.js';

class App {
  #renderer;
  #scene;
  #timeDisplay;
  #sceneManager;
  #cameraController;
  boundRender;
  boundResize;

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

    this.boundRender = (event) => this.render(event);
    this.boundResize = () => this.resize();

    this.resize();
    this.render();

    window.addEventListener('resize', this.boundResize);
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

    requestAnimationFrame(this.boundRender);
  }

  dispose() {
    window.removeEventListener('resize', this.boundResize);
    
    this.#renderer.dispose();
    this.#scene.traverse(object => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
}

window.onload = () => {
  new App();
};
