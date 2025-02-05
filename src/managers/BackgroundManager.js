import {
  PlaneGeometry,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
} from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import { PLANE, WALL } from '../constants/background.js';

export default class BackgroundManager {
  static instance = null;
  #scene;
  #walls = [];
  constructor(scene) {
    if (BackgroundManager.instance) {
      return BackgroundManager.instance;
    }
    BackgroundManager.instance = this;
    this.#scene = scene;
    this.#initialize();
  }

  static getInstance() {
    if (!BackgroundManager.instance) {
      BackgroundManager.instance = new BackgroundManager();
    }
    return BackgroundManager.instance;
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
    this.#scene.add(plane);
  }

  #setupWalls() {
    const wallMaterial = new MeshBasicMaterial({
      color: WALL.COLOR,
      transparent: true,
      opacity: WALL.OPACITY,
    });

    const wallConfigs = [
      [new BoxGeometry(WALL.THICKNESS, WALL.HEIGHT, WALL.DEPTH), -20, 0],
      [new BoxGeometry(WALL.THICKNESS, WALL.HEIGHT, WALL.DEPTH), 20, 0],
      [new BoxGeometry(WALL.DEPTH, WALL.HEIGHT, WALL.THICKNESS), 0, -20],
      [new BoxGeometry(WALL.DEPTH, WALL.HEIGHT, WALL.THICKNESS), 0, 20],
    ];

    wallConfigs.forEach(([geometry, x, z]) => {
      const wall = new Mesh(geometry, wallMaterial);
      wall.position.set(x, 0, z);
      this.#scene.add(wall);
      this.#walls.push(wall);
    });
  }

  getWalls() {
    return this.#walls;
  }
}
