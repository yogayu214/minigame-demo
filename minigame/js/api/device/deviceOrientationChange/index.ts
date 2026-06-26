/**
 * 横竖屏切换
 * wx.setDeviceOrientation
 *
 * 策略：横屏时对页面容器整体 scale 缩小 + 居中，竖屏时恢复。
 * 不改 renderer/ratio，避免按钮变形。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 当前被适配的页面容器 */
let _adaptedContainer: any = null;

/**
 * 容器原始尺寸（首次获取容器时记录，不受后续 scale 影响）。
 * 这是关键：不能用 renderer 尺寸，要用容器自身尺寸！
 */
let _origW = 0;
let _origH = 0;

/** 是否已经完成适配（防止重复执行覆盖结果） */
let _adapted = false;

/**
 * 获取屏幕物理像素尺寸
 */
function getScreenSize(): { w: number; h: number } {
  try {
    if (wx.getWindowInfo) {
      const info = wx.getWindowInfo();
      return { w: info.windowWidth * info.pixelRatio, h: info.windowHeight * info.pixelRatio };
    }
  } catch (e) { /* ignore */ }
  const info = wx.getSystemInfoSync();
  return { w: info.windowWidth * info.pixelRatio, h: info.windowHeight * info.pixelRatio };
}

/**
 * 获取当前页面容器
 */
function getPageContainer(): any | null {
  const router = (window as any).router;
  if (router) {
    let found: any = null;
    router.getNowPage((page: any) => { found = page?.page || null; });
    if (found) return found;
  }

  const app = (globalThis as any).__pixiApp;
  if (app?.stage?.children?.length) {
    return app.stage.children[app.stage.children.length - 1];
  }
  return null;
}

/**
 * 横屏适配：对容器做等比缩放 + 居中
 */
function applyLandscapeAdapt() {
  // 防止重复执行
  if (_adapted) {
    console.log('[orientation] already adapted, skip');
    return;
  }

  const container = getPageContainer();
  if (!container) {
    console.error('[orientation] no container found');
    return;
  }

  // 首次获取时保存容器原始尺寸（此时 scale 必为 1）
  if (_origW === 0 || _origH === 0) {
    _origW = container.width;
    _origH = container.height;
  }

  if (!_origW || !_origH) {
    console.error('[orientation] invalid container size:', _origW, _origH);
    return;
  }

  _adaptedContainer = container;
  const { w: screenW, h: screenH } = getScreenSize();

  // 横屏后如果 API 返回的宽高没互换，手动处理
  let sw = screenW, sh = screenH;
  if (sw < sh) { const t = sw; sw = sh; sh = t; }

  // 核心：将容器(原始尺寸) 缩放放入 横屏屏幕
  const scale = Math.min(sw / _origW, sh / _origH);
  // 暂时只用 scale 不动位置，先确认缩放后内容的基准位置
  const cx = 0;  // (sw - _origW * scale) / 2;
  const cy = 0;  // (sh - _origH * scale) / 2;

  console.log('[orientation] adapt:',
    `container=${Math.round(_origW)}x${Math.round(_origH)}`,
    `screen=${sw}x${sh}`,
    `scale=${scale.toFixed(4)}`,
    `pos=${Math.round(cx)},${Math.round(cy)} [DEBUG: pos locked to 0]`);

  container.scale.set(scale);
  container.x = cx;
  container.y = cy;
  _adapted = true;
}

/** 恢复容器到原始状态 */
function resetContainer() {
  if (_adaptedContainer) {
    _adaptedContainer.scale.set(1);
    _adaptedContainer.x = 0;
    _adaptedContainer.y = 0;
    _adaptedContainer = null;
  }
  _adapted = false;
}

/** 切换为横屏 */
export function switchToLandscape() {
  _adapted = false; // 重置标志位，允许新的适配
  wx.setDeviceOrientation({
    value: 'landscape',
    success() {
      setTimeout(() => {
        applyLandscapeAdapt();
        wx.showToast({ title: '已切换为横屏', icon: 'none' });
      }, 300);
    },
    fail(err: any) {
      wx.showToast({ title: `失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 切换为竖屏 */
export function switchToPortrait() {
  wx.setDeviceOrientation({
    value: 'portrait',
    success() {
      setTimeout(() => {
        resetContainer();
        wx.showToast({ title: '已切换为竖屏', icon: 'none' });
      }, 150);
    },
    fail(err: any) {
      wx.showToast({ title: `失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 页面卸载时切回竖屏并恢复 */
export function onUnload() {
  try { wx.setDeviceOrientation({ value: 'portrait' }); } catch (e) { /* ignore */ }
  resetContainer();
}
