/**
 * 设置
 * wx.getSetting / wx.openSetting / wx.createOpenSettingButton
 * AuthSetting / OpenSettingButton / SubscriptionsSetting
 *
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/setting/wx.getSetting.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/setting/wx.openSetting.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/setting/wx.createOpenSettingButton.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SCOPE_LABELS: Record<string, string> = {
  'scope.userInfo': '用户信息',
  'scope.userLocation': '地理位置',
  'scope.werun': '微信运动',
  'scope.writePhotosAlbum': '保存到相册',
  'scope.camera': '摄像头',
  'scope.record': '录音',
  'scope.WxFriendInteraction': '好友互动',
  'scope.addPhoneContact': '通讯录',
};

function renderSettings(authSetting: Record<string, boolean>) {
  const lines: string[] = ['--- 授权设置 ---'];
  Object.keys(SCOPE_LABELS).forEach((scope) => {
    const value = authSetting[scope];
    const status =
      value === true ? '已授权' : value === false ? '已拒绝' : '未设置';
    lines.push(`${SCOPE_LABELS[scope]}: ${status}`);
  });
  display.text(lines.join('\n'));
}

/** 获取用户当前授权设置 (AuthSetting) */
export function getSetting() {
  wx.getSetting({
    success(res: any) {
      renderSettings(res.authSetting);
      // SubscriptionsSetting
      if (res.subscriptionsSetting) {
        display.text(
          `--- 订阅消息设置 ---\n${JSON.stringify(res.subscriptionsSetting).slice(0, 300)}`
        );
      }
    },
    fail(err: any) {
      display.text(`获取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 打开设置页面 */
export function openSetting() {
  wx.openSetting({
    success(res: any) {
      renderSettings(res?.authSetting || {});
    },
    fail(err: any) {
      display.text(`打开失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

let settingButton: any = null;

/** 创建设置按钮 (OpenSettingButton) */
export function createOpenSettingButton() {
  if (settingButton) {
    display.text('已存在设置按钮');
    return;
  }
  settingButton = wx.createOpenSettingButton({
    type: 'text',
    text: '打开设置',
    style: {
      left: 30,
      top: 260,
      width: 100,
      height: 40,
      backgroundColor: '#ffffff',
      color: '#07c160',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 40,
    },
  });
  settingButton.onTap?.(() => {
    display.text('设置按钮被点击（将自动跳转设置）');
  });
  settingButton.show?.();
  display.text('设置按钮已创建');
}

export function onUnload() {
  if (settingButton) {
    settingButton.destroy?.();
    settingButton = null;
  }
}
