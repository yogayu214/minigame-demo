/**
 * 微信登录
 * wx.login
 */

/** 调用 wx.login 获取临时登录凭证 code */
export function login() {
  wx.login({
    success(res: any) {
      if (res.code) {
        console.log('登录成功, code:', res.code);
      } else {
        console.log('登录失败:', res.errMsg);
      }
    },
    fail(err: any) { console.log('登录失败:', err.errMsg); },
  });
}
