import type { RichConfig } from '../rich-renderer';
import { ARRenderer, ARMode, ARConfig } from '../../api/ai/common/arRenderer';

export interface ARModuleConfig {
  title: string;
  tip: string;
  buttonName: string | null;
  mode: ARMode;
  vkConfig: ARConfig;
}

export function createArConfig(mod: any, pageLabel?: string): RichConfig {
  const { p_text, p_button } = require('../component/index');
  const cfg: ARModuleConfig = mod.arConfig || mod.default;

  let rootRef: any = null;
  let renderer: ARRenderer | null = null;
  let arTexture: any = null;
  let arSprite: any = null;
  let tickerFn: ((dt: number) => void) | null = null;
  let switchBtn: any = null;
  let switchBtnText: any = null;

  // 2D 中转 canvas（用于将 WebGL 离屏 canvas 的内容 drawImage 过来，再生成 PIXI 纹理）
  // 对齐旧版 behavior.js：canvas2dContext.drawImage(offScreenCanvas, ...) 模式
  let transfer2dCanvas: any = null;
  let transfer2dCtx: any = null;

  return {
    title: cfg.title || pageLabel || '',
    apiName: '',

    buildTopView(PIXI: any, app: any, obj: any, underline: any) {
      const root = new PIXI.Container();
      rootRef = root;

      // 计算 AR 画面区域的尺寸和位置
      const underlineBottom = underline
        ? (underline.y || 0) + (underline.height || 0)
        : 0;
      const screenTop = underlineBottom + 20 * PIXI.ratio;
      const logoH = 100 * PIXI.ratio;
      const screenBottom = obj.height - logoH - 20 * PIXI.ratio;
      const screenH = screenBottom - screenTop;

      // AR 画面区域（PIXI Graphics 背景 + Canvas Texture 叠加）
      const screenBg = new PIXI.Graphics();
      screenBg
        .beginFill(0x000000)
        .drawRect(0, screenTop, obj.width, screenH)
        .endFill();
      screenBg.interactive = true;
      root.addChild(screenBg);

      // 提示文字
      const tipText = p_text(PIXI, {
        content: cfg.tip,
        fontSize: 26 * PIXI.ratio,
        fill: 0x576b95,
        y: screenBottom + 10 * PIXI.ratio,
        relative_middle: {
          containerWidth: obj.width,
        },
      });
      root.addChild(tipText);

      // 可选：摄像头切换按钮
      if (cfg.buttonName) {
        switchBtn = p_button(PIXI, {
          width: 370 * PIXI.ratio,
          height: 80 * PIXI.ratio,
          fill: 0x07c160,
          x: (obj.width - 370 * PIXI.ratio) / 2,
          y: screenTop + 20 * PIXI.ratio,
        });
        switchBtnText = p_text(PIXI, {
          content: cfg.buttonName,
          fontSize: 32 * PIXI.ratio,
          fill: 0x000000,
          relative_middle: {
            containerWidth: switchBtn.width,
            containerHeight: switchBtn.height,
          },
        });
        switchBtn.myAddChildFn(switchBtnText);
        switchBtn.interactive = true;
        switchBtn.onClickFn(() => {
          if (renderer) {
            renderer.switchCamera();
            if (switchBtnText && switchBtnText.turnText) {
              const current = cfg.vkConfig.cameraPosition || 0;
              switchBtnText.turnText(
                current === 0 ? '切换为前置摄像头' : '切换为后置摄像头'
              );
            }
          }
        });
        root.addChild(switchBtn);
      }

      // 初始化 ARRenderer
      const arCanvasWidth = obj.width;
      const arCanvasHeight = screenH;

      // 计算 YUV 渲染的屏幕裁剪参数（将物理像素映射到 -1~1 范围）
      const yuvScreenTop = -1 + (screenTop / obj.height) * 2;
      const yuvScreenBottom = -1 + (screenBottom / obj.height) * 2;

      renderer = new ARRenderer({
        mode: cfg.mode,
        config: { ...cfg.vkConfig },
        width: arCanvasWidth,
        height: arCanvasHeight,
        screenTop: yuvScreenTop,
        screenBottom: yuvScreenBottom,
        onTouchEnd: (x: number, y: number) => {
          // 将触摸坐标从 PIXI 坐标转换为 AR Canvas 坐标
          const arX = x;
          const arY = y - screenTop;
          if (renderer) {
            renderer.onTouchEnd(arX, arY);
          }
        },
      });

      // 初始化 ARRenderer（用 try-catch 防止环境不支持时崩溃）
      let initError: string | null = null;
      try {
        console.log('[aiAr] 开始 renderer.init()');
        renderer.init();
        console.log('[aiAr] renderer.init() 成功完成');
        console.log('[aiAr] vkError:', renderer?.vkError);
        console.log('[aiAr] getCanvas():', !!renderer?.getCanvas());
      } catch (e: any) {
        initError = e?.errMsg || e?.message || String(e);
        console.error('[aiAr] AR 初始化失败:', e, '错误信息:', initError);
      }

      // 检查 VKSession 是否可用
      const vkError = renderer?.vkError;
      const hasError = initError || vkError;
      console.log('[aiAr] hasError:', !!hasError, 'initError:', initError, 'vkError:', vkError);

      // 获取 WebGL 离屏 canvas
      const webglCanvas = renderer?.getCanvas();

      if (webglCanvas && !hasError) {
        // ========== 对齐旧版 behavior.js 的 drawImage 方案 ==========
        // 创建 2D 中转 canvas，用于每帧将 WebGL 内容绘制过来
        transfer2dCanvas = (wx as any).createCanvas();
        transfer2dCanvas.width = arCanvasWidth;
        transfer2dCanvas.height = arCanvasHeight;
        transfer2dCtx = transfer2dCanvas.getContext('2d');
        console.log('[aiAr] 2D中转canvas创建成功');

        // 用 2D 中转 canvas 创建 PIXI Texture
        arTexture = PIXI.Texture.fromCanvas(transfer2dCanvas);
        arSprite = new PIXI.Sprite(arTexture);
        arSprite.x = 0;
        arSprite.y = screenTop;
        arSprite.width = obj.width;
        arSprite.height = screenH;
        root.addChild(arSprite);

        // 每帧刷新：WebGL → drawImage 到 2D canvas → 更新 PIXI Texture
        tickerFn = () => {
          if (!transfer2dCtx || !webglCanvas) return;
          try {
            // 对齐旧版 behavior.js 第 147 行：
            // canvas2dContext.drawImage(offScreenCanvas, 0, 0, w, h, 0, screenTop, w, h)
            transfer2dCtx.drawImage(
              webglCanvas,
              0, 0, arCanvasWidth, arCanvasHeight,
              0, 0, arCanvasWidth, arCanvasHeight
            );
            if (arTexture) {
              arTexture.update();
            }
          } catch (_e) {
            /* noop */
          }
        };
        app.ticker.add(tickerFn);
      } else {
        // 环境不支持时，在 AR 区域显示提示
        const errorDetail = initError || vkError || '未知错误';
        const errorText = p_text(PIXI, {
          content:
            '⚠️ AR 渲染初始化失败\n\n' +
            '原因: ' + errorDetail + '\n\n' +
            '建议：\n' +
            '1. 在真机上运行（模拟器不支持）\n' +
            '2. game.json 配置 requiredBackgroundModes: ["camera"]\n' +
            '3. 确保微信版本支持 VKSession',
          fontSize: 26 * PIXI.ratio,
          fill: 0xff6600,
          x: 40 * PIXI.ratio,
          y: screenTop + 60 * PIXI.ratio,
        });
        root.addChild(errorText);
      }

      // 触摸事件转发到 ARRenderer
      const handleTouchEnd = (e: any) => {
        if (!renderer) return;
        const touch = e.data.global;
        renderer.onTouchEnd(touch.x, touch.y - screenTop);
      };
      (screenBg as any).touchend = handleTouchEnd;
      if (arSprite) {
        (arSprite as any).touchend = handleTouchEnd;
        arSprite.interactive = true;
      }

      return root;
    },

    onLoad() {
      // root 已加入 page container，提升到最上层确保 AR 画面不被按钮遮挡
      try {
        const parent = rootRef && rootRef.parent;
        if (parent) {
          parent.setChildIndex(rootRef, parent.children.length - 1);
        }
      } catch (_e) {
        /* noop */
      }
    },

    onUnload(app: any) {
      // 移除 ticker
      if (tickerFn && app) {
        app.ticker.remove(tickerFn);
        tickerFn = null;
      }

      // 销毁 AR 渲染器
      if (renderer) {
        renderer.dispose();
        renderer = null;
      }

      // 清理 PIXI 资源
      if (arTexture) {
        try {
          arTexture.destroy(true);
        } catch (_e) {
          /* noop */
        }
        arTexture = null;
      }
      arSprite = null;
      switchBtn = null;
      switchBtnText = null;
      transfer2dCanvas = null;
      transfer2dCtx = null;
      rootRef = null;
    },
  };
}
