/* tslint:disable */
/* eslint-disable */
export function compress_base64(base64_input: string, quality: number, max_dimension: number): CompressedResult | undefined;
export class CompressedResult {
  private constructor();
  free(): void;
  readonly base64: string;
  readonly width: number;
  readonly height: number;
  readonly size_before: number;
  readonly size_after: number;
  readonly compression_ratio: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_compressedresult_free: (a: number, b: number) => void;
  readonly compressedresult_base64: (a: number) => [number, number];
  readonly compressedresult_width: (a: number) => number;
  readonly compressedresult_height: (a: number) => number;
  readonly compressedresult_size_before: (a: number) => number;
  readonly compressedresult_size_after: (a: number) => number;
  readonly compressedresult_compression_ratio: (a: number) => number;
  readonly compress_base64: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
