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

  // 背景色
  if (config.background !== undefined) {
    const bg = new PIXI.Graphics();
    bg.beginFill(config.background).drawRect(0, 0, obj.width, obj.height).endFill();
    container.addChild(bg);
  }

  // 顶部固定模板（先生成，把 underline 传给 buildTopView）
  const { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
    obj,
    title: config.title,
    api_name: config.apiName || config.title,
  });

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
  const bottomPadding = 60 * PIXI.ratio; // 滚动区底部与 logo 之间的额外间距
  const logoH = logo ? (logo.height || 0) + bottomPadding : 140 * PIXI.ratio;
  const btnW = 580 * PIXI.ratio;
  const btnH = 80 * PIXI.ratio;
  const btnGap = 20 * PIXI.ratio;
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

  if (config.infoArea) {
    const ia = config.infoArea;
    const iaBgColor = ia.backgroundColor ?? 0xf5f0dc;
    const iaBorderColor = ia.borderColor ?? 0x333333;
    const iaTextColor = ia.textColor ?? 0x333333;
    const iaFontSize = (ia.fontSize || 28) * PIXI.ratio;
    const iaLineH = iaFontSize * (ia.lineHeight || 1.4);
    const iaPadX = (ia.paddingX || 24) * PIXI.ratio;
    const iaPadY = (ia.paddingY || 20) * PIXI.ratio;
    const iaBorderRadius = (ia.borderRadius || 8) * PIXI.ratio;

    const iaW = btnW;
    const iaInnerW = iaW - iaPadX * 2;
    const iaX = (obj.width - iaW) / 2;

    infoAreaContainer = new PIXI.Container();
    infoAreaContainer.x = iaX;
    infoAreaContainer.y = 0;

    const iaBg = new PIXI.Graphics();
    const iaBorder = new PIXI.Graphics();

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

    infoAreaContainer.addChild(iaBg, iaBorder, iaText);
    scrollInner.addChild(infoAreaContainer);

    infoAreaLayout = () => {
      const hasText = !!(iaText.text && iaText.text.trim());
      if (!hasText) {
        infoAreaContainer.visible = false;
        infoAreaHeight = 0;
        return;
      }
      infoAreaContainer.visible = true;
      const contentH = iaText.height + iaPadY * 2;
      infoAreaHeight = contentH;
      iaBg.clear().beginFill(iaBgColor).drawRoundedRect(0, 0, iaW, contentH, iaBorderRadius).endFill();
      iaBorder.clear().lineStyle(2 * PIXI.ratio, iaBorderColor).drawRoundedRect(0, 0, iaW, contentH, iaBorderRadius);
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
        color: 0x05c25f,
        y: 0,
      });
      btn.x = btnX;
      btn.myAddChildFn(
        p_text(PIXI, {
          content: action.label,
          fontSize: 30 * PIXI.ratio,
          fill: 0xffffff,
          fontWeight: 'bold',
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

    (scrollWrapper as any).touchstart = (e: any) => {
      e.stopPropagation();
      scroller.doTouchStart(e.data.global.x, e.data.global.y);
    };
    (scrollWrapper as any).touchmove = (e: any) => {
      e.stopPropagation();
      scroller.doTouchMove(e.data.global.x, e.data.global.y, e.data.originalEvent.timeStamp);
    };
    (scrollWrapper as any).touchend = (e: any) => {
      e.stopPropagation();
      scroller.doTouchEnd(e.data.originalEvent.timeStamp);
    };

    // setText 回调
    if (config.onInfoTextReady && infoAreaContainer) {
      try {
        config.onInfoTextReady((text: string) => {
          // iaText 是第 3 个子元素
          const iaText = infoAreaContainer.children[2];
          if (!iaText) return;
          iaText.text = text || '';
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
