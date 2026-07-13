/**
 * 游戏圈
 * wx.getGameClubData / wx.createGameClubButton
 * GameClubButton.destroy / GameClubButton.hide / GameClubButton.offTap /
 * GameClubButton.onTap / GameClubButton.show
 *
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/game-club/wx.createGameClubButton.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/game-club/wx.getGameClubData.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea();
export { onInfoTextReady, infoArea };

let clubBtn: any = null;

/** 获取游戏圈数据 */
export function getGameClubData() {
  wx.showToast({ title: '正在获取游戏圈数据...', icon: 'none' });
  wx.getGameClubData({
    dataTypeList: [{ type: 1 }],
    success(res: any) {
      if (!res || JSON.stringify(res) === '{}') {
        wx.showToast({ title: '游戏圈数据为空', icon: 'none' });
        return;
      }
      setInfo(`游戏圈数据\n${JSON.stringify(res, null, 2)}`);
    },
    fail(err: any) {
      setInfo(`获取游戏圈数据失败\n${err?.errMsg || '未知错误'}`);
    },
    complete() {
      wx.showToast({ title: 'getGameClubData 请求完成', icon: 'none' });
    },
  });
}

/** 创建游戏圈按钮 (GameClubButton) */
export function createGameClubButton() {
  const sysInfo = wx.getSystemInfoSync();
  const windowWidth = sysInfo?.windowWidth || 375;
  const windowHeight = sysInfo?.windowHeight || 667;
  clubBtn = wx.createGameClubButton({
    type: 'text',
    text: '游戏圈',
    style: {
      left: windowWidth / 2 - 50,
      top: 600,
      width: 100,
      height: 40,
      backgroundColor: '#07c160',
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 40,
      borderRadius: 4,
    },
  } as any);
  clubBtn.onTap?.(() => {
    wx.showToast({ title: '游戏圈按钮被点击', icon: 'none' });
  });
  clubBtn.show?.();
  wx.showToast({ title: '游戏圈按钮已创建', icon: 'none' });
}

/** GameClubButton.show - 显示按钮 */
export function show() {
  if (!clubBtn) {
    wx.showToast({ title: '请先创建游戏圈按钮', icon: 'none' });
    return;
  }
  clubBtn.show?.();
  wx.showToast({ title: '游戏圈按钮已显示', icon: 'none' });
}

/** GameClubButton.hide - 隐藏按钮 */
export function hide() {
  if (!clubBtn) {
    wx.showToast({ title: '请先创建游戏圈按钮', icon: 'none' });
    return;
  }
  clubBtn.hide?.();
  wx.showToast({ title: '游戏圈按钮已隐藏', icon: 'none' });
}

/** GameClubButton.onTap - 监听点击事件 */
export function onTap() {
  if (!clubBtn) {
    wx.showToast({ title: '请先创建游戏圈按钮', icon: 'none' });
    return;
  }
  clubBtn.onTap?.(() => {
    wx.showToast({ title: 'onTap 回调触发', icon: 'none' });
  });
  wx.showToast({ title: 'onTap 监听已绑定', icon: 'none' });
}

/** GameClubButton.offTap - 取消监听点击事件 */
export function offTap() {
  if (!clubBtn) {
    wx.showToast({ title: '请先创建游戏圈按钮', icon: 'none' });
    return;
  }
  clubBtn.offTap?.();
  wx.showToast({ title: 'offTap 已取消监听', icon: 'none' });
}

/** GameClubButton.destroy - 销毁按钮 */
export function destroy() {
  if (clubBtn) {
    clubBtn.destroy?.();
    clubBtn = null;
    wx.showToast({ title: '游戏圈按钮已销毁', icon: 'none' });
  } else {
    wx.showToast({ title: '无游戏圈按钮可销毁', icon: 'none' });
  }
}

export function onUnload() {
  if (clubBtn) {
    clubBtn.destroy?.();
    clubBtn = null;
  }
}
