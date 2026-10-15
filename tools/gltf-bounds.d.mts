import type { Buffer } from "node:buffer";
import type { Box3 } from "three";

/** Decodes vertex positions and node transforms from a manifest-verified GLB. */
export function vertexBounds(data: Buffer, document: unknown): Box3;
