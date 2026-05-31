/**
 * 收货地址
 * wx.chooseAddress
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/address/wx.chooseAddress.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 调起微信收货地址选择 */
export function chooseAddress() {
  (wx as any).chooseAddress({
    success(res: any) {
      display.data({
        姓名: res.userName,
        电话: res.telNumber,
        省: res.provinceName,
        市: res.cityName,
        区: res.countyName,
        详细: res.detailInfo,
      });
    },
    fail(err: any) {
      display.text(`选择失败：${err.errMsg}`);
    },
  });
}
