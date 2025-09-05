import { PARTICLES_COUNT } from "../../../constants";
import { useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";

export function useParticlesGeometry() {
  return useMemo(() => {
    const resolution = PARTICLES_COUNT;
    const PARTICLES_WIDTH = window.PARTICLES_WIDTH;
    const PARTICLES_HEIGHT = window.PARTICLES_HEIGHT;
    let pg = new BufferGeometry();
    let pos = new Float32Array(PARTICLES_WIDTH * PARTICLES_HEIGHT * 3);
    let uv = new Float32Array(PARTICLES_WIDTH * PARTICLES_HEIGHT * 2);
    for (let i = 0; i < PARTICLES_WIDTH * PARTICLES_HEIGHT; i++) {
      let x = i % PARTICLES_WIDTH; // column
      let y = Math.floor(i / PARTICLES_WIDTH); // row
      x = Math.random() * 10000.0;
      y = Math.random() * 10000.0;
      pos.set([x, y, 0], i * 3);
      const u = x / (PARTICLES_WIDTH - 1);
      const v = y / (PARTICLES_HEIGHT - 1);
      uv.set([u, v], i * 2);
    }
    pg.setAttribute("position", new BufferAttribute(pos, 3));
    pg.setAttribute("uv", new BufferAttribute(uv, 2));

    return pg;
  }, []);
}
