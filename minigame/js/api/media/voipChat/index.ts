/**
 * 实时语音通话
 * wx.joinVoIPChat / wx.exitVoIPChat / wx.updateVoIPChatMuteConfig /
 * wx.onVoIPChatInterrupted / wx.offVoIPChatInterrupted /
 * wx.onVoIPChatStateChanged / wx.offVoIPChatStateChanged /
 * wx.onVoIPChatSpeakersChanged / wx.offVoIPChatSpeakersChanged /
 * wx.onVoIPChatMembersChanged / wx.offVoIPChatMembersChanged
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/voip/wx.joinVoIPChat.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const listeners: Record<string, any> = {};

/** 加入语音通话（需要服务端预生成签名） */
export function joinChat() {
  const tip =
    '⚠️ 此功能需要服务端生成 signature、nonceStr 等真实数据，\n' +
    'Demo 中无法模拟，调用将失败。\n\n' +
    '接入流程：\n' +
    '1. 后端调用微信 API 预创建房间获取签名\n' +
    '2. 前端携带签名调用 wx.joinVoIPChat\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/media/voip/wx.joinVoIPChat.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    wx.joinVoIPChat({
      signature: 'placeholder',
      nonceStr: 'placeholder',
      timeStamp: Math.floor(Date.now() / 1000),
      groupId: 'demo_group',
      muteConfig: { muteMicrophone: false, muteEarphone: false },
      success(res: any) {
        display.text(
          formatObj({
            状态: '已加入',
            openIds: (res.openIdList || []).length + ' 人',
          })
        );
      },
      fail(err: any) {
        display.text(`调用失败：${err.errMsg}`);
      },
    });
  }, 2000);
}

/** 退出 */
export function exitChat() {
  wx.exitVoIPChat({
    success() {
      display.text('已退出');
    },
    fail(err: any) {
      display.text(`退出失败：${err.errMsg}`);
    },
  });
}

/** 麦克风静音 */
export function muteMic() {
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteMicrophone: true, muteEarphone: false },
    success() {
      display.text('已静音麦克风');
    },
  });
}

/** 监听 VoIP 状态变化、成员变化、说话变化 */
export function listenVoIPEvents() {
  listeners.state = (res: any) =>
    display.text(
      formatObj({
        事件: 'stateChanged',
        code: res.code,
        errMsg: res.errMsg,
      })
    );
  listeners.speak = (res: any) =>
    display.text(
      formatObj({
        事件: 'speakersChanged',
        openIds: (res.openIdList || []).join(','),
      })
    );
  listeners.member = (res: any) =>
    display.text(
      formatObj({
        事件: 'membersChanged',
        openIds: (res.openIdList || []).join(','),
      })
    );
  listeners.interrupt = (res: any) =>
    display.text(formatObj({ 事件: 'interrupted', errMsg: res.errMsg }));

  wx.onVoIPChatStateChanged(listeners.state);
  wx.onVoIPChatSpeakersChanged(listeners.speak);
  wx.onVoIPChatMembersChanged(listeners.member);
  wx.onVoIPChatInterrupted(listeners.interrupt);
  display.text('已注册 VoIP 4 事件监听');
}

/** 停止 VoIP 事件监听 */
export function stopListen() {
  if (listeners.state) wx.offVoIPChatStateChanged(listeners.state);
  if (listeners.speak) wx.offVoIPChatSpeakersChanged(listeners.speak);
  if (listeners.member) wx.offVoIPChatMembersChanged(listeners.member);
  if (listeners.interrupt) wx.offVoIPChatInterrupted(listeners.interrupt);
  Object.keys(listeners).forEach((k) => delete listeners[k]);
  display.text('已停止 VoIP 监听');
}

export function onUnload() {
  stopListen();
  try {
    wx.exitVoIPChat({});
  } catch {
    console.log('exitVoIPChat error');
  }
}
