/**
 * 商户转账
 * wx.requestMerchantTransfer
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/midas-merchant-transfer/wx.requestMerchantTransfer.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 查询当前小游戏账号信息（包含 mch_id 等） */
export function getAccountInfo() {
  const info = wx.getAccountInfoSync();
  display.data({
    appId: info.miniProgram?.appId || '-',
    envVersion: info.miniProgram?.envVersion || '-',
    version: info.miniProgram?.version || '-',
  });
}

/** 发起商户号转账（需后台预先配置商户号 + 签名串） */
export function requestMerchantTransfer() {
  (wx as any).requestMerchantTransfer({
    mchId: '1900000001',
    appId: wx.getAccountInfoSync().miniProgram?.appId || '',
    package: 'placeholder',      // 由服务端生成的预下单 package
    success(res: any) {
      display.data({ 状态: '✓ 转账成功', 详情: JSON.stringify(res) });
    },
    fail(err: any) {
      display.data({ 状态: '✗ 转账失败', 原因: err.errMsg });
    },
  });
}
