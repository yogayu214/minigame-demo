/**
 * 服务端 API 用法说明（前端演示）
 *
 * 服务端 API 主要在云函数 / 自有服务器调用，前端通常通过 wx.cloud.callFunction
 * 或 wx.request 触发。这里展示几个常用 API 的"前端入口"用法。
 *
 * 涉及：
 *   - 二维码生成（服务端）：https://api.weixin.qq.com/wxa/getwxacodeunlimit
 *   - 内容安全（服务端）：https://api.weixin.qq.com/wxa/msg_sec_check
 *   - 数据加密（服务端）：用户加密信息解密
 *   - 短链生成（scheme/url-link）
 *   - 风控（getRiskInfo）
 *
 * 文档：https://developers.weixin.qq.com/minigame/dev/api-backend/
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const CLOUD_FN = 'serverDemo'; // 假设有一个名为 serverDemo 的云函数

function callCloudFn(action: string, params: any = {}) {
  if (typeof wx.cloud === 'undefined') {
    display.text('请先在小游戏中初始化 wx.cloud');
    return;
  }
  display.text(`调用云函数 ${CLOUD_FN}.${action} ...`);
  wx.cloud.callFunction({
    name: CLOUD_FN,
    data: { action, ...params },
    success(res: any) {
      display.data({
        action,
        result: JSON.stringify(res.result || {}).slice(0, 200),
      });
    },
    fail(err: any) {
      display.text(`✗ 云函数调用失败：${err.errMsg || err.message}`);
    },
  });
}

/** 服务端生成不限制小游戏码（getwxacodeunlimit） */
export function createQRCode() {
  callCloudFn('createQRCode', { scene: 'demo', page: 'pages/index/index' });
}

/** 服务端内容安全检测（msg_sec_check） */
export function gameSecCheck() {
  callCloudFn('msgSecCheck', { content: '测试内容是否合规' });
}

/** 服务端获取用户风险等级（getuserriskrank） */
export function getRiskInfo() {
  callCloudFn('getRiskInfo', { scene: 0 });
}

/** 服务端生成 url-scheme（仅小程序可用） */
export function generateScheme() {
  callCloudFn('generateScheme', { path: 'pages/index/index' });
}

/** 服务端用户数据上报（getDailyRetain 等） */
export function dataAnalysisQuery() {
  callCloudFn('getDailyRetain', { begin_date: '2024-01-01', end_date: '2024-01-07' });
}

/** 服务端加密信息解密（auth.code2Session + 解密 encryptedData） */
export function decryptUserInfo() {
  callCloudFn('decryptUserInfo', { code: 'demo_code', encryptedData: '...' });
}
