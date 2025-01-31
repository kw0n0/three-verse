import { getContainerSize } from './utils.js';
import {  PerspectiveCamera, DirectionalLight, PlaneGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'https://unpkg.com/three@0.147.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.147.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.147.0/examples/jsm/loaders/DRACOLoader.js';
const FERRARI_MODEL_URL = './assets/ferrari.glb'; 

export default class SceneManager {

  CAMERA_POSITION_Z = 5;
  CAMERA_FOV = 70;
  CAMERA_DISTANCE = [0.1, 100];
  MOVE_MAP = new Map([
    [87, 'forward'], // w
    [83, 'backward'], // s
    [65, 'left'], // a
    [68, 'right'], // d
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
    const MOVE_SPEED = 0.2;
    const TURN_SPEED = 0.01;

    if(!this.#mesh) return;
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

    if (keyCodeMap[65]) this.#mesh.rotation.y += TURN_SPEED;
    if (keyCodeMap[68]) this.#mesh.rotation.y -= TURN_SPEED;

    const moveVector = new Vector3(0, 0, 0);
    if (keyCodeMap[87]) moveVector.z -= MOVE_SPEED;
    if (keyCodeMap[83]) moveVector.z += MOVE_SPEED; 
    moveVector.applyQuaternion(this.#mesh.quaternion);

    const newPosition = this.#mesh.position.clone().add(moveVector);
    this.#mesh.position.copy(newPosition);

    const cameraOffset = new Vector3(0, 3, 10);
    cameraOffset.applyQuaternion(this.#mesh.quaternion);
    const cameraPosition = this.#mesh.position.clone().add(cameraOffset);
    this.#camera.position.lerp(cameraPosition, 0.1);
    this.#camera.lookAt(this.#mesh.position);

    this.#wheels.forEach((wheel) => {
      wheel.rotation.x = -0.005 * time;
    });
  }

  getCamera() {
    return this.#camera;
  }
}
