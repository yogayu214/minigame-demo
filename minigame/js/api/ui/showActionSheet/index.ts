/**
 * 操作菜单
 * wx.showActionSheet
 */

/** 显示操作菜单 */
export function showActionSheet() {
  wx.showActionSheet({
    itemList: ['选项 A', '选项 B', '选项 C'],
    success(res: any) { console.log('用户选择了第', res.tapIndex, '项'); },
    fail(res: any) { console.log('用户取消'); },
  });
}
