/**
 * 字符编解码工具
 * wx.encode / wx.decode
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/util/wx.encode.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let lastEncoded: ArrayBuffer | null = null;

/** 字符串编码为 ArrayBuffer（UTF-8） */
export function encodeUtf8() {
  const text = 'Hello 小游戏 🎮';
  const buf: ArrayBuffer = wx.encode({ data: text, format: 'utf8' });
  lastEncoded = buf;
  display.data({
    原文: text,
    编码: 'utf8',
    字节长度: String(buf.byteLength),
    十六进制: bufToHex(new Uint8Array(buf)).slice(0, 60) + '...',
  });
}

/** 用上一步的 ArrayBuffer 解码回字符串 */
export function decodeUtf8() {
  if (!lastEncoded) {
    display.text('请先点 encodeUtf8');
    return;
  }
  const text: string = wx.decode({ data: lastEncoded, format: 'utf8' });
  display.data({
    输入字节长度: String(lastEncoded.byteLength),
    解码格式: 'utf8',
    结果: text,
  });
}

function bufToHex(buf: Uint8Array) {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}
