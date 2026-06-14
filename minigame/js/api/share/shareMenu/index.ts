/**
 * 转发菜单控制
 * wx.updateShareMenu / wx.showShareMenu / wx.hideShareMenu
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.updateShareMenu.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.showShareMenu.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.hideShareMenu.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 更新分享菜单：启用 withShareTicket */
export function enableShareTicket() {
  wx.updateShareMenu({
    withShareTicket: true,
    success() {
      display.text('withShareTicket=true 已生效');
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '设置失败',
          原因: err.errMsg,
        })
      );
    },
  });
}

/** 更新分享菜单：设置为私密分享 */
export function enablePrivateMode() {
  wx.updateShareMenu({
    withShareTicket: true,
    isPrivateMessage: true,
    activityId: 'demo_activity',
    success() {
      display.text('私密分享模式已生效');
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '设置失败',
          原因: err.errMsg,
        })
      );
    },
  } as any);
}

/** 显示转发按钮（withShareTicket=true） */
export function showShareMenu() {
  wx.showShareMenu({
    withShareTicket: true,
    success() {
      display.text('转发按钮已显示（withShareTicket=true）');
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '显示失败',
          原因: err.errMsg,
        })
      );
    },
  });
}

/** 显示转发按钮（不带 withShareTicket） */
export function showShareMenuBasic() {
  wx.showShareMenu({
    success() {
      display.text('转发按钮已显示');
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '显示失败',
          原因: err.errMsg,
        })
      );
    },
  });
}

/** 隐藏转发按钮 */
export function hideShareMenu() {
  wx.hideShareMenu({
    success() {
      display.text('转发按钮已隐藏');
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '隐藏失败',
          原因: err.errMsg,
        })
      );
    },
  });
}

/** 分享活动（activityId 来自服务端预创建） */
export function shareActivity() {
  wx.shareAppMessage({
    title: '一起来玩活动',
    imageUrl: '',
    query: 'activityId=demo_activity',
    activityId: 'demo_activity',
  } as any);
  display.text('已触发活动分享');
}
