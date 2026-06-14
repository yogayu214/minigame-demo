/**
 * 设备方向
 * wx.startDeviceMotionListening / wx.stopDeviceMotionListening / wx.onDeviceMotionChange
 */

let monitorFunc: any = null;
let _onData:
  | ((res: { alpha: number; beta: number; gamma: number }) => void)
  | null = null;
/** 由 rich-configs 绑定 */
export function setOnData(fn: ((res: any) => void) | null) {
  _onData = fn;
}

/** 开始监听设备方向变化 */
export function startListening() {
  wx.startDeviceMotionListening();
  if (monitorFunc) return;
  wx.onDeviceMotionChange(
    (monitorFunc = (res: any) => {
      if (_onData) _onData(res);
    })
  );
}

/** 停止监听设备方向 */
export function stopListening() {
  wx.stopDeviceMotionListening();
  if (monitorFunc && wx.offDeviceMotionChange) {
    wx.offDeviceMotionChange(monitorFunc);
    monitorFunc = null;
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  stopListening();
  _onData = null;
}
