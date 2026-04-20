/**
 * 罗盘
 * wx.startCompass / wx.stopCompass / wx.onCompassChange
 */

/** 开始监听罗盘数据 */
export function startCompass() {
  wx.onCompassChange((res: any) => {
    console.log('方向:', res.direction);
  });
  wx.startCompass();
}

/** 停止监听罗盘 */
export function stopCompass() {
  wx.stopCompass();
  wx.showToast({ title: '已停止' });
}
