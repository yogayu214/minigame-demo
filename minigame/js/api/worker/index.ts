let _worker: any = wx.createWorker('workers/index.js');

function fib(n: number): number { return n < 2 ? n : fib(n - 1) + fib(n - 2); }

export function mainThreadFib30() {
  const s = Date.now();
  const r = fib(30);
  wx.showModal({ title: '主线程结果', content: `${r}  耗时 ${Date.now() - s}ms`, showCancel: false });
}

export function workerFib30() {
  if (!_worker) return;
  const s = Date.now();
  _worker.onMessage((res) => {
    wx.showModal({ title: 'Worker结果', content: `${res.msg}  耗时 ${Date.now() - s}ms`, showCancel: false });
  });
  _worker.postMessage({ msg: 30 });
}
