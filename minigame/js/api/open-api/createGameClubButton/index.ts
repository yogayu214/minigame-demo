/**
 * 游戏圈
 * wx.createGameClubButton
 */

let clubBtn: any = null;

/** 创建游戏圈按钮 */
export function createGameClubButton() {
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  clubBtn = wx.createGameClubButton({
    type: 'text',
    text: '游戏圈',
    style: { left: windowWidth / 2 - 50, top: windowHeight / 2, width: 100, height: 40, backgroundColor: '#07c160', color: '#ffffff', fontSize: 16, textAlign: 'center', lineHeight: 40, borderRadius: 4 },
  });
}

/** 销毁按钮 */
export function destroyButton() {
  if (clubBtn) { clubBtn.destroy(); clubBtn = null; }
}
