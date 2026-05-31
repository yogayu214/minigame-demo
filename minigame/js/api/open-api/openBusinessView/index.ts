/**
 * 打开业务视图
 * wx.openBusinessView
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/business-view/wx.openBusinessView.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 打开发票业务视图（businessType: weixinInvoice） */
export function openInvoice() {
  (wx as any).openBusinessView({
    businessType: 'weixinInvoice',
    extraData: {},
    success() { display.text('✓ 已打开发票视图'); },
    fail(err: any) { display.text(`打开失败：${err.errMsg}`); },
  });
}

/** 打开电子证照视图（businessType: weixinCertificate） */
export function openCertificate() {
  (wx as any).openBusinessView({
    businessType: 'weixinCertificate',
    extraData: {},
    success() { display.text('✓ 已打开证照视图'); },
    fail(err: any) { display.text(`打开失败：${err.errMsg}`); },
  });
}
