vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
  : vec3(0.0, -v.z, v.y));
}

// todo remove
// vec3 recalcNormals(in vec3 newPos, in vec3 P, in vec3 N, float animation) {
//   float offset = 0.001;
//   vec3 tangent = orthogonal(N);
//   vec3 bitangent = normalize(cross(N, tangent));
//   vec3 neighbour1 = P + tangent * offset;
//   vec3 neighbour2 = P + bitangent * offset;

//   vec3 displacedNeighbour1 = displace(neighbour1, N, animation);
//   vec3 displacedNeighbour2 = displace(neighbour2, N, animation);

//   vec3 displacedTangent = displacedNeighbour1 - newPos;
//   vec3 displacedBitangent = displacedNeighbour2 - newPos;

//   return normalize(cross(displacedTangent, displacedBitangent));
// }



Neighbours getNeighbours(in vec3 P, in vec3 N) {
  float offset = 0.001;
  vec3 tangent = orthogonal(N);
  vec3 bitangent = normalize(cross(N, tangent));
  vec3 neighbour1 = P + tangent * offset;
  vec3 neighbour2 = P + bitangent * offset;
  return Neighbours(neighbour1, neighbour2);
}

vec3 calcNormalFromSamples (in vec3 NP, in vec3 AP, in vec3 BP) {
  vec3 displacedTangent = AP - NP;
  vec3 displacedBitangent = BP - NP;
  return normalize(cross(displacedTangent, displacedBitangent));
}