/**
 * 画布截图生成临时文件
 * Canvas.toTempFilePath
 */

/** 截取画布内容生成临时文件路径 */
export function toTempFilePath() {
  canvas.toTempFilePath({
    x: 0, y: 0,
    width: canvas.width,
    height: canvas.height,
    success(res: any) { console.log('临时文件路径:', res.tempFilePath); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
