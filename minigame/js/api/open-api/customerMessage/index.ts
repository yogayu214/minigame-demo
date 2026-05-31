/**
 * 客服会话与反馈
 * wx.openCustomerServiceConversation / wx.createFeedbackButton
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/customer-message/wx.openCustomerServiceConversation.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let feedbackButton: any = null;

/** 打开客服会话 */
export function openCustomerServiceConversation() {
  wx.openCustomerServiceConversation({
    sessionFrom: 'demo',
    success() { display.text('✓ 已打开客服会话'); },
    fail(err: any) { display.text(`打开失败：${err.errMsg}`); },
  });
}

/** 创建一个 "意见反馈" 按钮 */
export function createFeedbackButton() {
  if (feedbackButton) {
    display.text('已存在反馈按钮');
    return;
  }
  feedbackButton = wx.createFeedbackButton({
    type: 'text',
    text: '意见反馈',
    style: {
      left: 30,
      top: 200,
      width: 100,
      height: 40,
      backgroundColor: '#ffffff',
      color: '#07c160',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 40,
    },
  });
  feedbackButton.onTap?.((res: any) => {
    display.text(`已点击反馈按钮 ${JSON.stringify(res || {})}`);
  });
  feedbackButton.show?.();
  display.text('✓ 反馈按钮已创建并显示');
}

/** 销毁反馈按钮 */
export function destroyFeedbackButton() {
  if (feedbackButton) {
    feedbackButton.destroy?.();
    feedbackButton = null;
    display.text('✓ 反馈按钮已销毁');
  }
}

export function onUnload() {
  destroyFeedbackButton();
}
