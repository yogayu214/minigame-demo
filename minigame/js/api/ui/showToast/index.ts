/**
 * 消息提示框
 * wx.showToast / wx.showLoading / wx.hideLoading
 */

/** 显示 success Toast */
export function showSuccessToast() {
  wx.showToast({ title: '操作成功', icon: 'success', duration: 1500 });
}

/** 显示 loading Toast */
export function showLoadingToast() {
  wx.showToast({ title: '加载中', icon: 'loading', duration: 1500 });
}

/** 显示无图标 Toast */
export function showNoneToast() {
  wx.showToast({ title: '提示信息', icon: 'none', duration: 1500 });
}

/** 显示 Loading */
export function showLoading() {
  wx.showLoading({ title: '加载中...' });
  setTimeout(() => wx.hideLoading(), 2000);
}
