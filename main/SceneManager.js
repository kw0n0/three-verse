import {
  DirectionalLight,
  PerspectiveCamera,
  Mesh,
  MeshStandardMaterial,
  LineBasicMaterial,
  LineSegments,
  Group,
  TorusGeometry,
  WireframeGeometry,
} from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r126/three.module.min.js';
import { getContainerSize } from './utils.js';

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
    const geometry = new TorusGeometry(0.9, 0.3, 10, 150);

    const materials = {
      fill: new MeshStandardMaterial({ color: 'gold' }),
      line: new LineBasicMaterial({ color: 'orange' }),
    };

    const cube = new Mesh(geometry, materials.fill);
    const wireframe = new LineSegments(
      new WireframeGeometry(geometry),
      materials.line
    );

    //그룹화로 중복되는 객체별 작업 제거
    const meshGroup = new Group();
    meshGroup.add(cube);
    meshGroup.add(wireframe);

    this.#scene.add(meshGroup);
    this.#mesh = meshGroup;
  }

  updateRotation(time) {
    this.#mesh.rotation.x = time * SceneManager.#ROTATION_SPEED;
    this.#mesh.rotation.y = time * SceneManager.#ROTATION_SPEED;
  }

  updatePosition(keyCodeMap) {
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
  }

  getCamera() {
    return this.#camera;
  }
}
