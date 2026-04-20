/**
 * 创建群任务
 * wx.selectGroupMembers / wx.cloud.callFunction
 */

/** 选择所有群成员参与 */
export function selectAllParticipant() {
  console.log('已选择: 所有群成员参与');
}

/** 选择指定群成员参与 */
export function selectSpecifyParticipant() {
  // @ts-ignore
  wx.selectGroupMembers({
    success(res: any) {
      console.log('已选择指定成员, 人数:', res.members.length);
    },
    fail(err: any) { console.error('selectGroupMembers fail:', err); },
  });
}

/** 发布任务 */
export function publish() {
  wx.showLoading({ title: '发布中...', mask: true });
  wx.cloud.callFunction({
    name: 'openapi',
    data: { action: 'createActivityId' },
  }).then((resp: any) => {
    wx.hideLoading();
    console.log('活动创建成功, activityId:', resp.result?.activityId);
  }).catch((err: any) => {
    wx.hideLoading();
    console.error('发布失败:', err);
  });
}
