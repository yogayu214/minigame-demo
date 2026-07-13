/**
 * 获取用户信息
 * wx.getUserInfo / wx.createUserInfoButton
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';
import { calcNativeButtonPos, GREEN_BUTTON_STYLE } from '../../../libs/native-button-pos';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea();
export { onInfoTextReady, infoArea };

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
      setInfo(`getUserInfo 成功\n${formatObj(u)}`);
    },
    fail(err: any) {
      wx.showToast({ title: `getUserInfo 失败: ${err?.errMsg || '请先在设置中授权'}`, icon: 'none' });
    },
  });
}

/** 创建获取用户信息按钮（点击后会请求授权，位置在 destroyButton 下方） */
export function createUserInfoButton() {
  if (userInfoBtn) {
    wx.showToast({ title: '按钮已创建，请点击按钮', icon: 'none' });
    return;
  }

  // 第4个按钮位置 (index=3): getUserInfo[0] / createUserInfoButton[1] / destroyButton[2] / ★原生按钮[3]
  const pos = calcNativeButtonPos(3);

  userInfoBtn = wx.createUserInfoButton({
    type: 'text',
    text: '点这里获取用户信息',
    style: {
      ...pos,
      ...GREEN_BUTTON_STYLE,
      lineHeight: Math.round(pos.height),
    } as any,
  });

  userInfoBtn.onTap?.((res: any) => {
    if (res.userInfo) {
      setInfo(`用户信息\n${formatObj(res.userInfo)}`);
    } else {
      wx.showToast({ title: '用户拒绝授权', icon: 'none' });
    }
  });
  wx.showToast({ title: '已创建授权按钮，请在下方点击', icon: 'none' });
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
