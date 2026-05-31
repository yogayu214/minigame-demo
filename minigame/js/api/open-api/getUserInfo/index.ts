/**
 * 获取用户信息
 * wx.createUserInfoButton
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let userInfoBtn: any = null;

/** 创建获取用户信息按钮（点击后会请求授权） */
export function createButton() {
  if (userInfoBtn) { wx.showToast({ title: '按钮已创建', icon: 'none' }); return; }
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  userInfoBtn = wx.createUserInfoButton({
    type: 'text',
    text: '点这里获取用户信息',
    style: {
      left: windowWidth / 2 - 100, top: windowHeight - 100,
      width: 200, height: 40,
      backgroundColor: '#07c160', color: '#ffffff',
      fontSize: 16, textAlign: 'center', lineHeight: 40, borderRadius: 4,
    },
  });
  userInfoBtn.onTap((res: any) => {
    if (res.userInfo) {
      display.image(res.userInfo.avatarUrl);
      setTimeout(() => {
        wx.showModal({
          title: '用户信息',
          content: `昵称：${res.userInfo.nickName}\n性别：${res.userInfo.gender === 1 ? '男' : '女'}\n地区：${res.userInfo.country} ${res.userInfo.province} ${res.userInfo.city}`,
          showCancel: false,
        });
      }, 300);
    } else {
      wx.showModal({ title: '获取失败', content: '用户拒绝授权', showCancel: false });
    }
  });
  display.text('请点击屏幕下方的"点这里获取用户信息"按钮');
}

/** 销毁按钮 */
export function destroyButton() {
  if (userInfoBtn) {
    userInfoBtn.destroy();
    userInfoBtn = null;
    display.text('按钮已销毁');
  }
}

export function onUnload() {
  if (userInfoBtn) { userInfoBtn.destroy(); userInfoBtn = null; }
}
