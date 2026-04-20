/**
 * 创建图片对象
 * wx.createImage
 */

/** 创建图片并加载 */
export function createImage() {
  const img = wx.createImage();
  img.src = 'images/weapp.jpg';
  img.onload = () => { console.log('图片加载成功, 宽:', img.width, '高:', img.height); };
  img.onerror = () => { console.log('图片加载失败'); };
}
