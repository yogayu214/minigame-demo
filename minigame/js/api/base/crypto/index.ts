/**
 * 用户加密
 * wx.getUserCryptoManager
 *   - UserCryptoManager.getLatestUserKey   获取最新用户加密密钥
 *   - UserCryptoManager.getRandomValues    获取密码学安全随机数
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/crypto/wx.getUserCryptoManager.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取最新的用户加密密钥 */
export function getLatestUserKey() {
  const mgr: any = wx.getUserCryptoManager();
  mgr.getLatestUserKey({
    success(res: any) {
      display.data({
        encryptKey: shorten(res.encryptKey),
        iv: shorten(res.iv),
        version: String(res.version),
        expireTime: new Date(res.expireTime * 1000).toLocaleString(),
      });
    },
    fail(err: any) {
      display.text(`获取失败：${err.errMsg}`);
    },
  });
}

/** 获取 6 字节密码学安全随机数 */
export function getRandomValues() {
  const mgr: any = wx.getUserCryptoManager();
  mgr.getRandomValues({
    length: 6,
    success(res: any) {
      const bytes = new Uint8Array(res.randomValues);
      display.data({
        长度: String(bytes.byteLength),
        十六进制: bufToHex(bytes),
      });
    },
    fail(err: any) {
      display.text(`获取失败：${err.errMsg}`);
    },
  });
}

function shorten(s: string) {
  if (!s) return '-';
  return s.length > 20 ? s.slice(0, 10) + '...' + s.slice(-6) : s;
}

function bufToHex(buf: Uint8Array) {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}
