/**
 * 海外支付
 * wx.requestGamePayment / wx.getGamePaymentProductInfo
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/overseaspay/wx.requestGamePayment.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 查询海外支付道具信息 */
export function getProductInfo() {
  (wx as any).getGamePaymentProductInfo({
    productIds: ['demo_product_1'],
    success(res: any) {
      display.data({
        商品数: String((res.products || []).length),
        首个商品: JSON.stringify((res.products || [])[0] || {}),
      });
    },
    fail(err: any) {
      display.text(`查询失败：${err.errMsg}`);
    },
  });
}

/** 海外支付下单 */
export function requestGamePayment() {
  (wx as any).requestGamePayment({
    productId: 'demo_product_1',
    success(res: any) {
      display.data({ 状态: '✓ 海外支付成功', 详情: JSON.stringify(res) });
    },
    fail(err: any) {
      display.data({ 状态: '✗ 海外支付失败', 原因: err.errMsg });
    },
  });
}
