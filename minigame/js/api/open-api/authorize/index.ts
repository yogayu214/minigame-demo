/**
 * 用户授权
 * wx.authorize / wx.getSetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/authorize/wx.authorize.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 请求写相册授权，已授权则直接调用保存 */
export function authorizeWritePhotosAlbum() {
  wx.getSetting({
    success(res: any) {
      if (res.authSetting['scope.writePhotosAlbum']) {
        wx.showToast({ title: '已有相册权限，可直接保存', icon: 'none' });
      } else {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            wx.showToast({ title: '相册授权成功', icon: 'none' });
          },
          fail(err: any) {
            display.text(`授权失败\n${formatObj(err)}`);
          },
        });
      }
    },
    fail(err: any) {
      display.text(`查询授权设置失败\n${formatObj(err)}`);
    },
  });
}
