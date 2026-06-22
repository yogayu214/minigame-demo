/**
 * 实时语音通话（VoIP Chat）
 * wx.joinVoIPChat / wx.exitVoIPChat / wx.updateVoIPChatMuteConfig /
 * wx.onVoIPChatMembersChanged / wx.onVoIPChatInterrupted
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/voip/wx.joinVoIPChat.html
 *
 * 功能：
 *   1. 进入（创建）语音房间，显示房间人数
 *   2. 麦克风静音/取消静音切换
 *   3. 耳机静音/取消静音切换
 *   4. 监听成员变化，实时更新人数
 *   5. 邀请好友进入房间（分享）
 *   6. 退出房间
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

// ========== 状态 ==========
let groupId = '';
let scopeRecord = false;
let micMuted = false;    // true = 静音（关闭），false = 开启
let earMuted = false;    // true = 静音（关闭），false = 开启
let joined = false;

// ========== 工具函数 ==========

function toast(title: string) {
  wx.showToast({ title, icon: 'none' });
}

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

/** 更新 UI 显示 */
function updateUI(memberCount?: number) {
  display.data({
    房间名: groupId || '-',
    状态: joined ? '已加入' : '未加入',
    麦克风: micMuted ? '已静音' : '开启',
    耳机: earMuted ? '已静音' : '开启',
    当前人数: `${memberCount ?? '?'} 人`,
  });
}

// ========== 导出函数 ==========

/**
 * 加入（创建）实时语音通话房间
 * 页面加载时自动调用，或用户手动点击"进入房间"
 */
export function joinChat() {
  if (joined) {
    toast('已在房间中');
    return;
  }
  authorizeRecord()
    .then(() => {
      if (!groupId) {
        groupId = `语音房间${Math.random().toString(36).substring(2)}`;
      }
      const loadingText = window.query?.re_enter || '正在加入房间';
      wx.showLoading({ title: loadingText, mask: true });

      return getSignature(groupId);
    })
    .then((signData: any) => {
      return new Promise<void>((resolve, reject) => {
        wx.joinVoIPChat({
          ...signData,
          muteConfig: { muteMicrophone: micMuted, muteEarphone: earMuted },
          complete(res: any) {
            wx.hideLoading();
            if (res.errCode) {
              toast(`加入失败: ${res.errMsg || res.errCode}`);
              reject(new Error(String(res.errCode)));
            } else {
              joined = true;
              micMuted = false;
              earMuted = false;
              updateUI(res.openIdList?.length);

              // 监听成员变化
              wx.onVoIPChatMembersChanged((ev: any) => {
                updateUI(ev.openIdList?.length);
              });

              // 监听被中断（如切到后台）
              wx.onVoIPChatInterrupted(() => {
                wx.offVoIPChatMembersChanged();
                wx.offVoIPChatInterrupted();
                joined = false;
                toast('语音通话被中断');

                // 尝试重新进入
                if (window.query?.pathName && window.query?.roomName) {
                  setTimeout(() => {
                    groupId = window.query.roomName;
                    joinChat();
                  }, 500);
                }
              });

              // 设置分享参数，方便邀请好友
              window.query = {
                pathName: window.router.getNowPageName(),
                roomName: groupId,
                re_enter: '返回当前房间',
              };

              resolve();
            }
          },
        });
      });
    })
    .catch((err: any) => {
      wx.hideLoading();
      const errMsg = err?.message || err?.errMsg || err?.errCode || '未知错误';
      if (errMsg.includes('授权')) {
        toast('没有授权录音，无法加入语音通话');
      } else {
        toast(`获取签名失败: ${errMsg}`);
      }
    });
}

/**
 * 切换麦克风静音状态
 * 点击时在 静音/开启 之间切换
 */
export function toggleMicrophone() {
  if (!joined) {
    toast('请先加入房间');
    return;
  }
  micMuted = !micMuted;
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteMicrophone: micMuted, muteEarphone: earMuted },
    success() {
      updateUI();
      toast(micMuted ? '麦克风已静音' : '麦克风已开启');
    },
    fail(err: any) {
      // 切换回来
      micMuted = !micMuted;
      toast(`设置失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/**
 * 切换耳机静音状态
 * 点击时在 静音/开启 之间切换
 */
export function toggleEarphone() {
  if (!joined) {
    toast('请先加入房间');
    return;
  }
  earMuted = !earMuted;
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteMicrophone: micMuted, muteEarphone: earMuted },
    success() {
      updateUI();
      toast(earMuted ? '耳机已静音' : '耳机已开启');
    },
    fail(err: any) {
      // 切换回来
      earMuted = !earMuted;
      toast(`设置失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/**
 * 邀请好友进入房间（主动分享）
 */
export function inviteFriend() {
  if (!joined || !groupId) {
    toast('请先加入房间');
    return;
  }
  let imageUrl = '';
  try {
    imageUrl = canvas.toTempFilePathSync({
      x: 0,
      y: 0,
      width: canvas.width,
      height: (canvas.width * 4) / 5,
    });
  } catch (e: any) {
    console.error('[voipChat] toTempFilePathSync 失败', e);
  }
  wx.shareAppMessage({
    title: '快来加入我的语音对话房间',
    imageUrl,
    query: `pathName=${window.router.getNowPageName()}&roomName=${groupId}`,
  });
}

/**
 * 退出（销毁）实时语音通话
 */
export function exitChat() {
  if (!joined) {
    toast('当前不在房间中');
    return;
  }

  // 取消监听
  try {
    wx.offVoIPChatMembersChanged();
    wx.offVoIPChatInterrupted();
  } catch { /* ignore */ }

  wx.exitVoIPChat({
    success() {
      joined = false;
      window.query = null;
      updateUI();
      toast('已退出房间');
    },
    fail(err: any) {
      toast(`退出失败: ${err?.errMsg || '未知错误'}`);
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
  joined = false;
  groupId = '';
}
