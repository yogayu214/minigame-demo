/**
 * PC 接力
 * wx.startHandoff - 在开放数据域调用
 */

/** 发起 PC 接力（向开放数据域发送事件） */
export function startHandoff() {
  wx.getOpenDataContext().postMessage({ event: 'PCHandoff' });
  console.log('已发送 PC 接力事件到开放数据域');
}
