/**
 * 虚拟支付（米大师）
 * wx.requestMidasPayment / wx.requestMidasPaymentGameItem
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/midas-payment/wx.requestMidasPayment.html
 *
 * 注意：本演示需要小游戏配置虚拟支付能力、且必须正式版/体验版才能真正下单。
 * 这里只演示 API 调用形态，下单数据请按业务实际填充。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 发起米大师支付（按金额买货币） */
export function requestMidasPayment() {
  wx.requestMidasPayment({
    mode: 'game',
    env: 0,                 // 0 正式 / 1 沙箱
    offerId: '1450000000',  // 在米大师平台申请
    currencyType: 'CNY',
    platform: 'android',
    buyQuantity: 10,        // 购买货币数量
    outTradeNo: 'demo_' + Date.now(),
    success(res: any) {
      display.data({ 状态: '✓ 支付成功', 详情: JSON.stringify(res) });
    },
    fail(err: any) {
      display.data({ 状态: '✗ 支付失败', 原因: err.errMsg });
    },
  } as any);
}

/** 发起米大师道具直购 */
export function requestMidasPaymentGameItem() {
  (wx as any).requestMidasPaymentGameItem({
    mode: 'short_series_game',
    env: 0,
    offerId: '1450000000',
    signData: '{}',         // 业务侧签名串
    paySig: 'placeholder',  // 业务侧签名
    signature: 'placeholder',
    success(res: any) {
      display.data({ 状态: '✓ 道具购买成功', 详情: JSON.stringify(res) });
    },
    fail(err: any) {
      display.data({ 状态: '✗ 道具购买失败', 原因: err.errMsg });
    },
  });
}
