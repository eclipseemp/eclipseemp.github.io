interface SimRequest {
  type: 'simulate';
  iterations: number;
  baseDps: number;
  variance: number;
}

interface ProgressMessage {
  type: 'progress';
  progress: number;
  elapsed: number;
}

interface ResultMessage {
  type: 'result';
  results: Float64Array;
  elapsed: number;
}

export type WorkerMessage = ProgressMessage | ResultMessage;

self.onmessage = (e: MessageEvent<SimRequest>) => {
  if (e.data.type === 'simulate') {
    const { iterations, baseDps, variance } = e.data;
    const startTime = performance.now();
    const results = new Float64Array(iterations);
    const BATCH = 100000;

    for (let i = 0; i < iterations; i += BATCH) {
      const end = Math.min(i + BATCH, iterations);
      for (let j = i; j < end; j++) {
        results[j] = baseDps + (Math.random() - 0.5) * variance * 2;
      }
      const progress = Math.round((end / iterations) * 100);
      const elapsed = performance.now() - startTime;
      self.postMessage({ type: 'progress', progress, elapsed } satisfies ProgressMessage);
    }

    const elapsed = performance.now() - startTime;
    self.postMessage(
      { type: 'result', results, elapsed } satisfies ResultMessage,
      { transfer: [results.buffer] },
    );
  }
};
