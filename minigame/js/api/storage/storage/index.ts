/**
 * 数据缓存
 * wx.setStorage / wx.getStorage / wx.clearStorage
 */

/** 存储数据 */
export function setStorage() {
  wx.setStorage({
    key: 'test',
    data: 'Hello MiniGame! ' + new Date().toLocaleTimeString(),
    success() { wx.showToast({ title: '存储成功' }); },
  });
}

/** 读取数据 */
export function getStorage() {
  wx.getStorage({
    key: 'test',
    success(res: any) { console.log('读取到:', res.data); },
    fail() { console.log('未找到数据'); },
  });
}

/** 清除所有缓存 */
export function clearStorage() {
  wx.clearStorage({
    success() { wx.showToast({ title: '已清除' }); },
  });
}
