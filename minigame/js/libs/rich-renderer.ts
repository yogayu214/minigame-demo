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
  const totalBtnH = config.actions.length * (btnH + btnGap) - btnGap;

  // 仅当有按钮时才创建滚动容器（否则 scrollWrapper 的 interactive/hitArea
  // 会拦截触摸事件，导致 topView 中的滑块等组件无法操作）
  if (config.actions.length > 0) {
    // 滚动容器
    const scrollWrapper = new PIXI.Container();
    scrollWrapper.x = 0;
    scrollWrapper.y = scrollY;
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
