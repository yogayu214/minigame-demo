/**
 * 富模板渲染器
 *
 * 用于需要自定义 UI 的复杂 API 示例页面（星空动画、旋转三角形、传感器可视化等）。
 * index.ts 只写纯逻辑，rich-configs/ 里的配置描述 UI 结构，
 * rich-renderer 负责根据配置渲染出完整 PIXI 页面。
 */

const fixedTemplate = require('./template/fixed');
const { p_button, p_text } = require('./component/index');
const Scroller = require('./Scroller/index');

export interface RichConfig {
  /** 页面标题 */
  title: string;
  /** API 名称 */
  apiName?: string;
  /** 页面背景色，默认白色 */
  background?: number;
  /**
   * 渲染自定义顶部视图，返回 PIXI 容器。
   * underline 是 fixedTemplate 生成的分割线，可用于计算内容起始 y 坐标。
   * app 用于操作 ticker（添加/移除动画帧）。
   */
  buildTopView: (PIXI: any, app: any, obj: any, underline: any) => any;
  /** 按钮配置 */
  actions: { label: string; handler: () => void }[];
  /** 页面打开时执行 */
  onLoad?: () => void;
  /**
   * 页面关闭时执行，传入 app 方便移除 ticker。
   */
  onUnload?: (app: any) => void;

  // ============== 信息展示区（按钮上方常驻文本区） ==============

  /**
   * 信息展示区配置。
   * 存在时会在按钮列表上方渲染一个带边框的文本容器，
   * 业务层通过 onInfoTextReady 获取 setText 回调动态更新内容。
   */
  infoArea?: {
    /** 初始显示的文本 */
    initialText?: string;
    /** 背景色，默认 0xf5f0dc（浅黄） */
    backgroundColor?: number;
    /** 边框色，默认 0x333333 */
    borderColor?: number;
    /** 文字颜色，默认 0x333333 */
    textColor?: number;
    /** 字号，默认 28px（乘以 ratio） */
    fontSize?: number;
    /** 行高倍数，默认 1.4 */
    lineHeight?: number;
    /** 容器内水平内边距，默认 24px（乘以 ratio） */
    paddingX?: number;
    /** 容器内垂直内边距，默认 20px（乘以 ratio） */
    paddingY?: number;
    /** 圆角半径，默认 8px（乘以 ratio） */
    borderRadius?: number;
  };
  /**
   * infoArea 渲染完成后回调。
   * 参数 setText 可用于动态更新信息区的文本内容。
   */
  onInfoTextReady?: (setText: (text: string) => void) => void;
}

module.exports = function richRenderer(PIXI: any, app: any, obj: any, config: RichConfig) {
  const container = new PIXI.Container();

  // 背景色（默认使用 --wx-bg-0 #EDEDED 灰色底，让白色卡片和按钮有层级感）
  const pageBg = new PIXI.Graphics();
  pageBg.beginFill(config.background ?? 0xEDEDED).drawRect(0, 0, obj.width, obj.height).endFill();
  container.addChild(pageBg);

  // 顶部固定模板（先生成，把 underline 传给 buildTopView）
  const { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
    obj,
    title: config.title,
    api_name: config.apiName || config.title,
  });

  // 统一灰色底贯穿全屏（包括导航栏），不做白色头部分区

  // 自定义顶部视图
  const topView = config.buildTopView(PIXI, app, obj, underline);
  if (topView) container.addChild(topView);

  // 按钮列表（在 topView 下方，支持滚动）
  // 注意：Container.height = localBounds.maxY - localBounds.minY，
  // 当子元素不从 y=0 开始时，topView.y + topView.height 不等于实际底部，
  // 需要用 getBounds() 获取全局边界来正确计算
  const topViewBounds = topView ? topView.getBounds() : null;
  const topViewBottom = topViewBounds ? topViewBounds.y + topViewBounds.height : 0;
  const baseY = Math.max(
    topViewBottom + 40 * PIXI.ratio,
    underline ? (underline.y || 0) + (underline.height || 0) + 80 * PIXI.ratio : 0
  );

  // 可滚动区域：从 baseY 到屏幕底部（留出 logo 空间 + 额外底部间距）
  const scrollY = baseY;
  const bottomPadding = 110 * PIXI.ratio; // 滚动区底部与 logo 之间的额外间距
  const logoH = logo ? (logo.height || 0) + bottomPadding : 140 * PIXI.ratio;
  const btnW = 580 * PIXI.ratio;
  const btnH = 88 * PIXI.ratio;
  const btnGap = 24 * PIXI.ratio;
  const totalBtnH = (config.actions ? config.actions.length : 0) * (btnH + btnGap) - btnGap;

  // ============== 统一滚动区（info 区 + 按钮，一起滚动） ==============
  // 只有配置了 infoArea 或有 actions 时才创建。否则 topView 自己负责整个页面
  // （避免 scrollWrapper 的全屏 hitArea 遮挡 topView 内的交互组件）
  const hasScrollableContent =
    !!config.infoArea || (!!config.actions && config.actions.length > 0);

  const scrollH = obj.height - scrollY - logoH;
  const infoBtnGap = 30 * PIXI.ratio; // info 与按钮的间距

  let scrollWrapper: any = null;
  let scrollInner: any = null;
  let scroller: any = null;

  if (hasScrollableContent) {
    scrollWrapper = new PIXI.Container();
    scrollWrapper.x = 0;
    scrollWrapper.y = scrollY;
    scrollWrapper.interactive = true;

    scrollInner = new PIXI.Container();

    const scrollMask = new PIXI.Graphics();
    scrollMask.beginFill(0xffffff).drawRect(0, 0, obj.width, scrollH).endFill();
    scrollInner.mask = scrollMask;

    const scrollHitArea = new PIXI.Graphics();
    scrollHitArea.beginFill(0xffffff, 0).drawRect(0, 0, obj.width, scrollH).endFill();
    scrollHitArea.interactive = true;

    scrollWrapper.addChild(scrollHitArea, scrollInner, scrollMask);
    container.addChild(scrollWrapper);
  }

  // ---- info 区（如果配置了）----
  let infoAreaContainer: any = null;
  let infoAreaHeight = 0;
  let infoAreaLayout: (() => void) | null = null;

  // info 区域最大高度：可滚动区高度的 45%，保证按钮始终可见
  const iaMaxH = Math.min(scrollH * 0.45, 480 * PIXI.ratio);
  let iaInnerScroller: any = null; // info 区内部滚动器

  if (config.infoArea) {
    const ia = config.infoArea;
    // 白色卡片在灰色页面底上自然凸出（--wx-bg-2 / --wx-bg-0 对比）
    const iaBgColor = ia.backgroundColor ?? 0xFFFFFF;
    const iaBorderColor = ia.borderColor ?? 0xE5E5E5;
    const iaTextColor = ia.textColor ?? 0x353535;
    const iaFontSize = (ia.fontSize || 26) * PIXI.ratio;
    const iaLineH = iaFontSize * (ia.lineHeight || 1.5);
    const iaPadX = (ia.paddingX || 28) * PIXI.ratio;
    const iaPadY = (ia.paddingY || 28) * PIXI.ratio;
    const iaBorderRadius = (ia.borderRadius || 12) * PIXI.ratio;

    const iaW = btnW;
    const iaInnerW = iaW - iaPadX * 2;
    const iaX = (obj.width - iaW) / 2;

    infoAreaContainer = new PIXI.Container();
    infoAreaContainer.x = iaX;
    infoAreaContainer.y = 0;

    const iaBg = new PIXI.Graphics();
    const iaBorder = new PIXI.Graphics();

    // 内容滚动容器（嵌套滚动：info 区内部独立滚动）
    const iaScrollWrapper = new PIXI.Container();
    iaScrollWrapper.x = 0;
    iaScrollWrapper.y = 0;
    iaScrollWrapper.interactive = true;

    const iaScrollInner = new PIXI.Container();
    const iaScrollMask = new PIXI.Graphics(); // 动态更新尺寸

    const iaText = new PIXI.Text(ia.initialText || '', {
      fontSize: `${iaFontSize}px`,
      fill: iaTextColor,
      lineHeight: iaLineH,
      wordWrap: true,
      wordWrapWidth: iaInnerW,
      breakWords: true,
    });
    iaText.x = iaPadX;
    iaText.y = iaPadY;

    iaScrollInner.addChild(iaText);
    iaScrollInner.mask = iaScrollMask;

    // 透明命中区保证空白区域也能接收触摸
    const iaHitArea = new PIXI.Graphics();
    iaHitArea.interactive = true;

    iaScrollWrapper.addChild(iaHitArea, iaScrollInner, iaScrollMask);
    infoAreaContainer.addChild(iaBg, iaBorder, iaScrollWrapper);
    scrollInner.addChild(infoAreaContainer);

    // info 区内部滚动器
    iaInnerScroller = new Scroller((_l: number, t: number) => {
      iaScrollInner.y = -t;
    });

    // 嵌套滚动逻辑由外层 scrollWrapper 统一驱动（基于坐标判断）：
    //   - 手指不在 info 区 → 只外层滚动
    //   - 手指在 info 区且内层未到边界 → 只内层滚动，外层不动
    //   - 手指在 info 区且内层到边界后继续同方向 → 穿透给外层
    iaScrollWrapper.interactive = false; // 禁用子元素交互，由外层统一分发

    infoAreaLayout = () => {
      const hasText = !!(iaText.text && iaText.text.trim());
      if (!hasText) {
        infoAreaContainer.visible = false;
        infoAreaHeight = 0;
        return;
      }
      infoAreaContainer.visible = true;
      const rawContentH = iaText.height + iaPadY * 2;
      // 如果内容超出最大高度，则固定高度并启用内部滚动
      const needScroll = rawContentH > iaMaxH;
      const displayH = needScroll ? iaMaxH : rawContentH;
      infoAreaHeight = displayH;

      iaBg.clear().beginFill(iaBgColor).drawRoundedRect(0, 0, iaW, displayH, iaBorderRadius).endFill();
      if (iaBgColor !== 0xFFFFFF) {
        iaBorder.clear().lineStyle(1 * PIXI.ratio, iaBorderColor, 0.4).drawRoundedRect(0, 0, iaW, displayH, iaBorderRadius);
      } else {
        iaBorder.clear();
      }

      // 更新滚动 mask 和命中区
      iaScrollMask.clear().beginFill(0xffffff).drawRoundedRect(0, 0, iaW, displayH, iaBorderRadius).endFill();
      iaHitArea.clear().beginFill(0xffffff, 0).drawRect(0, 0, iaW, displayH).endFill();

      // 更新内部滚动器的内容尺寸
      if (needScroll) {
        iaInnerScroller.contentSize(iaW, displayH, iaW, rawContentH);
      } else {
        // 不需要滚动时重置（内容区 = 显示区）
        iaInnerScroller.contentSize(iaW, displayH, iaW, displayH);
        iaScrollInner.y = 0;
      }
    };
  }

  // ---- 按钮 ----
  const btnX = (obj.width - btnW) / 2;
  const btnElements: any[] = [];

  if (config.actions && config.actions.length > 0) {
    config.actions.forEach((action) => {
      const btn = p_button(PIXI, {
        width: btnW,
        height: btnH,
        color: 0x07C160,
        y: 0,
        radius: 8 * PIXI.ratio,
      });
      btn.x = btnX;
      btn.myAddChildFn(
        p_text(PIXI, {
          content: action.label,
          fontSize: 30 * PIXI.ratio,
          fill: 0xffffff,
          fontWeight: 'normal',
          relative_middle: { containerWidth: btn.width, containerHeight: btn.height },
        })
      );
      btn.onClickFn(() => {
        try { action.handler(); } catch (e: any) {
          wx.showModal({ title: '错误', content: e.errMsg || String(e), showCancel: false });
        }
      });
      scrollInner.addChild(btn);
      btnElements.push(btn);
    });
  }

  // ---- 统一 scroller（仅在有滚动内容时创建）----
  const layoutAll = () => {
    if (!scroller) return;
    let totalH = 0;
    if (infoAreaLayout) {
      infoAreaLayout();
      totalH += infoAreaHeight;
      if (infoAreaHeight > 0) totalH += infoBtnGap;
    }
    btnElements.forEach((btn, i) => {
      btn.y = totalH + i * (btnH + btnGap);
    });
    totalH += totalBtnH;
    scroller.contentSize(obj.width, scrollH, obj.width, totalH);
  };

  if (hasScrollableContent) {
    scroller = new Scroller((_l: number, t: number) => {
      scrollInner.y = -t;
    });

    // ---- 嵌套滚动状态 ----
    let touchInInfo = false;   // 本次手势是否起始于 info 区域
    let innerConsuming = false; // 内层是否正在消费滚动
    let lastTouchY = 0;

    // 判断触点是否在 info 区域内（全局坐标）
    const isPointInInfoArea = (globalY: number): boolean => {
      if (!infoAreaContainer || !infoAreaContainer.visible) return false;
      if (!iaInnerScroller || iaInnerScroller.rangeMovement.bottom <= 0) return false;
      // info 容器在屏幕上的实际 Y 位置
      const iaScreenY = scrollY + scrollInner.y + infoAreaContainer.y;
      return globalY >= iaScreenY && globalY <= iaScreenY + infoAreaHeight;
    };

    (scrollWrapper as any).touchstart = (e: any) => {
      e.stopPropagation();
      const y = e.data.global.y;
      lastTouchY = y;

      touchInInfo = isPointInInfoArea(y);
      if (touchInInfo) {
        // 手指在 info 区域：内层接管
        innerConsuming = true;
        iaInnerScroller.doTouchStart(e.data.global.x, y);
      } else {
        // 手指不在 info 区域：外层接管
        innerConsuming = false;
        scroller.doTouchStart(e.data.global.x, y);
      }
    };
    (scrollWrapper as any).touchmove = (e: any) => {
      e.stopPropagation();
      const y = e.data.global.y;
      const ts = e.data.originalEvent.timeStamp;

      if (!touchInInfo) {
        // 手指不在 info 区域：只外层滚动
        scroller.doTouchMove(e.data.global.x, y, ts);
      } else if (innerConsuming) {
        // 手指在 info 区域，内层正在消费滚动
        const deltaY = lastTouchY - y; // >0 向上滑（内容向下）
        const { top, bottom } = iaInnerScroller.rangeMovement;
        const atTop = top <= 0 && deltaY < 0;
        const atBottom = top >= bottom && deltaY > 0;

        if (atTop || atBottom) {
          // 内层到达边界，穿透给外层
          innerConsuming = false;
          iaInnerScroller.doTouchEnd(ts);
          scroller.doTouchStart(e.data.global.x, y);
        } else {
          iaInnerScroller.doTouchMove(e.data.global.x, y, ts);
        }
      } else {
        // 已穿透给外层
        scroller.doTouchMove(e.data.global.x, y, ts);
      }
      lastTouchY = y;
    };
    (scrollWrapper as any).touchend = (e: any) => {
      e.stopPropagation();
      const ts = e.data.originalEvent.timeStamp;
      if (touchInInfo && innerConsuming) {
        iaInnerScroller.doTouchEnd(ts);
      } else {
        scroller.doTouchEnd(ts);
      }
      touchInInfo = false;
      innerConsuming = false;
    };

    // setText 回调
    if (config.onInfoTextReady && infoAreaContainer) {
      try {
        config.onInfoTextReady((text: string) => {
          // iaText 在嵌套结构中：infoAreaContainer > iaScrollWrapper(child[2]) > iaScrollInner(child[1]) > iaText(child[0])
          const iaScrollWrapper = infoAreaContainer.children[2]; // bg, border, scrollWrapper
          const iaScrollInner = iaScrollWrapper?.children?.[1]; // hitArea, scrollInner, mask
          const iaText = iaScrollInner?.children?.[0];
          if (!iaText) return;
          iaText.text = text || '';
          // 重置内部滚动位置
          if (iaScrollInner) iaScrollInner.y = 0;
          layoutAll();
        });
      } catch (e) { /* ignore */ }
    }

    layoutAll();
  }

  // 返回按钮回调
  //   onUnload 的清理统一由 router.delPage 里的 _onUnload 负责调用（见 router.ts），
  //   这里不再直接调，避免 onUnload 被调用两次（第一次销毁异步资源可能与第二次冲突，
  //   导致返回卡住，如 mediaAudioPlayer 的 player.destroy 场景）。

  // 组装固定元素（覆盖在 topView 之上）
  container.addChild(goBack, title, api_name);
  if (underline) container.addChild(underline);
  container.addChild(logo, logoName);

  // 滑块触摸结束清理已移除：
  // 之前的递归 clearTouchmoveDeep 会把弹窗滚动器的 touchmove 也清掉，
  // 导致弹窗内容无法上下滑动。滑块拖不动的问题已通过 getBounds() 修复
  // topViewBottom 计算，scrollWrapper 的 hitArea 不再遮挡滑块。

  app.stage.addChild(container);

  if (config.onLoad) {
    try { config.onLoad(); } catch (e) { console.error('onLoad error:', e); }
  }

  return container;
};
