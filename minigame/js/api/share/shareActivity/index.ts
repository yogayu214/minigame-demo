/**
 * 群活动转发
 * wx.updateShareMenu / wx.shareAppMessage（activityId 字段）
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/share/wx.updateShareMenu.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 更新分享菜单：启用 withShareTicket（群分享必要） */
export function enableShareTicket() {
  wx.updateShareMenu({
    withShareTicket: true,
    success() { display.text('✓ withShareTicket=true 已生效'); },
    fail(err: any) { display.text(`设置失败：${err.errMsg}`); },
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
