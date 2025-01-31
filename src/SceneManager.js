
import { getContainerSize } from './utils.js';
import {  PerspectiveCamera, DirectionalLight, PlaneGeometry, Mesh, MeshBasicMaterial } from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.147.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.147.0/examples/jsm/loaders/DRACOLoader.js';
const FERRARI_MODEL_URL = './assets/ferrari.glb'; 

export default class SceneManager {
  static #ROTATION_SPEED = 0.001;
  static #MOVE_SPEED = 0.05;

  CAMERA_POSITION_Z = 5;
  CAMERA_FOV = 70;
  CAMERA_DISTANCE = [0.1, 100];
  MOVE_MAP = new Map([
    [87, ['z', -1]], //w
    [83, ['z', 1]], //s
    [65, ['x', -1]], //a
    [68, ['x', 1]], //d
    [81, ['y', 1]], //q
    [69, ['y', -1]], //e
  ]);

  #scene;
  #camera;
  #mesh;
  #wheels = [];

  constructor(scene) {
    this.#scene = scene;
    this.#setupCamera();
    this.#setupLight();
    this.#setupModel();
  }

  #setupCamera() {
    const { width, height } = getContainerSize();

    const camera = new PerspectiveCamera(
      this.CAMERA_FOV,
      width / height,
      ...this.CAMERA_DISTANCE
    );

    camera.position.z = this.CAMERA_POSITION_Z;
    this.#camera = camera;
  }

  #setupLight() {
    const COLOR = 0xffffff;
    const INTENSITY = 1;
    const POSITION = [-1, 2, 4];

    const light = new DirectionalLight(COLOR, INTENSITY);
    light.position.set(...POSITION);
    this.#scene.add(light);
  }

  #setupModel() {
    const planeGeometry = new PlaneGeometry(100, 100);
    const planeMaterial = new MeshBasicMaterial({ color: 'white' });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    this.#scene.add(plane);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(
      FERRARI_MODEL_URL, 
      (gltf) => {
        this.#scene.add(gltf.scene);
        this.#mesh = gltf.scene;
    
        this.#mesh.position.y = -1;
        const carModel = gltf.scene.children[0];

        this.#wheels.push(
          carModel.getObjectByName('wheel_fl'),
          carModel.getObjectByName('wheel_fr'),
          carModel.getObjectByName('wheel_rl'),
          carModel.getObjectByName('wheel_rr')
        );
      },
      (xhr) => {
        console.log(parseInt((xhr.loaded / xhr.total) * 100) + '% 로딩됨');
      },
      (error) => {
        console.error('모델 로딩 중 오류가 발생했습니다:', error);
      }
    );
  }


  updatePosition(keyCodeMap, time) {
    let pressedCount = 0;
    for (const isPressed of Object.values(keyCodeMap)) {
      if (isPressed) pressedCount++;
    }

    if (pressedCount === 0) return;
    if (pressedCount > 3) {
      Object.keys(keyCodeMap).forEach((key) => (keyCodeMap[key] = false));
      alert('4개 이상의 방향키가 눌렸습니다.');
      return;
    }

    Object.entries(keyCodeMap).forEach(([key, isPressed]) => {
      if (isPressed) {
        const [axis, direction] = this.MOVE_MAP.get(+key);
        this.#mesh.position[axis] += SceneManager.#MOVE_SPEED * direction;
      }
    });

    this.#wheels.forEach((wheel) => {
      wheel.rotation.x = -0.005 * time;
    });
  }

  getCamera() {
    return this.#camera;
  }
}
