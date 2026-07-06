/**
 * 获取群进群信息
 * wx.getGroupEnterInfo
 *
 * 完整流程：
 *   1. 点击「分享到群」按钮 → 调用 shareAppMessage 分享到微信群
 *   2. 群友点击会话卡片重新打开小游戏（携带 shareTicket）
 *   3. 在 onShow / 启动参数中检测到 shareTicket → 自动调用 getGroupEnterInfo
 *
 * 注意：getShareInfo 已废弃，请使用 getGroupEnterInfo 替代。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

/** 记录最后一次检测的 shareTicket，避免重复调用 */
let lastProcessedTicket = '';
let onShowFn: ((res: any) => void) | null = null;

/**
 * 步骤一：分享到群
 *
 * 用户点击后弹出分享卡片，引导用户从群里点进来。
 * query 中携带标记，方便后续在 onShow 中识别是群回流。
 */
export function shareToGroup() {
  try {
    wx.shareAppMessage({
      title: '来试试这个小游戏吧！',
      query: 'fromGroupShare=1',
      imageUrl: canvas.toTempFilePathSync({
        x: 0,
        y: 0,
        width: canvas.width,
        height: (canvas.width * 4) / 5,
      }),
    });
    toast('请从群里点击会话卡片进入，将自动获取群进群信息');
  } catch (e: any) {
    toast(`分享失败: ${e.message}`);
  }
}

/**
 * 检测群回流并获取群进群信息
 *
 * 当用户从群内点开会话卡片时，onShow 回调 / 启动参数中会携带
 * shareTicket，此时调用 getGroupEnterInfo 获取群的加密数据
 * （openGId 等），可用于服务端解密。
 */
function detectAndGetGroupEnterInfo(res: any) {
  const ticket = res?.shareTicket;
  // 无 shareTicket 或已处理过，跳过
  if (!ticket || ticket === lastProcessedTicket) return;
  lastProcessedTicket = ticket;

  wx.getGroupEnterInfo({
    success(info: any) {
      toast(`获取成功 | errMsg: ${info.errMsg || ''}`);
      console.log('[getGroupEnterInfo]', info);
    },
    fail(err: any) {
      toast(`获取失败: ${err?.errMsg || '未知错误'}`);
      console.warn('[getGroupEnterInfo] fail:', err);
    },
  });
}

/** 页面加载时注册监听 + 冷启动检测 */
export function onLoad() {
  onShowFn = detectAndGetGroupEnterInfo;
  wx.onShow(detectAndGetGroupEnterInfo);

  // 冷启动也可能携带 shareTicket（如从群内分享卡片直接启动）
  try {
    detectAndGetGroupEnterInfo(wx.getLaunchOptionsSync());
  } catch (_e) {
    /* noop */
  }
}

export function onUnload() {
  if (onShowFn) {
    (wx as any).offShow?.(onShowFn);
    onShowFn = null;
  }
}
