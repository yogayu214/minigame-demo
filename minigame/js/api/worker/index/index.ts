/**
 * Worker 多线程
 * wx.createWorker
 */

let worker: any = null;

/** 初始化 Worker */
export function onLoad() {
  worker = wx.createWorker('workers/index.js');
}

/** 主线程计算 fibonacci(30) */
export function mainThreadFib() {
  function fib(n: number): number { return n < 2 ? n : fib(n - 1) + fib(n - 2); }
  const start = Date.now();
  const result = fib(30);
  console.log('主线程结果:', result, '耗时:', Date.now() - start, 'ms');
}

/** Worker 计算 fibonacci(30) */
export function workerFib() {
  if (!worker) { wx.showToast({ title: 'Worker 未创建', icon: 'none' }); return; }
  const start = Date.now();
  worker.onMessage((res: any) => {
    console.log('Worker 结果:', res.msg, '耗时:', Date.now() - start, 'ms');
  });
  worker.postMessage({ msg: 30 });
}

/** 页面销毁时清理 */
export function onUnload() {
  if (worker) { worker.terminate(); worker = null; }
}
