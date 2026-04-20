/**
 * 群任务详情
 * 做任务 / 签到 / 分享进度 / 提前终止
 */

/** 获取群任务详情 */
export function fetchActivity() {
  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: { type: 'fetchActivityList' },
  }).then((resp: any) => {
    console.log('活动详情:', resp.result);
  }).catch((err: any) => {
    console.error('获取活动详情失败:', err);
  });
}

/** 完成任务（签到） */
export function doTask() {
  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: { type: 'doTask' },
  }).then((resp: any) => {
    console.log('签到成功:', resp.result);
    wx.showToast({ title: '签到成功' });
  }).catch((err: any) => {
    console.error('签到失败:', err);
  });
}

/** 分享任务进度到群聊 */
export function shareResult() {
  wx.shareAppMessage({
    title: '群任务进度分享',
    imageUrl: canvas.toTempFilePathSync({ x: 0, y: 0, width: canvas.width, height: (canvas.width * 4) / 5 }),
  });
}

/** 提前终止任务 */
export function earlyTerminate() {
  wx.showModal({
    title: '确认终止',
    content: '确定要提前终止这个群任务吗？',
    success(res: any) {
      if (res.confirm) {
        console.log('任务已终止');
        wx.showToast({ title: '已终止' });
      }
    },
  });
}
