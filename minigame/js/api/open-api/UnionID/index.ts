/**
 * UnionID
 * 通过 wx.login + 后端解密获取
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取 UnionID（需后端配合） */
export function getUnionID() {
  wx.login({
    success(res: any) {
      display.data({
        'code': res.code,
        '说明': '将 code 发送到后端 code2Session 换取 unionId',
      });
    },
    fail(err: any) {
      wx.showModal({ title: '失败', content: err.errMsg, showCancel: false });
    },
  });
}
