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
      let openDataContext: any = null;
      let sharedCanvas: any = null;
      let sharedTexture: any = null;
      let sharedSprite: any = null;

      try {
        openDataContext = wx.getOpenDataContext();
        sharedCanvas = openDataContext.canvas;

        // 初始化 sharedCanvas 尺寸并同步视口
        const systemInfo = wx.getSystemInfoSync();
        const { pixelRatio } = systemInfo;
        const ratio = PIXI.ratio;
        const canvasW = Math.floor(obj.width * ratio);
        const canvasH = Math.floor(obj.height * ratio);
        sharedCanvas.width = canvasW;
        sharedCanvas.height = canvasH;

        openDataContext.postMessage({
          event: 'updateViewPort',
          box: {
            width: canvasW,
            height: canvasH,
            x: 0,
            y: 0,
          },
        });

        // 创建 sharedCanvas texture + sprite
        sharedTexture = PIXI.Texture.fromCanvas(sharedCanvas);
        sharedSprite = new PIXI.Sprite(sharedTexture);
        sharedSprite.name = 'sharedCanvasSprite';
        sharedSprite.width = obj.width;
        sharedSprite.height = obj.height;
        sharedSprite.x = 0;
        sharedSprite.y = 120 * PIXI.ratio; // 下移避开标题栏遮挡（FPS/drawcall等）
        sharedSprite.visible = false;
        root.addChild(sharedSprite);

        // 每帧更新 sharedCanvas 到 PIXI 舞台
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

      // 监听子域消息，当子域开始渲染时显示 sharedCanvas
      const origOnLoad = mod.onLoad;
      mod.onLoad = () => {
        // 劫持 mod 中所有 postMessage 函数，发送后自动开启 sharedCanvas 显示
        sharedCanvasShowed = true;
        if (sharedSprite) sharedSprite.visible = true;

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
          if (sharedSprite) sharedSprite.visible = false;
          sharedCanvasShowed = false;
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

          if (sharedSprite) sharedSprite.visible = false;
          sharedCanvasShowed = false;
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
        },
        clear() {
          clearAll();
          hideModal();
        },
        /** 显示 sharedCanvas，供 UI 渲染类函数调用 */
        showCanvas() {
          // 先关闭文字弹窗（如果有）
          hideModal();
          clearAll();
          // 显示 sharedCanvas
          sharedCanvasShowed = true;
          if (sharedSprite) sharedSprite.visible = true;
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
      // 停止 sharedCanvas 渲染
      sharedCanvasShowed = false;
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
