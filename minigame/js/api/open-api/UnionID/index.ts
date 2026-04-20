/**
 * UnionID
 * 通过 wx.login + 后端解密获取
 */

/** 获取 UnionID（需后端配合） */
export function getUnionID() {
  wx.login({
    success(res: any) {
      console.log('code:', res.code, '需将 code 发送到后端换取 unionId');
    },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
