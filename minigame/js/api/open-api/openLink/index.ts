/**
 * OPENLINK
 * wx.createPageManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/openlink/wx.createPageManager.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 创建页面管理器并加载 openlink */
export function createPageManager() {
  const pageManager: any = wx.createPageManager?.();
  if (!pageManager) {
    wx.showToast({ title: '当前版本不支持 createPageManager', icon: 'none' });
    return;
  }

  pageManager.load({
    openlink: 'TWFRCqV5WeM2AkMXhKwJ03MhfPOieJfAsvXKUbWvQFQtLyyA5etMPabBehga950uzfZcH3Vi3QeEh41xRGEVFw',
  }).then((res: any) => {
    wx.showToast({ title: 'openlink 加载成功', icon: 'none' });
    pageManager.show();
  }).catch((err: any) => {
    wx.showToast({ title: `openlink 加载失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
  });
}
 