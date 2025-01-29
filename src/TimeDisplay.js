import {
  Mesh,
  MeshStandardMaterial,
  LineBasicMaterial,
  LineSegments,
  Group,
  WireframeGeometry,
  TextGeometry,
  FontLoader,
} from 'three';


class TimeDisplay {
  static #FONT_CONFIG = {
    size: 0.5,
    height: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.02,
  };

  #timeMesh;
  #font;
  #scene;

  constructor(scene) {
    this.#scene = scene;
  }

  async initialize() {
    await this.#loadFont();
    await this.#setupTimeModel();
  }

  async #loadFont() {
    const fontLoader = new FontLoader();
    return new Promise((resolve, reject) => {
      fontLoader.load(
        './assets/fonts/helvetiker_regular.typeface.json',
        (font) => {
          this.#font = font;
          resolve(font);
        },
        (xhr) =>
          console.log(parseInt((xhr.loaded / xhr.total) * 100) + '% 로딩됨'),
        (error) => reject(error)
      );
    });
  }

  #setupTimeModel() {
    const defaultGeometry = this.#createTextGeometry('00 : 00 : 00');
    const material = new MeshStandardMaterial({ color: 'red' });

    const textMesh = new Mesh(defaultGeometry, material);
    const wireframe = new LineSegments(
      new WireframeGeometry(defaultGeometry),
      new LineBasicMaterial({ color: 'tomato' })
    );

    const timeGroup = new Group();
    timeGroup.add(textMesh);
    timeGroup.add(wireframe);
    this.#timeMesh = timeGroup;

    defaultGeometry.computeBoundingBox();
    const centerOffset =
      -0.5 *
      (defaultGeometry.boundingBox.max.x - defaultGeometry.boundingBox.min.x);
    this.#timeMesh.position.set(centerOffset, 2);
    this.#scene.add(this.#timeMesh);
  }

  #createTextGeometry(text) {
    return new TextGeometry(text, {
      font: this.#font,
      ...TimeDisplay.#FONT_CONFIG,
    });
  }

  #formatCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')} : ${String(
      now.getMinutes()
    ).padStart(2, '0')} : ${String(now.getSeconds()).padStart(2, '0')}`;
  }

  update() {
    if (!this.#timeMesh) return;

    // 기존 지오메트리 제거
    this.#timeMesh.children.forEach((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
    });

    const curTime = this.#formatCurrentTime();
    const newGeometry = this.#createTextGeometry(curTime);

    const textMesh = this.#timeMesh.children[0];
    const wireframe = this.#timeMesh.children[1];

    textMesh.geometry = newGeometry;
    wireframe.geometry = new WireframeGeometry(newGeometry);
  }
}

export default TimeDisplay;
