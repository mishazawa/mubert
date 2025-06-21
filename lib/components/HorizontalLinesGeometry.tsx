//@ts-ignore
import {
  BufferGeometry,
  Float32BufferAttribute,
  Triangle,
  Vector3,
} from "three";

const _v0 = /*@__PURE__*/ new Vector3();
const _v1 = /*@__PURE__*/ new Vector3();
const _normal = /*@__PURE__*/ new Vector3();
const _triangle = /*@__PURE__*/ new Triangle();
/**
 * Can be used as a helper object to view the edges of a geometry.
 *
 * ```js
 * const geometry = new THREE.BoxGeometry();
 * const edges = new THREE.HorizontalLinesGeometry( geometry );
 * const line = new THREE.LineSegments( edges );
 * scene.add( line );
 * ```
 *
 * Note: It is not yet possible to serialize/deserialize instances of this class.
 *
 * @augments BufferGeometry
 */
class HorizontalLinesGeometry extends BufferGeometry {
  type = "HorizontalLinesGeometry";
  parameters: { geometry: BufferGeometry | null };
  /**
   * Constructs a new edges geometry.
   *
   * @param {?BufferGeometry} [geometry=null] - The geometry.
   * @param {number} [thresholdAngle=1] - An edge is only rendered if the angle (in degrees)
   * between the face normals of the adjoining faces exceeds this value.
   */
  constructor(geometry: BufferGeometry | null = null) {
    super();

    this.type = "HorizontalLinesGeometry";

    /**
     * Holds the constructor parameters that have been
     * used to generate the geometry. Any modification
     * after instantiation does not change the geometry.
     *
     * @type {Object}
     */
    this.parameters = {
      geometry: geometry,
    };

    if (geometry !== null) {
      const precisionPoints = 4;
      const precision = Math.pow(10, precisionPoints);

      //@ts-ignore
      const indexAttr = geometry!.getIndex();
      //@ts-ignore
      const positionAttr = geometry!.getAttribute("position");
      const indexCount = indexAttr ? indexAttr.count : positionAttr.count;

      const indexArr = [0, 0, 0];
      const vertKeys = ["a", "b", "c"];
      const hashes = new Array(3);

      const edgeData = {};
      const vertices = [];
      for (let i = 0; i < indexCount; i += 3) {
        if (indexAttr) {
          indexArr[0] = indexAttr.getX(i);
          indexArr[1] = indexAttr.getX(i + 1);
          indexArr[2] = indexAttr.getX(i + 2);
        } else {
          indexArr[0] = i;
          indexArr[1] = i + 1;
          indexArr[2] = i + 2;
        }

        const { a, b, c } = _triangle;
        a.fromBufferAttribute(positionAttr, indexArr[0]);
        b.fromBufferAttribute(positionAttr, indexArr[1]);
        c.fromBufferAttribute(positionAttr, indexArr[2]);
        _triangle.getNormal(_normal);

        // create hashes for the edge from the vertices
        hashes[0] = `${Math.round(a.x * precision)},${Math.round(
          a.y * precision
        )},${Math.round(a.z * precision)}`;
        hashes[1] = `${Math.round(b.x * precision)},${Math.round(
          b.y * precision
        )},${Math.round(b.z * precision)}`;
        hashes[2] = `${Math.round(c.x * precision)},${Math.round(
          c.y * precision
        )},${Math.round(c.z * precision)}`;

        // skip degenerate triangles
        if (
          hashes[0] === hashes[1] ||
          hashes[1] === hashes[2] ||
          hashes[2] === hashes[0]
        ) {
          continue;
        }

        // iterate over every edge
        for (let j = 0; j < 3; j++) {
          // get the first and next vertex making up the edge
          const jNext = (j + 1) % 3;
          const vecHash0 = hashes[j];
          const vecHash1 = hashes[jNext];

          //@ts-ignore
          const v0 = _triangle[vertKeys[j]];
          //@ts-ignore
          const v1 = _triangle[vertKeys[jNext]];

          const hash = `${vecHash0}_${vecHash1}`;
          const reverseHash = `${vecHash1}_${vecHash0}`;

          //@ts-ignore
          if (reverseHash in edgeData && edgeData[reverseHash]) {
            // check if vertices only horizontal
            if (v0.y === v1.y) {
              vertices.push(v0.x, v0.y, v0.z);
              vertices.push(v1.x, v1.y, v1.z);
            }

            //@ts-ignore
            edgeData[reverseHash] = null;
          } else if (!(hash in edgeData)) {
            // if we've already got an edge here then skip adding a new one
            //@ts-ignore

            edgeData[hash] = {
              index0: indexArr[j],
              index1: indexArr[jNext],
              normal: _normal.clone(),
            };
          }
        }
      }

      // iterate over all remaining, unmatched edges and add them to the vertex array
      for (const key in edgeData) {
        //@ts-ignore

        if (edgeData[key]) {
          //@ts-ignore

          const { index0, index1 } = edgeData[key];
          _v0.fromBufferAttribute(positionAttr, index0);
          _v1.fromBufferAttribute(positionAttr, index1);

          vertices.push(_v0.x, _v0.y, _v0.z);
          vertices.push(_v1.x, _v1.y, _v1.z);
        }
      }

      this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    }
  }

  copy(source: any) {
    super.copy(source);

    this.parameters = Object.assign({}, source.parameters);

    return this;
  }
}

export { HorizontalLinesGeometry };
