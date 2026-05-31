/**
 * 实时语音通话
 * wx.joinVoIPChat / wx.exitVoIPChat / wx.updateVoIPChatMuteConfig
 * wx.onVoIPChatMembersChanged / wx.onVoIPChatInterrupted
 */

let groupId = '';
let scopeRecord: boolean | null = null;

// ===== 内部工具函数 =====

/** 检查录音授权 */
function authorize(callback: () => void) {
  if (scopeRecord) return callback();
  wx.getSetting({
    success(res: any) {
      scopeRecord = res.authSetting['scope.record'];
      if (scopeRecord) return callback();
      wx.authorize({
        scope: 'scope.record',
        success() { scopeRecord = true; callback(); },
        fail() {
          wx.hideLoading();
          scopeRecord = false;
          wx.showModal({ title: '授权失败', content: '没有授权是无法加入实时语音通话', showCancel: false });
          window.router.delPage();
        },
      });
    },
  });
}

/** 获取签名（通过云函数） */
function getSignature(gId: string, callback: (res: any) => void) {
  authorize(() => {
    wx.cloud.callFunction({
      name: 'getSignature',
      data: { groupId: gId },
      success(res: any) { callback(res.result); },
      fail(res: any) {
        wx.hideLoading();
        wx.showModal({ title: '获取签名失败', content: String(res.errCode), showCancel: false });
        window.router.delPage();
      },
    });
  });
}

/** 被动断开时的处理 */
function onInterrupted(res: any) {
  console.log('onVoIPChatInterrupted:', res);
  wx.offVoIPChatInterrupted(onInterrupted);
  // 尝试重新加入房间
  window.router.delPage();
  setTimeout(() => {
    const query = window.query;
    if (query) window.router.navigateTo(query.pathName, query);
  }, 0);
}

// ===== 导出的 API 函数 =====

/** 创建并加入语音房间 */
export function joinVoIPChat() {
  wx.showLoading({ title: '正在创建房间' });
  groupId = `语音房间${Math.random().toString(36).substring(2)}`;

  getSignature(groupId, (signRes) => {
    wx.joinVoIPChat({
      ...signRes,
      complete(res: any) {
        wx.hideLoading();
        if (res.errCode) {
          window.router.delPage();
          return;
        }
        console.log('已加入房间:', groupId, '当前人数:', res.openIdList?.length);

        // 监听房间人数变化
        wx.onVoIPChatMembersChanged((r: any) => {
          console.log('房间人数变化:', r.openIdList.length);
        });

        // 监听被动断开（如切入后台）
        wx.onVoIPChatInterrupted(onInterrupted);

        // 存储 query 供分享进房和中断恢复使用
        window.query = {
          pathName: 'VoIPChat',
          roomName: groupId,
          re_enter: '返回当前房间',
        };
      },
    });
  });
}

/** 加入已有房间（从分享进入时） */
export function joinExistingRoom() {
  const query = window.query;
  if (!query?.roomName) {
    wx.showToast({ title: '没有可加入的房间', icon: 'none' });
    return;
  }
  groupId = query.roomName;
  wx.showLoading({ title: query.re_enter || '正在进入房间', mask: true });

  getSignature(groupId, (signRes) => {
    wx.joinVoIPChat({
      ...signRes,
      complete(res: any) {
        wx.hideLoading();
        if (res.errCode) {
          window.router.delPage();
          return;
        }
        console.log('已加入房间:', groupId);
        wx.onVoIPChatMembersChanged((r: any) => {
          console.log('房间人数变化:', r.openIdList.length);
        });
        wx.onVoIPChatInterrupted(onInterrupted);
      },
    });
  });
}

/** 邀请好友进入房间（分享） */
export function shareRoom() {
  wx.shareAppMessage({
    title: '快来加入我发起的语音对话房间',
    imageUrl: canvas.toTempFilePathSync({ x: 0, y: 0, width: canvas.width, height: (canvas.width * 4) / 5 }),
    query: `pathName=VoIPChat&roomName=${groupId}`,
  });
}

/** 退出语音房间 */
export function exitVoIPChat() {
  wx.exitVoIPChat();
  wx.offVoIPChatInterrupted(onInterrupted);
  wx.showToast({ title: '已退出房间' });
  groupId = '';
  window.query = null;
}

/** 静音麦克风 */
export function muteMicrophone() {
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteMicrophone: true },
    success() { wx.showToast({ title: '麦克风已静音' }); },
  });
}

/** 取消静音麦克风 */
export function unmuteMicrophone() {
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteMicrophone: false },
    success() { wx.showToast({ title: '麦克风已开启' }); },
  });
}

/** 静音耳机 */
export function muteEarphone() {
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteEarphone: true },
    success() { wx.showToast({ title: '耳机已静音' }); },
  });
}

/** 取消静音耳机 */
export function unmuteEarphone() {
  wx.updateVoIPChatMuteConfig({
    muteConfig: { muteEarphone: false },
    success() { wx.showToast({ title: '耳机已开启' }); },
  });
}

export function onUnload() {
  if (groupId) {
    wx.exitVoIPChat();
    wx.offVoIPChatInterrupted(onInterrupted);
    groupId = '';
    window.query = null;
  }
}
