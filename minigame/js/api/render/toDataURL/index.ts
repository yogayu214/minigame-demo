/**
 * 画布转 DataURL
 * Canvas.toDataURL
 */

/** 将当前画布内容转为 base64 DataURL */
export function toDataURL() {
  const dataURL = canvas.toDataURL('image/png');
  console.log('DataURL 长度:', dataURL.length);
}
