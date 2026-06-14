/**
 * 虚拟支付（米大师）
 * wx.requestMidasPayment / wx.requestMidasPaymentGameItem
 * wx.requestMidasFriendPayment / wx.checkIsSupportMidasPayment
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/midas-payment/wx.requestMidasPayment.html
 *
 * 注意：本演示需要小游戏配置虚拟支付能力、且必须正式版/体验版才能真正下单。
 * 这里只演示 API 调用形态，下单数据请按业务实际填充。
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const TIP = '参数皆为虚拟，用户可下载demo后自行填入可用参数查看效果';
const TIP_DURATION = 1500;

/** 检查是否支持米大师支付 */
export function checkIsSupportMidasPayment() {
  display.text(TIP);
  setTimeout(() => {
    (wx as any).checkIsSupportMidasPayment({
      success(res: any) {
        display.text(
          formatObj({
            状态: '查询成功',
            support: String(res.support),
          })
        );
      },
      fail(err: any) {
        display.text(
          formatObj({
            状态: '查询失败',
            原因: err.errMsg,
          })
        );
      },
    });
  }, TIP_DURATION);
}

/** 发起米大师支付（按金额买货币） */
export function requestMidasPayment() {
  display.text(TIP);
  setTimeout(() => {
    wx.requestMidasPayment({
      mode: 'game',
      env: 0,
      offerId: '1450000000',
      currencyType: 'CNY',
      platform: 'android',
      buyQuantity: 10,
      outTradeNo: 'demo_' + Date.now(),
      success(res: any) {
        display.text(
          formatObj({
            状态: '支付成功',
            详情: JSON.stringify(res),
          })
        );
      },
      fail(err: any) {
        display.text(
          formatObj({
            状态: '支付失败',
            原因: err.errMsg,
          })
        );
      },
    } as any);
  }, TIP_DURATION);
}

/** 发起米大师道具直购 */
export function requestMidasPaymentGameItem() {
  display.text(TIP);
  setTimeout(() => {
    (wx as any).requestMidasPaymentGameItem({
      mode: 'short_series_game',
      env: 0,
      offerId: '1450000000',
      signData: '{}',
      paySig: 'placeholder',
      signature: 'placeholder',
      success(res: any) {
        display.text(
          formatObj({
            状态: '道具购买成功',
            详情: JSON.stringify(res),
          })
        );
      },
      fail(err: any) {
        display.text(
          formatObj({
            状态: '道具购买失败',
            原因: err.errMsg,
          })
        );
      },
    });
  }, TIP_DURATION);
}

/** 好友代付 */
export function requestMidasFriendPayment() {
  display.text(TIP);
  setTimeout(() => {
    (wx as any).requestMidasFriendPayment({
      mode: 'game',
      env: 0,
      offerId: '1450000000',
      currencyType: 'CNY',
      platform: 'android',
      buyQuantity: 10,
      outTradeNo: 'demo_friend_' + Date.now(),
      success(res: any) {
        display.text(
          formatObj({
            状态: '好友代付成功',
            详情: JSON.stringify(res),
          })
        );
      },
      fail(err: any) {
        display.text(
          formatObj({
            状态: '好友代付失败',
            原因: err.errMsg,
          })
        );
      },
    });
  }, TIP_DURATION);
}
