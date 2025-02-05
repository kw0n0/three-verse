import {
  PlaneGeometry,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
} from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import { PLANE, WALL } from '../constants/background.js';

export default class BackgroundManager {
  static #instance = null;
  #walls = [];
  #plane = null;

  constructor() {
    if (BackgroundManager.#instance) {
      return BackgroundManager.#instance;
    }

    BackgroundManager.#instance = this;
    this.#initialize();
  }

  static getInstance() {
    if (!BackgroundManager.#instance) {
      BackgroundManager.#instance = new BackgroundManager();
    }
    return BackgroundManager.#instance;
  }

  getElement(type) {
    switch (type) {
      case 'plane':
        return this.#plane;
      case 'walls':
        return this.#walls;
      default:
        return {
          plane: this.#plane,
          walls: this.#walls,
        };
    }
  }

  #initialize() {
    this.#setupPlane();
    this.#setupWalls();
  }

  #setupPlane() {
    const plane = new Mesh(
      new PlaneGeometry(PLANE.SIZE, PLANE.SIZE),
      new MeshBasicMaterial({ color: PLANE.COLOR })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = PLANE.POSITION_Y;
    this.#plane = plane;
  }

  #createWall(width, height, depth, x, z) {
    return {
      geometry: new BoxGeometry(width, height, depth),
      position: { x, y: WALL.HEIGHT / 2, z },
    };
  }

  #setupWalls() {
    const wallMaterial = new MeshBasicMaterial({
      color: WALL.COLOR,
      transparent: true,
      opacity: WALL.OPACITY,
    });

    const wallConfigs = [
      this.#createWall(WALL.THICKNESS, WALL.HEIGHT, WALL.DEPTH, -20, 0),
      this.#createWall(WALL.THICKNESS, WALL.HEIGHT, WALL.DEPTH, 20, 0),
      this.#createWall(WALL.DEPTH, WALL.HEIGHT, WALL.THICKNESS, 0, -20),
      this.#createWall(WALL.DEPTH, WALL.HEIGHT, WALL.THICKNESS, 0, 20),
    ];

    this.#walls = wallConfigs.map(({ geometry, position }) => {
      const wall = new Mesh(geometry, wallMaterial);
      wall.position.set(position.x, position.y, position.z);

      return wall;
    });
  }
}
