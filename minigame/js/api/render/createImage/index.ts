/**
 * 创建图片对象
 * wx.createImage
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 创建图片并加载 */
export function createImage() {
  const img = wx.createImage();
  if (!img) {
    display.text('创建图片失败：wx.createImage 返回空值');
    return;
  }
  img.src = 'images/weapp.jpg';
  img.onload = () => {
    display.image(img.src);
  };
  img.onerror = () => {
    display.text('图片加载失败');
  };
}
