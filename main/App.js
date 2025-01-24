import * as THREE from '../three.js-master/build/three.module.js';

class App {
  static #ROTATION_SPEED = 0.001;
  static #MOVE_SPEED = 0.05;

  CAMERA_POSITION_Z = 5;
  CAMERA_FOV = 70; //카메라 시야각
  CAMERA_DISTANCE = [0.1, 100]; //카메라 최소/최대 거리

  #divContainer;
  #renderer;
  #scene;
  #camera;
  #mesh;
  #key;

  constructor() {
    const divContainer = document.querySelector('#container');
    this.#divContainer = divContainer;

    //경계선을 계단현상 없이 부드럽게 표현
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    //디바이스 해상도에 맞춰 렌더링
    renderer.setPixelRatio(window.devicePixelRatio);
    //canvas 타입의 dom 객체 추가
    divContainer.appendChild(renderer.domElement);
    this.#renderer = renderer;

    const scene = new THREE.Scene();
    this.#scene = scene;

    this.#setupCamera();
    this.#setupLight();
    this.#setupModel();
    this.resize();
    this.render();

    window.addEventListener('resize', (event) => this.resize(event));
    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    window.addEventListener('keyup', (event) => this.handleKeyUp(event));
  }

  render(time) {
    this.#renderer.render(this.#scene, this.#camera);
    this.#updateRotation(time);
    this.#updatePosition();

    requestAnimationFrame((time) => this.render(time));
  }

  resize() {
    const { width, height } = this.#getContainerSize();

    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();

    this.#renderer.setSize(width, height);
  }

  handleKeyDown(event) {
    this.#key = event.key;
  }

  handleKeyUp(event) {
    if (event.key === this.#key) {
      this.#key = null;
    }
  }

  #getContainerSize() {
    return {
      width: this.#divContainer.clientWidth,
      height: this.#divContainer.clientHeight,
    };
  }

  #setupCamera() {
    const { width, height } = this.#getContainerSize();

    const camera = new THREE.PerspectiveCamera(
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

    const light = new THREE.DirectionalLight(COLOR, INTENSITY);
    light.position.set(...POSITION);
    this.#scene.add(light);
  }

  #setupModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = {
      fill: new THREE.MeshStandardMaterial({ color: 'red' }),
      line: new THREE.LineBasicMaterial({ color: 'white' }),
    };

    const cube = new THREE.Mesh(geometry, materials.fill);
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      materials.line
    );

    //그룹화로 중복되는 객체별 작업 제거
    const meshGroup = new THREE.Group();
    meshGroup.add(cube);
    meshGroup.add(wireframe);

    this.#scene.add(meshGroup);
    this.#mesh = meshGroup;
  }

  #updateRotation(time) {
    this.#mesh.rotation.x = time * App.#ROTATION_SPEED;
    this.#mesh.rotation.y = time * App.#ROTATION_SPEED;
  }

  #updatePosition() {
    switch (this.#key) {
      case 'w':
        this.#mesh.position.z -= App.#MOVE_SPEED;
        break;
      case 's':
        this.#mesh.position.z += App.#MOVE_SPEED;
        break;
      case 'a':
        this.#mesh.position.x -= App.#MOVE_SPEED;
        break;
      case 'd':
        this.#mesh.position.x += App.#MOVE_SPEED;
        break;
      case 'q':
        this.#mesh.position.y += App.#MOVE_SPEED;
        break;
      case 'e':
        this.#mesh.position.y -= App.#MOVE_SPEED;
        break;
      default:
        this.#key = null;
        break;
    }
  }
}

window.onload = () => {
  new App();
};
