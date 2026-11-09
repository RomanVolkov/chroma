import './wasm_exec.js';
import type { WorkerRequest, WorkerResponse } from './types';

let isReady = false;
let goInstance: any = null;

async function initWasm(baseUrl: string) {
  if (isReady) return;

  const Go = (globalThis as any).Go;
  if (!Go) {
    throw new Error('Go runtime (wasm_exec.js) failed to load into global scope');
  }

  goInstance = new Go();
  const wasmUrl = new URL('engine.wasm', baseUrl).href;

  let wasmResult: WebAssembly.WebAssemblyInstantiatedSource;
  if ('instantiateStreaming' in WebAssembly) {
    try {
      wasmResult = await WebAssembly.instantiateStreaming(fetch(wasmUrl), goInstance.importObject);
    } catch {
      const resp = await fetch(wasmUrl);
      const bytes = await resp.arrayBuffer();
      wasmResult = await WebAssembly.instantiate(bytes, goInstance.importObject);
    }
  } else {
    const resp = await fetch(wasmUrl);
    const bytes = await resp.arrayBuffer();
    wasmResult = await WebAssembly.instantiate(bytes, goInstance.importObject);
  }

  // Run Go main in background without awaiting completion (it blocks on channel)
  goInstance.run(wasmResult.instance);

  // Small poll to ensure JS exports are set
  for (let i = 0; i < 25; i++) {
    if ((globalThis as any).__chromaEngine) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  if (!(globalThis as any).__chromaEngine) {
    throw new Error('Chroma Wasm engine failed to bind __chromaEngine');
  }

  isReady = true;
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const req = e.data;

  try {
    if (req.type === 'INIT') {
      await initWasm(req.baseUrl);
      self.postMessage({ id: req.id, type: 'READY' } satisfies WorkerResponse);
      return;
    }

    if (!isReady) {
      throw new Error('Wasm engine is not initialized yet');
    }

    const engine = (globalThis as any).__chromaEngine;

    if (req.type === 'EXTRACT') {
      const jsonStr = engine.extractPalette(req.pixels, req.variant, req.k);
      const parsed = JSON.parse(jsonStr);
      if (parsed.error) {
        throw new Error(parsed.error);
      }
      self.postMessage({
        id: req.id,
        type: 'EXTRACT_SUCCESS',
        data: parsed,
      } satisfies WorkerResponse);
    } else if (req.type === 'SERIALIZE_TOML') {
      const toml = engine.serializeToml(JSON.stringify(req.scheme));
      self.postMessage({
        id: req.id,
        type: 'SERIALIZE_SUCCESS',
        toml,
      } satisfies WorkerResponse);
    }
  } catch (err: any) {
    self.postMessage({
      id: req.id,
      type: 'ERROR',
      error: err?.message || String(err),
    } satisfies WorkerResponse);
  }
};
