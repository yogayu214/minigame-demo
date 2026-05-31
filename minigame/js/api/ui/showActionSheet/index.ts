/**
 * 操作菜单
 * wx.showActionSheet
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 显示操作菜单 */
export function showActionSheet() {
  const items = ['选项 A', '选项 B', '选项 C'];
  wx.showActionSheet({
    itemList: items,
    success(res: any) {
      display.text(`选中：第 ${res.tapIndex + 1} 项 "${items[res.tapIndex]}"`);
    },
    fail() { display.text('已取消'); },
  });
}
