/**
 * 获取用户信息
 * wx.getUserInfo / wx.createUserInfoButton / wx.getPhoneNumber
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let userInfoBtn: any = null;

/** 获取用户信息（需先授权） */
export function getUserInfo() {
  wx.getUserInfo({
    success(res: any) {
      const u = res.userInfo;
      display.text(
        `getUserInfo 成功\n昵称: ${u.nickName}\n性别: ${u.gender === 1 ? '男' : u.gender === 2 ? '女' : '未知'}\n地区: ${u.country} ${u.province} ${u.city}`
      );
    },
    fail(err: any) {
      display.text(`getUserInfo 失败\n${err?.errMsg || '请先在设置中授权'}`);
    },
  });
}

/** 创建获取用户信息按钮（点击后会请求授权） */
export function createUserInfoButton() {
  if (userInfoBtn) {
    display.text('按钮已创建，请点击下方按钮');
    return;
  }
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  userInfoBtn = wx.createUserInfoButton({
    type: 'text',
    text: '点这里获取用户信息',
    style: {
      left: windowWidth / 2 - 100,
      top: windowHeight - 100,
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
  userInfoBtn.onTap((res: any) => {
    if (res.userInfo) {
      display.image(res.userInfo.avatarUrl);
      setTimeout(() => {
        const u = res.userInfo;
        display.text(
          `用户信息\n昵称: ${u.nickName}\n性别: ${u.gender === 1 ? '男' : u.gender === 2 ? '女' : '未知'}\n地区: ${u.country} ${u.province} ${u.city}`
        );
      }, 300);
    } else {
      display.text('用户拒绝授权');
    }
  });
  display.text('请点击屏幕下方的"点这里获取用户信息"按钮');
}

/** 获取手机号（需在 game.json 中声明 scope.getPhoneNumber 权限） */
export function getPhoneNumber() {
  (wx as any).getPhoneNumber({
    success(res: any) {
      display.text(
        `getPhoneNumber 成功\ncloudID: ${res.cloudID || '无'}\n详情: ${JSON.stringify(res).slice(0, 100)}`
      );
    },
    fail(err: any) {
      const msg = err?.errMsg || '';
      if (msg.includes('scope is not declared')) {
        display.text(
          'getPhoneNumber 失败\n需在 game.json 的 permission 中声明 scope.getPhoneNumber'
        );
      } else {
        display.text(`getPhoneNumber 失败\n${msg || '请确认在真机上调用'}`);
      }
    },
  });
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
  if (userInfoBtn) {
    userInfoBtn.destroy();
    userInfoBtn = null;
  }
}
