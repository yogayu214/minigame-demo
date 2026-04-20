/**
 * 设置
 * wx.getSetting / wx.openSetting
 */

/** 获取用户当前设置 */
export function getSetting() {
  wx.getSetting({
    success(res: any) { console.log('用户设置:', JSON.stringify(res.authSetting)); },
  });
}

/** 打开设置页面 */
export function openSetting() {
  wx.openSetting({
    success(res: any) { console.log('设置结果:', JSON.stringify(res.authSetting)); },
  });
}
