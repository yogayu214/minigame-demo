/**
 * 富模板渲染器
 *
 * 用于需要自定义 UI 的复杂 API 示例页面（星空动画、旋转三角形、传感器可视化等）。
 * index.ts 只写纯逻辑，rich-configs/ 里的配置描述 UI 结构，
 * rich-renderer 负责根据配置渲染出完整 PIXI 页面。
 */

const fixedTemplate = require('./template/fixed');
const { p_button, p_text } = require('./component/index');

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

  // 按钮列表（在 topView 下方）
  const topViewBottom = topView ? (topView.y || 0) + (topView.height || 0) : 0;
  const baseY = Math.max(
    topViewBottom + 40 * PIXI.ratio,
    underline ? (underline.y || 0) + (underline.height || 0) + 80 * PIXI.ratio : 0
  );

  config.actions.forEach((action, i) => {
    const btnY = baseY + i * (80 * PIXI.ratio + 20 * PIXI.ratio);
    const btn = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      height: 80 * PIXI.ratio,
      color: 0x05c25f,
      y: btnY,
    });
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
    container.addChild(btn);
  });

  // 返回按钮回调
  goBack.callBack = () => {
    if (config.onUnload) config.onUnload(app);
  };

  // 组装固定元素（覆盖在 topView 之上）
  container.addChild(goBack, title, api_name);
  if (underline) container.addChild(underline);
  container.addChild(logo, logoName);

  // 滑块触摸结束清理
  container.interactive = true;
  (container as any).touchend = () => {
    // 通知各子元素 touchmove 结束（供滑块组件使用）
    container.children.forEach((child: any) => {
      if (child.touchmove !== undefined) child.touchmove = null;
    });
  };

  app.stage.addChild(container);

  if (config.onLoad) {
    try { config.onLoad(); } catch (e) { console.error('onLoad error:', e); }
  }

  return container;
};
