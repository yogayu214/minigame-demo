/**
 * 卡券
 * wx.openCard / wx.addCard
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/card/wx.openCard.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/card/wx.addCard.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 查看卡券 */
export function openCard() {
  wx.openCard({
    cardList: [
      {
        cardId: '请填写cardId',
        code: '请填写code',
      },
    ],
    success() {
      display.text('已打开卡券');
    },
    fail(err: any) {
      display.text(`打开失败: ${err.errMsg}`);
    },
  } as any);
}

/** 添加卡券 */
export function addCard() {
  wx.addCard({
    cardList: [
      {
        cardId: '请填写cardId',
        cardExt: '{"code": "", "openid": "", "timestamp": "", "signature": ""}',
      },
    ],
    success(res: any) {
      const cards = res.cardList || [];
      display.text(`添加结果: ${JSON.stringify(cards).slice(0, 200)}`);
    },
    fail(err: any) {
      display.text(`添加失败: ${err.errMsg}`);
    },
  } as any);
}
