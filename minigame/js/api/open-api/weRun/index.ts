/**
 * 微信运动
 * wx.getWeRunData
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/we-run/wx.getWeRunData.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取用户最近 30 天的步数，通过云函数自动解密 */
export function getWeRunData() {
  wx.getWeRunData({
    success(res: any) {
      const cloudID = res.cloudID;
      if (!cloudID) {
        display.text(`cloudID 为空，无法通过云函数解密\nencryptedData: ${String(res.encryptedData || '').slice(0, 40)}...\niv: ${res.iv || '-'}`);
        return;
      }
      // 通过云函数使用 CloudID 自动解密
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getWeRunData',
          weRunData: wx.cloud.CloudID(cloudID),
        },
      }).then((resp: any) => {
        const data = resp.result?.weRunData?.data;
        if (data) {
          display.text(`微信运动数据:\n${formatObj(data)}`);
        } else {
          display.text(`云函数返回:\n${formatObj(resp.result)}`);
        }
      }).catch((err: any) => {
        wx.showToast({ title: `云函数调用失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
      });
    },
    fail(err: any) {
      wx.showToast({ title: `获取失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
