float fit(float unscaled, float originalMin, float originalMax, float minAllowed, float maxAllowed) {
  return (maxAllowed - minAllowed) * (unscaled - originalMin) / (originalMax - originalMin) + minAllowed;
}

/* 
* SMOOTH MOD
* - authored by @charstiles -
* based on https://math.stackexchange.com/questions/2491494/does-there-exist-a-smooth-approximation-of-x-bmod-y
* (axis) input axis to modify
* (amp) amplitude of each edge/tip
* (rad) radius of each edge/tip
* returns => smooth edges
*/

float smoothMod(float axis, float amp, float rad){
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}


mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat4(
		oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
		0.0,                                0.0,                                0.0,                                1.0
	);
}

vec2 rotate2d(vec2 a, float angle) {
  return vec2(cos(angle) * a.x - sin(angle) * a.y, sin(angle) * a.x + cos(angle) * a.y);
}

vec3 rotate3d(vec3 a, vec3 c) {
  vec4 b = vec4(a, 1.0);
  b = rotation3d(vec3(1.0, 0.0, 0.0), c.x) * b;
  b = rotation3d(vec3(0.0, 1.0, 0.0), c.y) * b;
  b = rotation3d(vec3(0.0, 0.0, 1.0), c.z) * b;
  return b.xyz;
}



vec2 ctos(vec3 p) {
  p = normalize(p);
  float phi = atan(p.z, p.x) / PI / 2.0 + 0.5;
  float the = acos(p.y) / PI;
  return vec2(phi, the);
}

vec3 stoc(vec2 uv) {
  vec3 p;
  float phi = (uv.x - 0.5) * PI * 2.0;
  float the = uv.y * PI;
  p.x = sin(the)*cos(phi);
  p.y = cos(the);
  p.z = sin(the)*sin(phi);
  return p;
}

vec2 ctob(vec3 p) {
  float absX = abs(p.x);
  float absY = abs(p.y);
  float absZ = abs(p.z);

  bool isXPositive = p.x > 0.0;
  bool isYPositive = p.y > 0.0;
  bool isZPositive = p.z > 0.0;

  float maxAxis;
  vec2 uv;
  if (isXPositive && absX >= absY && absX >= absZ) {
    maxAxis = absX;
    uv.x = p.z;
    uv.y = p.y;
  }
  if (!isXPositive && absX >= absY && absX >= absZ) {
    maxAxis = absX;
    uv.x = -p.z;
    uv.y = p.y;
  }
  if (isYPositive && absY >= absX && absY >= absZ) {
    maxAxis = absY;
    uv.x = -p.x;
    uv.y = -p.z;
  }
  if (!isYPositive && absY >= absX && absY >= absZ) {
    maxAxis = absY;
    uv.x = -p.x;
    uv.y = p.z;
  }
  if (isZPositive && absZ >= absX && absZ >= absY) {
    maxAxis = absZ;
    uv.x = p.x;
    uv.y = p.y;
  }
  if (!isZPositive && absZ >= absX && absZ >= absY) {
    maxAxis = absZ;
    uv.x = -p.x;
    uv.y = p.y;
  }
  uv.x *= -1.0;
  uv = 0.5 * (uv / maxAxis + 1.0);
  return uv;
}