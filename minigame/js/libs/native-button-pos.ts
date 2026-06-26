/**
 * 原生组件（createUserInfoButton / createGameRecorderShareButton 等）位置计算工具
 *
 * 复刻 page-renderer + fixedTemplate 的布局公式，
 * 将 PIXI 逻辑坐标转换为原生组件 CSS 像素坐标，
 * 使原生按钮与 rich-renderer/page-renderer 的绿色函数按钮对齐。
 */

/** 计算第 N 个按钮位置（0-based），返回原生组件 style 坐标（CSS 像素） */
export function calcNativeButtonPos(buttonIndex: number): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const sysInfo = wx.getSystemInfoSync();
  const pixelRatio = sysInfo.pixelRatio || 2;
  const windowWidth = sysInfo.windowWidth || 375;

  // 对齐 game.ts 中 PIXI.ratio
  const ratio = (windowWidth * pixelRatio) / 750;

  // fixedTemplate 布局链: title → api_name → underline
  const menuBtn = wx.getMenuButtonBoundingClientRect();
  const titleH = 36 * ratio;
  const titleY = menuBtn.top * ratio * 2;
  const apiNameH = 32 * ratio;
  const apiNameY = titleH + titleY + 78 * ratio;
  const underlineY = apiNameY + apiNameH + 23 * ratio;
  const underlineBottom = underlineY + 1 * ratio; // underlineH = ratio

  // page-renderer 按钮起始 Y
  const baseY = underlineBottom + 80 * ratio;
  const btnW = 580 * ratio;
  const btnH = 80 * ratio;
  const btnGap = 20 * ratio;

  // PIXI 逻辑像素 → CSS 像素（除以 pixelRatio）
  return {
    left: (windowWidth * pixelRatio - btnW) / 2 / pixelRatio,
    top: (baseY + buttonIndex * (btnH + btnGap)) / pixelRatio,
    width: btnW / pixelRatio,
    height: btnH / pixelRatio,
  };
}

/** 绿色按钮默认样式（对齐 p_button） */
export const GREEN_BUTTON_STYLE = {
  backgroundColor: '#05c25f',
  color: '#ffffff',
  fontSize: 15,
  textAlign: 'center' as const,
  borderRadius: 10,
} as const;
