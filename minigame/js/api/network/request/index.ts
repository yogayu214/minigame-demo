/**
 * 发送请求
 * wx.request
 */

/** 发起一个 HTTP GET 请求 */
export function sendRequest() {
  const startTime = Date.now();
  wx.request({
    url: 'https://developers.weixin.qq.com/minigame/dev/api/',
    success(res: any) {
      console.log('请求成功, 耗时:', Date.now() - startTime, 'ms, 数据长度:', res.data.length);
    },
    fail() {
      console.log('请求失败');
    },
  });
}
