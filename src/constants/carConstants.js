export const CAR_SETTINGS = {
  MODEL_URL: './assets/models/ferrari.glb',
  KEY_LIMIT: 3,
  MOVE_SPEED: 0.2,
  TURN_SPEED: 0.01,
  WHEEL_ROTATION_SPEED: 0.005,
  CONTROLS: {
    FORWARD: 87, // w
    BACKWARD: 83, // s
    LEFT: 65, // a
    RIGHT: 68, // d
  }
};

export const MOVE_MAP = new Map([
  [CAR_SETTINGS.CONTROLS.FORWARD, 'forward'],
  [CAR_SETTINGS.CONTROLS.BACKWARD, 'backward'],
  [CAR_SETTINGS.CONTROLS.LEFT, 'left'],
  [CAR_SETTINGS.CONTROLS.RIGHT, 'right'],
]); 