/**
 * 加载自定义字体
 * wx.loadFont
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 加载自定义字体文件并绘制预览 */
export function loadFont() {
  const fontFamily = wx.loadFont(
    'js/api/render/loadFont/assets/TencentSans-W7.subset.ttf'
  );

  // 在离屏 canvas 上用加载的字体绘制文字
  const offCanvas = wx.createCanvas();
  offCanvas.width = 300;
  offCanvas.height = 120;
  const ctx = offCanvas.getContext('2d');

  ctx.clearRect(0, 0, 300, 120);

  // 默认字体对比
  ctx.fillStyle = '#999999';
  ctx.font = '24px sans-serif';
  ctx.fillText('默认字体 sans-serif', 10, 40);

  // 加载的自定义字体
  ctx.fillStyle = '#07c160';
  ctx.font = `24px "${fontFamily}"`;
  ctx.fillText('自定义字体 TencentSans', 10, 90);

  offCanvas.toTempFilePath({
    fileType: 'png',
    quality: 1,
    success(res: any) {
      display.image(res.tempFilePath);
    },
    fail(err: any) {
      display.text(
        formatObj({
          字体加载结果: fontFamily,
          截图失败: err.errMsg,
        })
      );
    },
  });
}
