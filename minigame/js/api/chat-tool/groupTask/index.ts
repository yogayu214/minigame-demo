/**
 * 群活动
 * 创建群活动 / 获取活动列表
 */

/** 获取活动列表 */
export function fetchActivityList() {
  wx.showLoading({ title: '加载中', mask: true });
  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: { type: 'fetchActivityList' },
  }).then((resp: any) => {
    wx.hideLoading();
    console.log('活动列表:', resp.result?.dataList);
  }).catch((err: any) => {
    wx.hideLoading();
    console.error('获取活动列表失败:', err);
  });
}

/** 打开聊天工具创建任务 */
export function createTask() {
  // @ts-ignore
  wx.openChatTool({
    success() { console.log('聊天工具已打开'); },
    fail(err: any) { console.error('openChatTool fail:', err); },
  });
}
