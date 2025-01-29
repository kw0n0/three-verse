import { WebGLRenderer, Scene } from 'three';
import TimeDisplay from './TimeDisplay.js';
import SceneManager from './SceneManager.js';
import { getContainerSize } from './utils.js';

class App {
  #renderer;
  #scene;
  #keyCodeMap = new Map();
  #timeDisplay;
  #sceneManager;

  constructor() {
    const divContainer = document.querySelector('#container');

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this.#renderer = renderer;

    const scene = new Scene();
    this.#scene = scene;

    this.#sceneManager = new SceneManager(scene);
    this.#timeDisplay = new TimeDisplay(scene);
    this.#timeDisplay.initialize();

    this.resize();
    this.render();

    window.addEventListener('resize', (event) => this.resize(event));
    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    window.addEventListener('keyup', (event) => this.handleKeyUp(event));
  }

  render(time) {
    this.#renderer.render(this.#scene, this.#sceneManager.getCamera());
    this.#sceneManager.updateRotation(time);
    this.#sceneManager.updatePosition(this.#keyCodeMap, time);
    this.#timeDisplay.update();

    requestAnimationFrame((time) => this.render(time));
  }

  resize() {
    const { width, height } = getContainerSize();
    const camera = this.#sceneManager.getCamera();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    this.#renderer.setSize(width, height);
  }

  handleKeyDown(event) {
    if (this.#sceneManager.MOVE_MAP.has(event.keyCode) && !this.#keyCodeMap[event.keyCode]) {
      this.#keyCodeMap[event.keyCode] = true;
    }
  }

  handleKeyUp(event) {
    if (this.#sceneManager.MOVE_MAP.has(event.keyCode)) {
      this.#keyCodeMap[event.keyCode] = false;
    }
  }
}

window.onload = () => {
  new App();
};
