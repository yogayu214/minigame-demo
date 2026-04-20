/**
 * 实时语音通话
 * wx.joinVoIPChat / wx.exitVoIPChat / wx.updateVoIPChatMuteConfig
 */

let groupId = '';

/** 检查录音授权 */
function authorize(callback: () => void) {
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.record']) return callback();
      wx.authorize({
        scope: 'scope.record',
        success: callback,
        fail() { wx.showToast({ title: '需要录音授权', icon: 'none' }); },
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
      fail(res: any) { console.log('获取签名失败:', res.errCode); },
    });
  });
}

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
          console.log('加入失败:', res.errCode);
        } else {
          console.log('已加入房间:', groupId, '当前人数:', res.openIdList.length);
          wx.onVoIPChatMembersChanged((r: any) => {
            console.log('房间人数变化:', r.openIdList.length);
          });
        }
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
  wx.showToast({ title: '已退出房间' });
  groupId = '';
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
