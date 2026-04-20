/**
 * 加载自定义字体
 * wx.loadFont
 */

/** 加载自定义字体文件 */
export function loadFont() {
  const result = wx.loadFont('js/api/render/loadFont/assets/TencentSans-W7.subset.ttf');
  console.log('字体加载结果:', result);
}
