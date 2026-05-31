/**
 * 开放数据域
 * 好友排行榜 / 群排行榜 / 分数上报 / 订阅消息
 *
 * 注意：排行榜的 UI 渲染依赖开放数据域 + SharedCanvas + PIXI ticker，
 * 属于 rich-renderer 路径，此处通过 setter 暴露状态变化给外层。
 */

// ===== setter：排行榜显示/隐藏由外层 UI 管理 =====
let _onRankShow: (() => void) | null = null;
let _onRankHide: (() => void) | null = null;
export function setOnRankShow(fn: () => void) { _onRankShow = fn; }
export function setOnRankHide(fn: () => void) { _onRankHide = fn; }

let friendRankShow = false;

/** 分享到群聊（附带群排行榜入口） */
export function shareToGroup() {
  if (friendRankShow) return;
  wx.shareAppMessage({
    title: '高手如云，看看群里你排第几',
    query: 'showGroup=1&pathName=openDataContext',
    imageUrl: canvas.toTempFilePathSync({ x: 0, y: 0, width: canvas.width, height: (canvas.width * 4) / 5 }),
  });
  wx.showToast({ title: '若分享成功，请从群里点击查看群排行', icon: 'none', duration: 2000 });
}

/** 上报随机分数到开放数据域 */
export function setUserRecord() {
  if (friendRankShow) return;
  const score = Math.floor(Math.random() * 1000 + 1);
  wx.setUserCloudStorage({
    KVDataList: [{
      key: 'rankid',
      value: JSON.stringify({ wxgame: { score, update_time: parseInt(String(+new Date() / 1000)) } }),
    }],
    success() {
      wx.showToast({ title: `分数上报成功: ${score}分`, icon: 'none', duration: 2000 });
    },
  });
}

/** 显示好友排行榜 */
export function showFriendRank() {
  if (friendRankShow) return;
  friendRankShow = true;
  wx.getOpenDataContext().postMessage({ event: 'showFriendRank' });
  _onRankShow?.();
}

/** 显示好友在线状态 */
export function showFriendsOnlineStatus() {
  if (friendRankShow) return;
  friendRankShow = true;
  wx.getOpenDataContext().postMessage({ event: 'showFriendsOnlineStatus' });
  _onRankShow?.();
}

/** 显示群排行榜（从分享卡片进入时调用） */
export function showGroupRank(shareTicket: string) {
  if (friendRankShow) return;
  friendRankShow = true;
  wx.getOpenDataContext().postMessage({ event: 'showGroupRank', shareTicket });
  _onRankShow?.();
}

/** 关闭排行榜 */
export function closeRank() {
  friendRankShow = false;
  wx.getOpenDataContext().postMessage({ event: 'close' });
  wx.triggerGC(); // 主动垃圾回收
  _onRankHide?.();
}

/** 订阅系统消息（好友互动提醒 / 排行榜超越提醒） */
export function subscribe() {
  wx.requestSubscribeSystemMessage({
    msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
    success(res: any) {
      let tips = '成功订阅';
      if (res.SYS_MSG_TYPE_INTERACTIVE === 'accept') tips += '好友互动提醒';
      if (res.SYS_MSG_TYPE_RANK === 'accept') {
        if (tips !== '成功订阅') tips += '和';
        tips += '排行榜好友超越提醒';
      }
      wx.showToast({ title: tips, icon: 'none', duration: 2000 });
    },
    fail(res: any) {
      wx.showToast({ title: res.errMsg, icon: 'none', duration: 2000 });
    },
  });
}

/** 检测是否需要显示群排行榜（从分享入口进来时） */
export function detectGroupRank(options: any) {
  if (options?.shareTicket && options?.query?.showGroup === '1') {
    showGroupRank(options.shareTicket);
  }
}

export function onLoad() {
  // 监听 onShow 以处理从分享卡片返回的情况
  wx.onShow(detectGroupRank);
}

export function onUnload() {
  wx.offShow(detectGroupRank);
  if (friendRankShow) closeRank();
  _onRankShow = null;
  _onRankHide = null;
}
