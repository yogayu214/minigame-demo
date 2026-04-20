/**
 * 开放数据域
 * 好友排行榜 / 群排行榜 / 分数上报 / 订阅消息
 */

/** 分享到群聊（附带群排行榜入口） */
export function shareToGroup() {
  wx.shareAppMessage({
    title: '高手如云，看看群里你排第几',
    query: 'showGroup=1&pathName=openDataContext',
    imageUrl: canvas.toTempFilePathSync({ x: 0, y: 0, width: canvas.width, height: (canvas.width * 4) / 5 }),
  });
}

/** 上报随机分数到开放数据域 */
export function setUserRecord() {
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

/** 显示好友排行榜（需在开放数据域中渲染） */
export function showFriendRank() {
  wx.getOpenDataContext().postMessage({ event: 'showFriendRank' });
  console.log('已发送 showFriendRank 事件到开放数据域');
}

/** 显示好友在线状态（需在开放数据域中渲染） */
export function showFriendsOnlineStatus() {
  wx.getOpenDataContext().postMessage({ event: 'showFriendsOnlineStatus' });
  console.log('已发送 showFriendsOnlineStatus 事件到开放数据域');
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
