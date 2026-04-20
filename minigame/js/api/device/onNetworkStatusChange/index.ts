/**
 * 监听网络状态变化
 * wx.onNetworkStatusChange
 */

/** 开始监听网络状态变化 */
export function onNetworkStatusChange() {
  wx.onNetworkStatusChange((res: any) => {
    console.log('网络状态变化:', res.isConnected ? '已连接' : '已断开', res.networkType);
  });
  wx.showToast({ title: '监听中' });
}
