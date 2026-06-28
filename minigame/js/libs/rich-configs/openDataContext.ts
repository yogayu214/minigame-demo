/**
 * 开放数据域专用 rich-config
 *
 * 按钮布局：自动从 index.ts 导出函数生成（和其他 display 页面一致）。
 * buildTopView 中额外处理 sharedCanvas 渲染：
 *   - 主域通过 postMessage 让子域渲染排行榜等内容到 sharedCanvas
 *   - 主域每帧将 sharedCanvas 刷成纹理贴到舞台
 *   - 浮层右上角有关闭按钮，点击关闭画布
 *   - 切换页面时自动停止渲染并清理
 */

import type { RichConfig } from '../rich-renderer';
import type { DisplayApi, DisplayModule } from './display';

export function createOpenDataContextConfig(
  mod: DisplayModule,
  pageLabel?: string,
): RichConfig {
  const { p_text } = require('../component/index');

  // 自动从导出函数生成按钮
  const skipKeys = [
    '__esModule',
    'default',
    'title',
    'apiName',
    'onLoad',
    'onUnload',
    'setDisplay',
  ];
  const actions: { label: string; handler: () => void }[] = [];
  for (const key of Object.keys(mod)) {
    if (skipKeys.includes(key)) continue;
    if (typeof mod[key] === 'function') {
      actions.push({
        label: key,
        handler: () => mod[key](),
      });
    }
  }

  let rootRef: any = null;
  let sharedCanvasShowed = false;
  let tickerFn: ((dt: number) => void) | null = null;

  return {
    title: mod.title || pageLabel || '开放数据域',
    apiName: mod.apiName || '排行榜',
    actions,

    buildTopView(PIXI: any, app: any, obj: any, _underline: any) {
      const root = new PIXI.Container();
      rootRef = root;

      // ============== sharedCanvas 渲染 ==============
      let sharedCanvas: any = null;
      let sharedTexture: any = null;
      let sharedSprite: any = null;
      let canvasOverlay: any = null;
      let canvasCloseBtn: any = null;

      const DESIGN_W = 960;
      const DESIGN_H = 1410;

      const hideSharedCanvasView = () => {
        sharedCanvasShowed = false;
        if (sharedSprite) sharedSprite.visible = false;
        if (canvasOverlay) canvasOverlay.visible = false;
        if (canvasCloseBtn) canvasCloseBtn.visible = false;
      };

      try {
        const openDataContext = wx.getOpenDataContext();
        sharedCanvas = openDataContext.canvas;
        const info = wx.getSystemInfoSync();
        const GAME_WIDTH = info.windowWidth * info.pixelRatio;
        const GAME_HEIGHT = info.windowHeight * info.pixelRatio;

        sharedCanvas.width = DESIGN_W;
        sharedCanvas.height = DESIGN_H;

        // 对齐 demo2 ShareCanvas.js：times=0.85
        const coverRatio = 0.85;
        const displayW = Math.floor(GAME_WIDTH * coverRatio);
        const displayH = Math.floor((DESIGN_H / DESIGN_W) * displayW);

        // 对齐 demo2 updateSubViewPort：物理→逻辑映射
        const viewPortW = (displayW / GAME_WIDTH) * info.windowWidth;
        const viewPortH = (displayH / GAME_HEIGHT) * info.windowHeight;
        const viewPortX = (info.windowWidth - viewPortW) / 2;
        const viewPortY = (info.windowHeight - viewPortH) / 2;

        openDataContext.postMessage({
          event: 'updateViewPort',
          box: {
            width: viewPortW,
            height: viewPortH,
            x: viewPortX,
            y: viewPortY,
          },
        });

        // 全屏遮罩（用页面背景色，视觉上"隐藏"按钮列表，对齐 demo2 隐藏 box 的效果）
        canvasOverlay = new PIXI.Graphics();
        canvasOverlay
          .beginFill(0xf6f6f6)
          .drawRect(0, 0, obj.width, obj.height)
          .endFill();
        canvasOverlay.name = 'canvasOverlay';
        canvasOverlay.visible = false;
        root.addChild(canvasOverlay);

        // sharedCanvas texture + sprite
        sharedTexture = PIXI.Texture.fromCanvas(sharedCanvas);
        sharedSprite = new PIXI.Sprite(sharedTexture);
        sharedSprite.name = 'sharedCanvasSprite';
        sharedSprite.width = displayW;
        sharedSprite.height = displayH;
        sharedSprite.x = (obj.width - displayW) / 2;
        sharedSprite.y = (obj.height - displayH) / 2;
        sharedSprite.visible = false;
        root.addChild(sharedSprite);

        // 浮层关闭按钮（sprite 右上角）
        const floatCloseSize = 72 * PIXI.ratio;
        canvasCloseBtn = new PIXI.Container();
        canvasCloseBtn.x = sharedSprite.x + displayW - floatCloseSize * 0.3;
        canvasCloseBtn.y = sharedSprite.y - floatCloseSize * 0.3;
        const fcbBg = new PIXI.Graphics();
        fcbBg
          .beginFill(0x000000, 0.5)
          .drawCircle(
            floatCloseSize / 2,
            floatCloseSize / 2,
            floatCloseSize / 2,
          )
          .endFill();
        const fcbIcon = p_text(PIXI, {
          content: '✕',
          fontSize: 34 * PIXI.ratio,
          fill: 0xffffff,
          relative_middle: {
            containerWidth: floatCloseSize,
            containerHeight: floatCloseSize,
          },
        });
        canvasCloseBtn.addChild(fcbBg, fcbIcon);
        canvasCloseBtn.name = 'canvasCloseBtn';
        canvasCloseBtn.visible = false;
        canvasCloseBtn.interactive = true;
        root.addChild(canvasCloseBtn);
        (canvasCloseBtn as any).touchend = (e: any) => {
          e.stopPropagation();
          hideSharedCanvasView();
          try {
            mod.closeCanvas();
          } catch (_e) {
            /* noop */
          }
        };

        // 每帧刷新纹理
        tickerFn = () => {
          if (!sharedCanvasShowed) return;
          try {
            sharedTexture.update();
          } catch (_e) {
            /* noop */
          }
        };
        app.ticker.add(tickerFn);
      } catch (_e) {
        /* 开发工具可能不支持 */
      }

      // ============== DisplayApi（供 logic 层调用 showCanvas） ==============
      const api: DisplayApi = {
        text(_content: string) {
          /* 已改用 toast */
        },
        data(_kv: Record<string, any>) {
          /* 已改用 toast */
        },
        image(_src: string) {
          /* noop */
        },
        clear() {
          /* noop */
        },
        showCanvas() {
          if (canvasOverlay) canvasOverlay.visible = true;
          if (sharedSprite) sharedSprite.visible = true;
          if (canvasCloseBtn) {
            canvasCloseBtn.visible = true;
            try {
              root.setChildIndex(canvasCloseBtn, root.children.length - 1);
            } catch (_e) {
              /* noop */
            }
          }
          sharedCanvasShowed = true;
        },
      };

      mod.setDisplay(api);

      return root;
    },

    onLoad() {
      try {
        const parent = rootRef && rootRef.parent;
        if (parent) {
          parent.setChildIndex(rootRef, parent.children.length - 1);
        }
      } catch (e) {
        /* noop */
      }

      if (mod.onLoad) {
        try {
          mod.onLoad();
        } catch (e) {
          console.error('onLoad error:', e);
        }
      }
    },

    onUnload(app: any) {
      sharedCanvasShowed = false;
      if (rootRef) {
        try {
          const s = rootRef.getChildByName('sharedCanvasSprite');
          if (s) s.visible = false;
          const o = rootRef.getChildByName('canvasOverlay');
          if (o) o.visible = false;
          const c = rootRef.getChildByName('canvasCloseBtn');
          if (c) c.visible = false;
        } catch (_e) {
          /* noop */
        }
      }
      if (tickerFn && app) {
        app.ticker.remove(tickerFn);
        tickerFn = null;
      }

      try {
        wx.getOpenDataContext().postMessage({ event: 'close' });
      } catch (_e) {
        /* noop */
      }

      if (mod.onUnload) {
        try {
          mod.onUnload();
        } catch (e) {
          /* noop */
        }
      }
    },
  };
}
