import { PARTICLES_COUNT } from "../../../constants";
import { useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";

export function useParticlesGeometry() {
  return useMemo(() => {
    const resolution = PARTICLES_COUNT;
    let pg = new BufferGeometry();
    let pos = new Float32Array(resolution * resolution * 3);
    let uv = new Float32Array(resolution * resolution * 2);
    for (let i = 0; i < resolution * resolution; i++) {
      let x = i % resolution; // column
      let y = Math.floor(i / resolution); // row
      x = Math.random() * 10000.0;
      y = Math.random() * 10000.0;
      pos.set([x, y, 0], i * 3);
      const u = x / (resolution - 1);
      const v = y / (resolution - 1);
      uv.set([u, v], i * 2);
    }
    pg.setAttribute("position", new BufferAttribute(pos, 3));
    pg.setAttribute("uv", new BufferAttribute(uv, 2));

    return pg;
  }, []);
}
