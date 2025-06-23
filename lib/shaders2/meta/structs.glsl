struct DisplacePatternInput
{
  vec3 position;
  vec3 normal;
  vec2 uv;
  float animation;
};


struct DisplacePatternOutput
{
  vec3 position;
  vec3 normal;
  vec3 pattern;
};

struct CoatOutput
{
  vec3 color;
  vec3 bump;
  float scale;
  float roughness;
};