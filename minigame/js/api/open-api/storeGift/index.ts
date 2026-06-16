/**
 * 微信小店
 * wx.createStoreGift
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/store-gift/wx.createStoreGift.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 创建小店礼物组件 */
export function createStoreGift() {
  display.text('提示: 请先在 demo 代码中配置小店参数');
  setTimeout(() => {
    const storeGift: any = wx.createStoreGift({
      // 请填写实际参数
      success() {
        display.text('已创建 StoreGift 组件');
      },
      fail(err: any) {
        display.text(`创建失败: ${err?.errMsg || '未知错误'}`);
      },
    } as any);
    if (!storeGift) {
      display.text('当前版本不支持 createStoreGift');
    }
  }, 2000);
}
