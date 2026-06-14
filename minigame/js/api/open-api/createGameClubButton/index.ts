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

const display = createDisplay();
export const setDisplay = display.setter;

let clubBtn: any = null;

/** 获取游戏圈数据 */
export function getGameClubData() {
  wx.getGameClubData({
    dataTypeList: [{ type: 1 }],
    success(res: any) {
      display.text(`游戏圈数据: ${JSON.stringify(res).slice(0, 300)}`);
    },
    fail(err: any) {
      display.text(`获取失败: ${err.errMsg}`);
    },
  });
}

/** 创建游戏圈按钮 (GameClubButton) */
export function createGameClubButton() {
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  clubBtn = wx.createGameClubButton({
    type: 'text',
    text: '游戏圈',
    style: {
      left: windowWidth / 2 - 50,
      top: windowHeight / 2,
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
    display.text('游戏圈按钮被点击');
  });
  clubBtn.show?.();
  display.text('游戏圈按钮已创建');
}

/** GameClubButton.show - 显示按钮 */
export function show() {
  if (!clubBtn) {
    display.text('请先创建游戏圈按钮');
    return;
  }
  clubBtn.show?.();
  display.text('游戏圈按钮已显示');
}

/** GameClubButton.hide - 隐藏按钮 */
export function hide() {
  if (!clubBtn) {
    display.text('请先创建游戏圈按钮');
    return;
  }
  clubBtn.hide?.();
  display.text('游戏圈按钮已隐藏');
}

/** GameClubButton.onTap - 监听点击事件 */
export function onTap() {
  if (!clubBtn) {
    display.text('请先创建游戏圈按钮');
    return;
  }
  clubBtn.onTap?.(() => {
    display.text('onTap 回调触发');
  });
  display.text('onTap 监听已绑定');
}

/** GameClubButton.offTap - 取消监听点击事件 */
export function offTap() {
  if (!clubBtn) {
    display.text('请先创建游戏圈按钮');
    return;
  }
  clubBtn.offTap?.();
  display.text('offTap 已取消监听');
}

/** GameClubButton.destroy - 销毁按钮 */
export function destroy() {
  if (clubBtn) {
    clubBtn.destroy?.();
    clubBtn = null;
    display.text('游戏圈按钮已销毁');
  } else {
    display.text('无游戏圈按钮可销毁');
  }
}
