/**
 * 模态弹窗
 * wx.showModal
 */

/** 显示确认弹窗 */
export function showConfirmModal() {
  wx.showModal({
    title: '提示',
    content: '这是一个确认弹窗',
    success(res: any) {
      console.log(res.confirm ? '用户点击确认' : '用户点击取消');
    },
  });
}

/** 显示无取消按钮弹窗 */
export function showSimpleModal() {
  wx.showModal({
    title: '提示',
    content: '这是一个无取消按钮弹窗',
    showCancel: false,
    confirmColor: '#02BB00',
  });
}
