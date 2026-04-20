/**
 * 网络类型
 * wx.getNetworkType
 */

/** 获取手机当前网络类型 */
export function getNetworkType() {
  wx.getNetworkType({
    success(res: any) {
      console.log('当前网络类型:', res.networkType);
    },
  });
}
