import type { ExtractResult, SchemeData, WorkerRequest, WorkerResponse } from './types';

let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;
const pending = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./engine.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const res = e.data;
      const handlers = pending.get(res.id);
      if (!handlers) return;

      pending.delete(res.id);
      if (res.type === 'ERROR') {
        handlers.reject(new Error(res.error));
      } else if (res.type === 'READY') {
        handlers.resolve(undefined);
      } else if (res.type === 'EXTRACT_SUCCESS') {
        handlers.resolve(res.data);
      } else if (res.type === 'SERIALIZE_SUCCESS') {
        handlers.resolve(res.toml);
      }
    };
  }
  return worker;
}

function send<T>(req: Omit<WorkerRequest, 'id'>, transfer: Transferable[] = []): Promise<T> {
  const w = getWorker();
  const id = Math.random().toString(36).substring(2, 9);
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    const fullReq = { ...req, id } as WorkerRequest;
    w.postMessage(fullReq, transfer);
  });
}

export async function initEngine(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    // Resolve absolute root URL relative to the main window
    const rootUrl = new URL(import.meta.env.BASE_URL, window.location.href).href;
    await send<void>({ type: 'INIT', baseUrl: rootUrl });
  })();
  return initPromise;
}

export async function extractPalette(
  pixels: Uint8Array,
  variant: 'dark' | 'light' = 'dark',
  k: number = 16
): Promise<ExtractResult> {
  await initEngine();
  // Transfer pixel buffer to worker without cloning overhead
  return send<ExtractResult>(
    { type: 'EXTRACT', pixels, variant, k },
    [pixels.buffer]
  );
}

export async function serializeToml(scheme: SchemeData): Promise<string> {
  await initEngine();
  return send<string>({ type: 'SERIALIZE_TOML', scheme });
}
