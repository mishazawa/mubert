import {
  BufferGeometry,
  Float32BufferAttribute,
  Vector2,
  Vector3,
} from "three";

class DipyramidGeometry extends BufferGeometry {
  type = "DipyramidGeometry";
  parameters: {
    sides: number;
    resolution: number;
    radius: number;
    height: number;
    oneSide: boolean;
  };

  vertices: number[] = [];
  indices: number[] = [];
  uvs: number[] = [];

  vertIndex = 0;
  vertMap: Record<string, number> = {}; // Store unique vertex positions

  constructor(
    sides: number = 4,
    resolution: number = 1,
    radius: number = 1,
    height: number = 1,
    oneSide: boolean = false
  ) {
    super();

    this.parameters = {
      sides,
      resolution,
      radius,
      height,
      oneSide,
    };

    this.generateGeo();

    this.setAttribute("position", new Float32BufferAttribute(this.vertices, 3));
    this.setAttribute("uv", new Float32BufferAttribute(this.uvs, 2));
    this.setIndex(this.indices);
    this.computeVertexNormals();
  }

  copy(source: any) {
    super.copy(source);

    this.parameters = Object.assign({}, source.parameters);

    return this;
  }

  private generateGeo() {
    const { radius, sides: n, height } = this.parameters;
    // Create base points (regular polygon in XZ plane)
    const basePoints = [];

    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      basePoints.push(
        new Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle))
      );
    }

    const top = new Vector3(0, height, 0);
    const bottom = new Vector3(0, -height, 0);

    for (let i = 0; i < n; i++) {
      const v0 = basePoints[i];
      const v1 = basePoints[(i + 1) % n];
      this.subdivideFace(top, v0, v1, true);
    }

    for (let i = 0; i < n; i++) {
      const v0 = basePoints[(i + 1) % n];
      const v1 = basePoints[i];
      this.subdivideFace(bottom, v0, v1, false);
    }
  }

  private addVertex(v: Vector3, isTop: boolean) {
    const key = `${v.x.toFixed(5)},${v.y.toFixed(5)},${v.z.toFixed(5)},${
      isTop ? "T" : "B"
    }`;
    if (!this.vertMap[key]) {
      const uv = this.computeUV(v, this.parameters.height);
      this.uvs.push(uv.x, uv.y);
      this.vertices.push(v.x, v.y, v.z);

      this.vertMap[key] = this.vertIndex++;
    }
    return this.vertMap[key];
  }

  // Function to generate subdivided triangles (indices, apex, v0, v1)
  private subdivideFace(
    apex: Vector3,
    v0: Vector3,
    v1: Vector3,
    isTop: boolean
  ) {
    const grid = [];
    for (let i = 0; i <= this.parameters.resolution; i++) {
      const row = [];
      const t = i / this.parameters.resolution;
      const start = apex.clone().lerp(v0, t);
      const end = apex.clone().lerp(v1, t);
      for (let j = 0; j <= i; j++) {
        const s = j / i || 0; // avoid NaN for i = 0
        const p = start.clone().lerp(end, s);

        row.push(this.addVertex(p, isTop));
      }
      grid.push(row);
    }

    // Create triangle indices
    for (let i = 0; i < this.parameters.resolution; i++) {
      for (let j = 0; j < i; j++) {
        this.indices.push(grid[i + 1][j], grid[i][j], grid[i + 1][j + 1]); // triangle 1
        this.indices.push(grid[i + 1][j + 1], grid[i][j], grid[i][j + 1]); // triangle 2
      }
      this.indices.push(grid[i + 1][i], grid[i][i], grid[i + 1][i + 1]); // last triangle
    }
  }

  private computeUV(v: Vector3, height: number) {
    const u = 0.5 + Math.atan2(v.z, v.x) / (2 * Math.PI);
    const vCoord = v.y / (2 * height) + 0.5; // Normalize from [-height, height] → [0,1]
    return new Vector2(u, vCoord);
  }
}

export { DipyramidGeometry };
