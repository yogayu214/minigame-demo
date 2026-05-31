/**
 * 顶部菜单按钮与官方组件
 * wx.getMenuButtonBoundingClientRect / wx.setMenuStyle /
 * wx.onMenuButtonBoundingClientRectWeightChange / wx.offMenuButtonBoundingClientRectWeightChange /
 * wx.getOfficialComponentsInfo / wx.onOfficialComponentsInfoChange / wx.offOfficialComponentsInfoChange
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let menuListener: any = null;
let officialListener: any = null;

/** 查询胶囊菜单按钮位置 */
export function getMenuRect() {
  const rect = wx.getMenuButtonBoundingClientRect();
  display.data({
    top: String(rect.top),
    right: String(rect.right),
    width: String(rect.width),
    height: String(rect.height),
  });
}

/** 切换菜单为深色样式 */
export function setMenuDark() {
  wx.setMenuStyle({
    style: 'dark',
    success() { display.text('✓ 菜单已设为深色'); },
    fail(err: any) { display.text(`失败：${err.errMsg}`); },
  });
}

/** 切换菜单为浅色样式 */
export function setMenuLight() {
  wx.setMenuStyle({
    style: 'light',
    success() { display.text('✓ 菜单已设为浅色'); },
  });
}

/** 监听胶囊菜单位置变化（如横竖屏切换） */
export function onMenuRectChange() {
  menuListener = (res: any) => {
    display.data({
      事件: 'menuRectWeightChange',
      width: String(res.width),
      height: String(res.height),
    });
  };
  (wx as any).onMenuButtonBoundingClientRectWeightChange(menuListener);
  display.text('已注册菜单位置监听');
}

/** 停止监听菜单位置 */
export function offMenuRectChange() {
  if (menuListener) {
    (wx as any).offMenuButtonBoundingClientRectWeightChange(menuListener);
    menuListener = null;
    display.text('✓ 已停止菜单监听');
  }
}

/** 查询官方组件信息（胶囊、tabbar 等） */
export function getOfficialComponents() {
  const info: any = wx.getOfficialComponentsInfo?.() || {};
  display.data({
    数据: JSON.stringify(info).slice(0, 100),
  });
}

/** 监听官方组件变化 */
export function onOfficialChange() {
  officialListener = (res: any) => display.data({ 事件: 'officialChange', 详情: JSON.stringify(res).slice(0, 100) });
  wx.onOfficialComponentsInfoChange?.(officialListener);
  display.text('已注册官方组件变化监听');
}

export function onUnload() {
  offMenuRectChange();
  if (officialListener) {
    wx.offOfficialComponentsInfoChange?.(officialListener);
    officialListener = null;
  }
}
