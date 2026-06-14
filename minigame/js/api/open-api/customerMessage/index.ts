/**
 * 客服消息 / 意见反馈
 * wx.openCustomerServiceConversation / wx.createFeedbackButton
 * FeedbackButton.destroy / FeedbackButton.hide / FeedbackButton.offTap /
 * FeedbackButton.onTap / FeedbackButton.show
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
    success() {
      display.text('已打开客服会话');
    },
    fail(err: any) {
      display.text(`打开失败：${err.errMsg}`);
    },
  });
}

/** 创建意见反馈按钮 (FeedbackButton) */
export function createFeedbackButton() {
  if (feedbackButton) {
    display.text('已存在反馈按钮，请先销毁');
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
  feedbackButton.onTap?.(() => {
    display.text('onTap 回调触发');
  });
  feedbackButton.show?.();
  display.text('反馈按钮已创建并显示');
}

/** FeedbackButton.show - 显示按钮 */
export function show() {
  if (!feedbackButton) {
    display.text('请先创建反馈按钮');
    return;
  }
  feedbackButton.show?.();
  display.text('反馈按钮已显示');
}

/** FeedbackButton.hide - 隐藏按钮 */
export function hide() {
  if (!feedbackButton) {
    display.text('请先创建反馈按钮');
    return;
  }
  feedbackButton.hide?.();
  display.text('反馈按钮已隐藏');
}

/** FeedbackButton.onTap - 监听点击事件 */
export function onTap() {
  if (!feedbackButton) {
    display.text('请先创建反馈按钮');
    return;
  }
  feedbackButton.onTap?.(() => {
    display.text('已注册 onTap 监听');
  });
  display.text('onTap 监听已绑定');
}

/** FeedbackButton.offTap - 取消监听点击事件 */
export function offTap() {
  if (!feedbackButton) {
    display.text('请先创建反馈按钮');
    return;
  }
  feedbackButton.offTap?.();
  display.text('offTap 已取消监听');
}

/** FeedbackButton.destroy - 销毁按钮 */
export function destroy() {
  if (feedbackButton) {
    feedbackButton.destroy?.();
    feedbackButton = null;
    display.text('反馈按钮已销毁');
  } else {
    display.text('无反馈按钮可销毁');
  }
}
