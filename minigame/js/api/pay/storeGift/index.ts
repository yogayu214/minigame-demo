/**
 * 店礼物 / 红包
 * wx.createStoreGift / wx.sendBizRedPacket
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/storeGift/wx.createStoreGift.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let storeGift: any = null;

/** 创建店礼物组件 */
export function createStoreGift() {
  storeGift = (wx as any).createStoreGift({
    style: { left: 50, top: 200, width: 280, height: 60 },
  });
  storeGift.onLoad?.((res: any) => {
    display.text(`✓ 店礼物加载完成: ${JSON.stringify(res)}`);
  });
  storeGift.onError?.((err: any) => {
    display.text(`✗ 店礼物错误: ${err.errMsg}`);
  });
  storeGift.show?.();
  display.text('已创建并展示店礼物组件');
}

/** 销毁店礼物组件 */
export function destroyStoreGift() {
  if (storeGift) {
    storeGift.destroy?.();
    storeGift = null;
    display.text('✓ 已销毁店礼物');
  }
}

/** 发起企业红包 */
export function sendBizRedPacket() {
  if (typeof (wx as any).sendBizRedPacket !== 'function') {
    display.text('当前微信版本不支持 sendBizRedPacket');
    return;
  }
  (wx as any).sendBizRedPacket({
    package: 'placeholder',  // 后台预下单返回
    success(res: any) {
      display.data({ 状态: '✓ 红包发送成功', 详情: JSON.stringify(res) });
    },
    fail(err: any) {
      display.data({ 状态: '✗ 红包发送失败', 原因: err.errMsg });
    },
  });
}

export function onUnload() {
  destroyStoreGift();
}
