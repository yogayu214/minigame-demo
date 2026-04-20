/**
 * 二维码
 * wx.cloud 获取小程序码
 */

/** 通过云函数获取小程序码 */
export function getAppletCode() {
  wx.cloud.callFunction({
    name: 'getQRCode',
    success(res: any) { console.log('获取成功:', res.result); },
    fail(err: any) { console.log('获取失败:', err.errMsg); },
  });
}
