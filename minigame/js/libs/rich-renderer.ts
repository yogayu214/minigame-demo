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

  // 可滚动区域：从 baseY 到屏幕底部（留出 logo 空间）
  const scrollY = baseY;
  const logoH = logo ? (logo.height || 0) + 20 * PIXI.ratio : 100 * PIXI.ratio;
  const scrollH = obj.height - scrollY - logoH;
  const btnW = 580 * PIXI.ratio;
  const btnH = 80 * PIXI.ratio;
  const btnGap = 20 * PIXI.ratio;
  const totalBtnH = (config.actions ? config.actions.length : 0) * (btnH + btnGap) - btnGap;

  // ============== 信息展示区（infoArea） ==============
  let actualScrollY = scrollY;
  let infoAreaContainer: any = null;
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

    // 容器宽度：左右留边距
    const iaW = obj.width - 40 * PIXI.ratio;
    const iaInnerW = iaW - iaPadX * 2;
    const iaX = (obj.width - iaW) / 2;

    infoAreaContainer = new PIXI.Container();
    infoAreaContainer.x = iaX;
    infoAreaContainer.y = scrollY;

    // 背景底色
    const iaBg = new PIXI.Graphics();
    iaBg.beginFill(iaBgColor).drawRoundedRect(0, 0, iaW, 10, iaBorderRadius).endFill();

    // 边框（用 lineStyle 绘制圆角矩形描边）
    const iaBorder = new PIXI.Graphics();
    iaBorder.lineStyle(2 * PIXI.ratio, iaBorderColor)
      .drawRoundedRect(0, 0, iaW, 10, iaBorderRadius);

    // 文本
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
    container.addChild(infoAreaContainer);

    // 根据实际文本高度调整背景和边框尺寸
    const iaContentH = iaText.height + iaPadY * 2;
    const iaH = Math.max(iaContentH, 60 * PIXI.ratio);
    iaBg.clear().beginFill(iaBgColor).drawRoundedRect(0, 0, iaW, iaH, iaBorderRadius).endFill();
    iaBorder.clear().lineStyle(2 * PIXI.ratio, iaBorderColor).drawRoundedRect(0, 0, iaW, iaH, iaBorderRadius);
    infoAreaContainer.height; // 触发 bounds 更新

    // 按钮区起始 y 下移（信息区高度 + 间距）
    actualScrollY = scrollY + iaH + 30 * PIXI.ratio;

    // 暴露 setText 回调给业务层
    if (config.onInfoTextReady) {
      try {
        config.onInfoTextReady((text: string) => {
          if (!iaText || !iaBg || !iaBorder || !infoAreaContainer) return;
          iaText.text = text || '';
          const newContentH = iaText.height + iaPadY * 2;
          const newH = Math.max(newContentH, 60 * PIXI.ratio);
          iaBg.clear().beginFill(iaBgColor).drawRoundedRect(0, 0, iaW, newH, iaBorderRadius).endFill();
          iaBorder.clear().lineStyle(2 * PIXI.ratio, iaBorderColor).drawRoundedRect(0, 0, iaW, newH, iaBorderRadius);
          // 更新后重新计算按钮区位置
          const newScrollY = scrollY + newH + 30 * PIXI.ratio;
          if (scrollWrapper) scrollWrapper.y = newScrollY;
        });
      } catch (e) { /* ignore */ }
    }
  }

  // 仅当有按钮时才创建滚动容器（否则 scrollWrapper 的 interactive/hitArea
  // 会拦截触摸事件，导致 topView 中的滑块等组件无法操作）
  let scrollWrapper: any = null;
  if (config.actions && config.actions.length > 0) {
    // 滚动容器
    scrollWrapper = new PIXI.Container();
    scrollWrapper.x = 0;
    scrollWrapper.y = actualScrollY;
    scrollWrapper.interactive = true;

    // 内容层（存放按钮）
    const scrollInner = new PIXI.Container();

    // 遮罩
    const scrollMask = new PIXI.Graphics();
    scrollMask.beginFill(0xffffff).drawRect(0, 0, obj.width, scrollH).endFill();
    scrollInner.mask = scrollMask;

    // 透明命中区（保证空白可拖动滚动）
    const hitArea = new PIXI.Graphics();
    hitArea.beginFill(0xffffff, 0).drawRect(0, 0, obj.width, scrollH).endFill();
    hitArea.interactive = true;

    scrollWrapper.addChild(hitArea, scrollInner, scrollMask);

    // 按钮居中偏移
    const btnX = (obj.width - btnW) / 2;

    config.actions.forEach((action, i) => {
      const btn = p_button(PIXI, {
        width: btnW,
        height: btnH,
        color: 0x05c25f,
        y: i * (btnH + btnGap),
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
    });

    container.addChild(scrollWrapper);

    // 滚动逻辑（仅当内容超出可视区域时启用）
    if (totalBtnH > scrollH) {
      const scroller = new Scroller((_l: number, t: number) => {
        scrollInner.y = -t;
      });
      scroller.contentSize(obj.width, scrollH, obj.width, totalBtnH);

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
    }
  }

  // 返回按钮回调
  goBack.callBack = () => {
    if (config.onUnload) config.onUnload(app);
  };

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
