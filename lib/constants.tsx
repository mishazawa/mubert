export const FFT_SIZE = 64;
export const ENV_MAP_RESOLUTION = 256;
export const SPEED = 10; // suppose to be bpm?
export const SPEED_MULTIPLIER = 0.001;
export const MESH_DETAIL = 64;
export const POINT_DETAIL_DIVIDER = 4;
export const AMBIENT_LIGHT_COLOR = 0x404040;
export const SHADER_STYLE = ["solid", "point", "wireframe"] as const;
export const VALID_RANGES: Record<string, [number, number]> = {
  use_key: [0, 0], // not included 2
  key_value: [0, 2], // not included 2
  color_noise: [0.5, 20],
  displacement_noise: [0.01, 2],
  amplitude: [0.01, 0.1],
  roughness: [0, 1],
  clearcoat: [0, 0],
  cc_roughness: [0, 1],
  iridescence: [0, 5],
  uLineCount: [0, 5],
  uStripesWidth: [0, 1],
};
export const FBO_SIZE = 64;
export const AUDIO_TEXTURE_SIZE = 256;
export const PARTICLES_CAMERA_ZOOM = 20;
export const PARTICLES_SIZE_RENDER_PASS = 1;
export const DOF_FOCUS_LENGTH = 0.03;
export const DOF_BOKEH_SCALE = 3;
export const FX_NOISE_SCALE = 0.02;
export const CAMERA_FOV = 45;
export const CAMERA_DISTANCE = 7;
