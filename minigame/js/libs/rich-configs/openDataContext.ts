/**
 * 开放数据域专用 rich-config
 *
 * 与通用 display.ts 不同，本配置在 buildTopView 中额外处理了 sharedCanvas 渲染：
 *   - 主域通过 postMessage 让子域渲染排行榜等内容到 sharedCanvas
 *   - 主域需要每帧将 sharedCanvas 绘制到 PIXI 舞台上才能看到
 *   - 切换到其他页面时自动停止渲染并清理
 */

import type { RichConfig } from '../rich-renderer';
import type { DisplayApi, DisplayModule } from './display';

export function createOpenDataContextConfig(
  mod: DisplayModule,
  pageLabel?: string
): RichConfig {
  const { p_text, p_box } = require('../component/index');
  const Scroller = require('../Scroller/index');

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
    title: mod.title || pageLabel || '',
    apiName: mod.apiName || '',
    actions,

    buildTopView(PIXI: any, app: any, obj: any, _underline: any) {
      const root = new PIXI.Container();
      rootRef = root;

      // ============== sharedCanvas 渲染 ==============
      // 对齐旧版 minigame-demo ShareCanvas.js 的已验证策略：
      //   1. sharedCanvas 尺寸 = 子域 designSize（960×1410），与 style.ts 设计稿 1:1
      //   2. sprite 按屏幕比例缩放并居中（卡片式全屏覆盖感）
      //   3. updateViewPort 传物理→逻辑映射值（旧版 updateSubViewPort 公式）
      //   4. 右上角浮层关闭按钮
      let openDataContext: any = null;
      let sharedCanvas: any = null;
      let sharedTexture: any = null;
      let sharedSprite: any = null;
      // 全屏不透明遮罩 + 浮层关闭按钮
      let canvasOverlay: any = null;
      let canvasCloseBtn: any = null;

      // 子域设计稿尺寸（必须与 open-data-context/render/style.ts container 一致）
      const DESIGN_W = 960;
      const DESIGN_H = 1410;

      // 隐藏 sharedCanvas 相关元素
      const hideSharedCanvasView = () => {
        sharedCanvasShowed = false;
        if (sharedSprite) sharedSprite.visible = false;
        if (canvasOverlay) canvasOverlay.visible = false;
        if (canvasCloseBtn) canvasCloseBtn.visible = false;
      };

      try {
        openDataContext = wx.getOpenDataContext();
        sharedCanvas = openDataContext.canvas;
        const info = wx.getSystemInfoSync();
        const GAME_WIDTH = info.windowWidth * info.pixelRatio;
        const GAME_HEIGHT = info.windowHeight * info.pixelRatio;

        // ---- 1. sharedCanvas 固定为设计稿尺寸（子域 Layout 按 960×1410 渲染）----
        sharedCanvas.width = DESIGN_W;
        sharedCanvas.height = DESIGN_H;

        // ---- 2. 计算显示尺寸（对齐旧版 ShareCanvas.js 的适配公式）----
        // 旧版用 times=0.85（即屏幕宽度的 85%），这里改为 0.92 更饱满
        const coverRatio = 0.92;
        const displayW = Math.floor(GAME_WIDTH * coverRatio);
        const displayH = Math.floor((DESIGN_H / DESIGN_W) * displayW);

        // ---- 3. updateViewPort（旧版 updateSubViewPort 公式：物理→逻辑映射）----
        // 旧版: realWidth = width / GAME_WIDTH * windowWidth
        // 这会把物理像素的显示尺寸映射回逻辑像素传给子域 Layout
        const viewPortW = displayW / GAME_WIDTH * info.windowWidth;
        const viewPortH = displayH / GAME_HEIGHT * info.windowHeight;
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

        // ---- 4. 全屏遮罩（白色底，盖住底层按钮列表）----
        canvasOverlay = new PIXI.Graphics();
        canvasOverlay
          .beginFill(0xffffff)
          .drawRect(0, 0, obj.width, obj.height)
          .endFill();
        canvasOverlay.name = 'canvasOverlay';
        canvasOverlay.visible = false;
        root.addChild(canvasOverlay);

        // ---- 5. sharedCanvas texture + sprite（居中卡片式）----
        sharedTexture = PIXI.Texture.fromCanvas(sharedCanvas);
        sharedSprite = new PIXI.Sprite(sharedTexture);
        sharedSprite.name = 'sharedCanvasSprite';
        sharedSprite.width = displayW;
        sharedSprite.height = displayH;
        // 居中放置（对齐旧版 renderFriendRank 的居中公式）
        sharedSprite.x = (obj.width - displayW) / 2;
        sharedSprite.y = (obj.height - displayH) / 2;
        sharedSprite.visible = false;
        root.addChild(sharedSprite);

        // ---- 6. 浮层关闭按钮（sprite 右上角外侧）----
        const floatCloseSize = 72 * PIXI.ratio;
        canvasCloseBtn = new PIXI.Container();
        // 按钮位置：相对于 sprite 右上角，偏移一定间距
        canvasCloseBtn.x = sharedSprite.x + displayW - floatCloseSize * 0.3;
        canvasCloseBtn.y = sharedSprite.y - floatCloseSize * 0.3;
        const fcbBg = new PIXI.Graphics();
        fcbBg
          .beginFill(0x000000, 0.5)
          .drawCircle(floatCloseSize / 2, floatCloseSize / 2, floatCloseSize / 2)
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
            wx.getOpenDataContext().postMessage({ event: 'close' });
          } catch (_e) {
            /* noop */
          }
        };

        // ---- 7. 每帧刷新纹理 ----
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
        // 开发工具可能不支持，静默处理
      }

      // 业务模块的 onLoad 透传（进入页面不自动显示 sharedCanvas）
      const origOnLoad = mod.onLoad;
      mod.onLoad = () => {
        if (origOnLoad) {
          try {
            origOnLoad();
          } catch (e) {
            console.error('onLoad error:', e);
          }
        }
      };

      // ============== 弹窗结构（和 display.ts 一样） ==============
      const modal = new PIXI.Container();
      modal.visible = false;

      const overlay = new PIXI.Graphics();
      overlay
        .beginFill(0x000000, 0.45)
        .drawRect(0, 0, obj.width, obj.height)
        .endFill();
      overlay.interactive = true;
      modal.addChild(overlay);

      const cardW = Math.min(obj.width - 60 * PIXI.ratio, 620 * PIXI.ratio);
      const cardH = Math.min(obj.height - 240 * PIXI.ratio, 900 * PIXI.ratio);
      const cardX = (obj.width - cardW) / 2;
      const cardY = (obj.height - cardH) / 2;

      const card = new PIXI.Container();
      card.x = cardX;
      card.y = cardY;
      card.interactive = true;
      (card as any).touchstart = (e: any) => e.stopPropagation();
      (card as any).touchend = (e: any) => e.stopPropagation();

      const cardBg = new PIXI.Graphics();
      cardBg
        .beginFill(0xffffff)
        .drawRoundedRect(0, 0, cardW, cardH, 16 * PIXI.ratio)
        .endFill();
      card.addChild(cardBg);

      const headerH = 80 * PIXI.ratio;
      const titleText = p_text(PIXI, {
        content: '调用结果',
        fontSize: 30 * PIXI.ratio,
        fill: 0x353535,
        fontWeight: 'bold',
        x: 30 * PIXI.ratio,
        y: 24 * PIXI.ratio,
      });
      card.addChild(titleText);

      const closeSize = 56 * PIXI.ratio;
      const closeBtn = new PIXI.Container();
      closeBtn.x = cardW - closeSize - 16 * PIXI.ratio;
      closeBtn.y = 12 * PIXI.ratio;
      const closeBg = new PIXI.Graphics();
      closeBg
        .beginFill(0xf2f2f2)
        .drawCircle(closeSize / 2, closeSize / 2, closeSize / 2)
        .endFill();
      const closeIcon = p_text(PIXI, {
        content: '✕',
        fontSize: 28 * PIXI.ratio,
        fill: 0x666666,
        relative_middle: {
          containerWidth: closeSize,
          containerHeight: closeSize,
        },
      });
      closeBtn.addChild(closeBg, closeIcon);
      closeBtn.interactive = true;
      card.addChild(closeBtn);

      const headerLine = new PIXI.Graphics();
      headerLine
        .beginFill(0xeeeeee)
        .drawRect(
          20 * PIXI.ratio,
          headerH,
          cardW - 40 * PIXI.ratio,
          PIXI.ratio | 0
        )
        .endFill();
      card.addChild(headerLine);

      const contentTop = headerH + 16 * PIXI.ratio;
      const contentBottom = cardH - 20 * PIXI.ratio;
      const contentH = contentBottom - contentTop;
      const contentW = cardW;

      const contentWrapper = new PIXI.Container();
      contentWrapper.x = 0;
      contentWrapper.y = contentTop;
      contentWrapper.interactive = true;

      const contentInner = new PIXI.Container();
      contentInner.x = 0;
      contentInner.y = 0;

      const contentMask = new PIXI.Graphics();
      contentMask
        .beginFill(0xffffff)
        .drawRect(0, 0, contentW, contentH)
        .endFill();
      contentInner.mask = contentMask;

      const hit = new PIXI.Graphics();
      hit
        .beginFill(0xffffff, 0)
        .drawRect(0, 0, contentW, contentH)
        .endFill();
      hit.interactive = true;

      contentWrapper.addChild(hit, contentInner, contentMask);
      card.addChild(contentWrapper);

      modal.addChild(card);
      root.addChild(modal);

      const scroller = new Scroller((_l: number, t: number) => {
        contentInner.y = -t;
      });
      let scrollRegistered = false;
      const layoutScroll = () => {
        const total = contentInner.height || 0;
        scroller.contentSize(contentW, contentH, contentW, total);
        scrollRegistered = true;
      };

      (contentWrapper as any).touchstart = (e: any) => {
        e.stopPropagation();
        if (!scrollRegistered) return;
        scroller.doTouchStart(e.data.global.x, e.data.global.y);
      };
      (contentWrapper as any).touchmove = (e: any) => {
        e.stopPropagation();
        if (!scrollRegistered) return;
        scroller.doTouchMove(
          e.data.global.x,
          e.data.global.y,
          e.data.originalEvent.timeStamp
        );
      };
      (contentWrapper as any).touchend = (e: any) => {
        e.stopPropagation();
        if (!scrollRegistered) return;
        scroller.doTouchEnd(e.data.originalEvent.timeStamp);
      };

      const showModal = () => {
        modal.visible = true;
        contentInner.y = 0;
      };
      const hideModal = () => {
        modal.visible = false;
      };
      (overlay as any).touchstart = (e: any) => {
        e.stopPropagation();
        overlay._touchStartY = e.data.global.y;
        overlay._touchStartTime = e.data.originalEvent.timeStamp;
      };
      (overlay as any).touchend = (e: any) => {
        e.stopPropagation();
        const dy = Math.abs(e.data.global.y - (overlay._touchStartY ?? 0));
        const dt =
          e.data.originalEvent.timeStamp -
          (overlay._touchStartTime ?? 0);
        if (dy < 10 && dt < 300) {
          hideModal();
        }
      };
      (closeBtn as any).touchend = (e: any) => {
        e.stopPropagation();
        hideModal();
      };

      const padX = 24 * PIXI.ratio;
      const padY = 16 * PIXI.ratio;
      const innerW = contentW - padX * 2;

      const textView: any = new PIXI.Text('', {
        fontSize: `${28 * PIXI.ratio}px`,
        fill: 0x555555,
        lineHeight: 40 * PIXI.ratio,
        wordWrap: true,
        wordWrapWidth: innerW,
        breakWords: true,
      });
      textView.x = padX;
      textView.y = padY;
      textView.visible = false;

      const dataView = new PIXI.Container();
      dataView.visible = false;
      dataView.x = padX;
      dataView.y = padY;

      let imageView: any = null;
      contentInner.addChild(textView, dataView);

      const clearAll = () => {
        textView.visible = false;
        dataView.visible = false;
        if (imageView) imageView.visible = false;
      };

      const setTitle = (s: string) => {
        if ((titleText as any).turnText) (titleText as any).turnText(s);
      };

      const api: DisplayApi = {
        text(content: string) {
          clearAll();
          textView.visible = true;
          textView.text = content;
          setTitle('调用结果');
          showModal();
          layoutScroll();

          // 文本弹窗显示时隐藏 sharedCanvas，避免遮挡
          hideSharedCanvasView();
        },
        data(kv: Record<string, any>) {
          clearAll();
          dataView.visible = true;
          while (dataView.children.length > 0) {
            dataView.removeChildAt(0);
          }

          const keyFontSize = 24 * PIXI.ratio;
          const valFontSize = 26 * PIXI.ratio;
          const lineHeight = 36 * PIXI.ratio;
          const rowMinH = 64 * PIXI.ratio;
          const rowPadX = 16 * PIXI.ratio;
          const rowPadY = 18 * PIXI.ratio;
          const colGap = 24 * PIXI.ratio;
          const keyColMax = Math.floor(innerW * 0.5);

          const rows: { key: string; value: any; keyT: any }[] = [];
          let maxKeyWidth = 0;
          for (const [key, value] of Object.entries(kv)) {
            const keyT = new PIXI.Text(String(key), {
              fontSize: `${keyFontSize}px`,
              fill: 0x353535,
              lineHeight,
              wordWrap: true,
              wordWrapWidth: keyColMax,
              breakWords: true,
            });
            if (keyT.width > maxKeyWidth) maxKeyWidth = keyT.width;
            rows.push({ key, value, keyT });
          }

          const valX =
            rowPadX + Math.min(maxKeyWidth, keyColMax) + colGap;
          const valMaxW = innerW - valX - rowPadX;

          let yOffset = 0;
          for (const { value, keyT } of rows) {
            const valWrapWidth = Math.max(valMaxW, innerW * 0.45);
            const valT = new PIXI.Text(String(value), {
              fontSize: `${valFontSize}px`,
              fill: 0x666666,
              lineHeight,
              wordWrap: true,
              wordWrapWidth: valWrapWidth,
              breakWords: true,
            });
            valT.x = valX;
            valT.y = rowPadY;
            keyT.x = rowPadX;
            keyT.y = rowPadY;

            const rowContentH = Math.max(keyT.height, valT.height);
            const rowH = Math.max(rowMinH, rowContentH + rowPadY * 2);

            const row = p_box(PIXI, {
              width: innerW,
              height: rowH,
              y: yOffset,
              color: 0xfafafa,
            });
            row.addChild(keyT, valT);
            dataView.addChild(row);
            yOffset += rowH + 6 * PIXI.ratio;
          }
          setTitle('调用结果');
          showModal();
          layoutScroll();

          hideSharedCanvasView();
        },
        image(src: string) {
          clearAll();
          if (imageView) {
            contentInner.removeChild(imageView);
            imageView.destroy(true);
            imageView = null;
          }
          const img = new PIXI.Sprite(PIXI.Texture.fromImage(src));
          const maxImgW = innerW;
          const maxImgH = contentH - padY * 2;
          const size = Math.min(maxImgW, maxImgH, 480 * PIXI.ratio);
          img.width = size;
          img.height = size;
          img.x = (contentW - size) / 2;
          img.y = padY;
          contentInner.addChild(img);
          imageView = img;
          setTitle('调用结果');
          showModal();
          layoutScroll();
          hideSharedCanvasView();
        },
        clear() {
          clearAll();
          hideModal();
        },
        /** 全屏展示 sharedCanvas（盖住按钮列表，提供浮层关闭按钮） */
        showCanvas() {
          // 先关闭文字弹窗（如果有）
          hideModal();
          clearAll();
          // 全屏展示 sharedCanvas + 遮罩 + 关闭按钮
          if (canvasOverlay) canvasOverlay.visible = true;
          if (sharedSprite) sharedSprite.visible = true;
          if (canvasCloseBtn) {
            canvasCloseBtn.visible = true;
            // 关闭按钮置顶，确保可点
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
      // 停止 sharedCanvas 渲染并隐藏相关元素
      // （navigateBack 不销毁页面，需手动隐藏避免再次进入时残留）
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

      // 通知子域关闭画布
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
