varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;
  vDisplacement = 0.0;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}