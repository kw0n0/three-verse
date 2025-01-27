import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r126/three.module.min.js';

class App {
  static #ROTATION_SPEED = 0.001;
  static #MOVE_SPEED = 0.05;
  static #FONT_CONFIG = {
    size: 0.5,
    height: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
  };

  CAMERA_POSITION_Z = 5;
  CAMERA_FOV = 70; //카메라 시야각
  CAMERA_DISTANCE = [0.1, 100]; //카메라 최소/최대 거리
  MOVE_MAP = new Map([
    [87, ['z', -1]], //w
    [83, ['z', 1]], //s
    [65, ['x', -1]], //a
    [68, ['x', 1]], //d
    [81, ['y', 1]], //q
    [69, ['y', -1]], //e
  ]);

  #divContainer;
  #renderer;
  #scene;
  #camera;
  #mesh;
  #timeMesh;
  #keyCodeMap = new Map();
  #font;

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
    this.#setupTimeModel();
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
    this.#updateTimeDisplay();

    requestAnimationFrame((time) => this.render(time));
  }

  resize() {
    const { width, height } = this.#getContainerSize();

    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();

    this.#renderer.setSize(width, height);
  }

  handleKeyDown(event) {
    if (this.MOVE_MAP.has(event.keyCode) && !this.#keyCodeMap[event.keyCode]) {
      this.#keyCodeMap[event.keyCode] = true;
    }
  }

  handleKeyUp(event) {
    if (this.MOVE_MAP.has(event.keyCode)) {
      this.#keyCodeMap[event.keyCode] = false;
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

  async #setupTimeModel() {
    const fontLoader = new THREE.FontLoader();

    const loadFont = (url) => {
      return new Promise((resolve, reject) => {
        fontLoader.load(
          url,
          (font) => resolve(font),
          (xhr) =>
            console.log(parseInt((xhr.loaded / xhr.total) * 100) + '% 로딩됨'),
          (error) => reject(error)
        );
      });
    };

    this.#font = await loadFont('./helvetiker_regular.typeface.json');

    const defaultGeometry = this.#createTextGeometry('00 : 00 : 00');
    const material = new THREE.MeshStandardMaterial({ color: 'gold' });
    this.#timeMesh = new THREE.Mesh(defaultGeometry, material);

    defaultGeometry.computeBoundingBox();
    const centerOffset =
      -0.5 *
      (defaultGeometry.boundingBox.max.x - defaultGeometry.boundingBox.min.x);
    this.#timeMesh.position.set(centerOffset, 2);
    this.#scene.add(this.#timeMesh);
    this.#updateTimeDisplay();
  }

  #createTextGeometry(text) {
    return new THREE.TextGeometry(text, {
      font: this.#font,
      ...App.#FONT_CONFIG,
    });
  }

  #formatCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')} : ${String(
      now.getMinutes()
    ).padStart(2, '0')} : ${String(now.getSeconds()).padStart(2, '0')}`;
  }

  #updateTimeDisplay() {
    if (!this.#timeMesh) return;

    if (this.#timeMesh.geometry) {
      this.#timeMesh.geometry.dispose();
    }

    const curTime = this.#formatCurrentTime();
    this.#timeMesh.geometry = this.#createTextGeometry(curTime);
  }

  #setupModel() {
    const geometry = new THREE.TorusGeometry(0.9, 0.3, 10, 150);

    const materials = {
      fill: new THREE.MeshStandardMaterial({ color: 'gold' }),
      line: new THREE.LineBasicMaterial({ color: 'orange' }),
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
    let pressedCount = 0;
    for (const isPressed of Object.values(this.#keyCodeMap)) {
      if (isPressed) pressedCount++;
    }

    if (pressedCount === 0) return;
    if (pressedCount > 3) {
      Object.keys(this.#keyCodeMap).forEach(
        (key) => (this.#keyCodeMap[key] = false)
      );
      alert('4개 이상의 방향키가 눌렸습니다.');
      return;
    }

    Object.entries(this.#keyCodeMap).forEach(([key, isPressed]) => {
      if (isPressed) {
        const [axis, direction] = this.MOVE_MAP.get(+key);
        this.#mesh.position[axis] += App.#MOVE_SPEED * direction;
      }
    });
  }
}

window.onload = () => {
  new App();
};
