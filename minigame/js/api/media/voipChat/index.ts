/**
 * 实时语音通话
 * wx.joinVoIPChat / wx.exitVoIPChat / wx.updateVoIPChatMuteConfig /
 * wx.onVoIPChatInterrupted / wx.offVoIPChatInterrupted /
 * wx.onVoIPChatMembersChanged / wx.offVoIPChatMembersChanged
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/voip/wx.joinVoIPChat.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let groupId = '';
let scopeRecord = false;

/** 授权录音权限 */
function authorizeRecord(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scopeRecord) return resolve();
    wx.getSetting({
      success(res: any) {
        scopeRecord = res.authSetting['scope.record'];
        if (scopeRecord) return resolve();
        wx.authorize({
          scope: 'scope.record',
          success() {
            scopeRecord = true;
            resolve();
          },
          fail() {
            scopeRecord = false;
            reject(new Error('未授权录音权限'));
          },
        });
      },
      fail: reject,
    });
  });
}

/** 通过云函数获取签名 */
function getSignature(gId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'getSignature',
      data: { groupId: gId },
      success(res: any) {
        resolve(res.result);
      },
      fail(res: any) {
        reject(res);
      },
    });
  });
}

/** 加入（创建）实时语音通话 */
export function joinChat() {
  authorizeRecord()
    .then(() => {
      if (!groupId) {
        groupId = `语音房间${Math.random().toString(36).substring(2)}`;
      }
      wx.showLoading({ title: '正在加入房间' });
      getSignature(groupId)
        .then((signData: any) => {
          wx.joinVoIPChat({
            ...signData,
            muteConfig: { muteMicrophone: false, muteEarphone: false },
            complete(res: any) {
              wx.hideLoading();
              if (res.errCode) {
                wx.showToast({ title: `加入失败: ${res.errMsg || res.errCode}`, icon: 'none' });
              } else {
                display.text(
                  formatObj({
                    状态: '已加入房间',
                    房间: groupId,
                    成员数: (res.openIdList || []).length,
                  })
                );
                // 注册成员变化和中断监听
                wx.onVoIPChatMembersChanged((ev: any) => {
                  wx.showToast({ title: `成员变化: ${ev.openIdList.length} 人`, icon: 'none' });
                });
                wx.onVoIPChatInterrupted(() => {
                  wx.showToast({ title: '语音通话被中断', icon: 'none' });
                  wx.offVoIPChatInterrupted();
                });
              }
            },
          });
        })
        .catch((err: any) => {
          wx.hideLoading();
          wx.showToast({ title: `获取签名失败: ${err?.errCode || '未知错误'}`, icon: 'none' });
        });
    })
    .catch(() => {
      wx.showToast({ title: '没有授权录音，无法加入语音通话', icon: 'none' });
    });
}

/** 退出语音通话 */
export function exitChat() {
  wx.exitVoIPChat({
    success() {
      wx.showToast({ title: '已退出房间', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `退出失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
  groupId = '';
}

/** 麦克风静音 */
export function muteMic() {
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteMicrophone: true, muteEarphone: false },
    success() {
      wx.showToast({ title: '已静音麦克风', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `静音失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

export function onUnload() {
  try {
    wx.offVoIPChatMembersChanged();
    wx.offVoIPChatInterrupted();
  } catch { /* ignore */ }
  try {
    wx.exitVoIPChat({});
  } catch { /* ignore */ }
  groupId = '';
}
