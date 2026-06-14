/**
 * 创建 Path2D 对象
 * wx.createPath2D
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/render/canvas/wx.createPath2D.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 创建离屏 canvas 并绘制 */
function drawOnOffscreen(drawFn: (ctx: any, canvas: any) => void) {
  const offCanvas = wx.createCanvas();
  offCanvas.width = 200;
  offCanvas.height = 150;
  const ctx = offCanvas.getContext('2d');
  ctx.clearRect(0, 0, 200, 150);

  drawFn(ctx, offCanvas);

  offCanvas.toTempFilePath({
    fileType: 'png',
    quality: 1,
    success(res: any) {
      display.image(res.tempFilePath);
    },
    fail(err: any) {
      display.text(`截图失败：${err.errMsg}`);
    },
  });
}

/** 创建 Path2D 并绘制矩形和弧形路径 */
export function createPath2D() {
  drawOnOffscreen((ctx: any) => {
    const path = (wx as any).createPath2D();
    path.rect(10, 10, 100, 50);
    path.arc(60, 85, 40, 0, Math.PI * 2);
    ctx.strokeStyle = '#07c160';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  });
}

/** 添加路径指令绘制三角形 */
export function addPathCommand() {
  drawOnOffscreen((ctx: any) => {
    const path = (wx as any).createPath2D();
    path.moveTo(10, 10);
    path.lineTo(180, 10);
    path.lineTo(180, 130);
    path.closePath();
    ctx.fillStyle = '#ff6600';
    ctx.fill(path);
  });
}
