/**
 * 罗盘
 * wx.startCompass / wx.stopCompass / wx.onCompassChange
 */

let monitorFunc: any = null;
let _onData: ((res: { direction: number }) => void) | null = null;
/** 由 rich-configs 绑定 */
export function setOnData(fn: ((res: any) => void) | null) {
  _onData = fn;
}

/** 开始监听罗盘数据 */
export function startListening() {
  wx.startCompass({
    fail(err: any) {
      console.error('启动罗盘监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc) return;
  wx.onCompassChange(
    (monitorFunc = (res: any) => {
      if (_onData) _onData(res);
    })
  );
}

/** 停止监听罗盘 */
export function stopListening() {
  wx.stopCompass({
    fail(err: any) {
      console.error('停止罗盘监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc && wx.offCompassChange) {
    wx.offCompassChange(monitorFunc);
    monitorFunc = null;
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  stopListening();
  _onData = null;
}
