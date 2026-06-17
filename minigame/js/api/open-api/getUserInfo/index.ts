/**
 * 获取用户信息
 * wx.getUserInfo / wx.createUserInfoButton
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let userInfoBtn: any = null;

/** 获取用户信息（需先授权） */
export function getUserInfo() {
  wx.getUserInfo({
    success(res: any) {
      const u = res?.userInfo;
      if (!u) {
        wx.showToast({ title: '用户信息为空', icon: 'none' });
        return;
      }
      display.text(`getUserInfo 成功\n${formatObj(u)}`);
    },
    fail(err: any) {
      wx.showToast({ title: `getUserInfo 失败: ${err?.errMsg || '请先在设置中授权'}`, icon: 'none' });
    },
  });
}

/** 创建获取用户信息按钮（点击后会请求授权） */
export function createUserInfoButton() {
  if (userInfoBtn) {
    wx.showToast({ title: '按钮已创建，请点击下方按钮', icon: 'none' });
    return;
  }
  const sysInfo = wx.getSystemInfoSync();
  const windowWidth = sysInfo?.windowWidth || 375;
  const windowHeight = sysInfo?.windowHeight || 667;
  userInfoBtn = wx.createUserInfoButton({
    type: 'text',
    text: '点这里获取用户信息',
    style: {
      left: windowWidth / 2 - 100,
      top: 125,
      width: 200,
      height: 40,
      backgroundColor: '#07c160',
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 40,
      borderRadius: 4,
    },
  });
  userInfoBtn.onTap?.((res: any) => {
    if (res.userInfo) {
      setTimeout(() => {
        const u = res.userInfo;
        display.text(`用户信息\n${formatObj(u)}`);
      }, 300);
      } else {
      wx.showToast({ title: '用户拒绝授权', icon: 'none' });
    }
  });
  wx.showToast({ title: '请点击屏幕下方的按钮获取用户信息', icon: 'none' });
}

/** 销毁按钮 */
export function destroyButton() {
  if (userInfoBtn) {
    userInfoBtn.destroy();
    userInfoBtn = null;
    wx.showToast({ title: '按钮已销毁', icon: 'none' });
  }
}

export function onUnload() {
  if (userInfoBtn) {
    userInfoBtn.destroy();
    userInfoBtn = null;
  }
}
