/**
 * 重力感应
 * wx.startAccelerometer / wx.stopAccelerometer / wx.onAccelerometerChange
 */

let monitorFunc: any = null;
let _onData: ((res: { x: number; y: number; z: number }) => void) | null = null;
/** 由 rich-configs 绑定 */
export function setOnData(fn: ((res: any) => void) | null) {
  _onData = fn;
}

/** 开始监听加速度变化 */
export function startListening() {
  wx.startAccelerometer({
    interval: 'game',
    fail(err: any) {
      console.error('启动加速度监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc) return;
  wx.onAccelerometerChange(
    (monitorFunc = (res: any) => {
      if (_onData) _onData(res);
    })
  );
}

/** 停止监听加速度 */
export function stopListening() {
  wx.stopAccelerometer({
    fail(err: any) {
      console.error('停止加速度监听失败：', err?.errMsg || '未知错误');
    },
  });
  if (monitorFunc && wx.offAccelerometerChange) {
    wx.offAccelerometerChange(monitorFunc);
    monitorFunc = null;
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  stopListening();
  _onData = null;
}
