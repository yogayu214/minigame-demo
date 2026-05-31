/**
 * 普通页面渲染器
 *
 * 业务模块约定：每个 export function 自动渲染成一个绿色按钮，
 * 按钮点击时直接调用对应函数（不传 ctx）。
 *
 * 业务函数如果需要把数据展示到页面上，请使用 rich-config + display 工厂模式
 * （参见 libs/rich-configs/display.ts），不要把展示逻辑塞进 page-renderer。
 */
const { p_button, p_text } = require('./component/index');
const fixedTemplate = require('./template/fixed');
import type { PageConfig } from './demo-types';

/**
 * 从纯函数模块构建 PageConfig
 * 模块中每个 export 的 function 会变成一个按钮
 */
function buildConfigFromModule(mod: any, pageLabel?: string): PageConfig {
  const actions: { label: string; handler: () => void }[] = [];
  const skipKeys = ['__esModule', 'default', 'title', 'apiName', 'onLoad', 'onUnload', 'setDisplay'];

  for (const key of Object.keys(mod)) {
    if (skipKeys.includes(key)) continue;
    if (typeof mod[key] === 'function') {
      actions.push({
        label: key,
        handler: () => mod[key](),
      });
    }
  }

  return {
    title: mod.title || pageLabel || '',
    apiName: mod.apiName || '',
    actions,
    onLoad: typeof mod.onLoad === 'function' ? () => mod.onLoad() : undefined,
    onUnload: typeof mod.onUnload === 'function' ? () => mod.onUnload() : undefined,
  };
}

module.exports = function renderPage(PIXI: any, app: any, obj: any, configOrMod: any, pageLabel?: string) {
  // 判断是 PageConfig 还是纯函数模块
  let config: PageConfig;
  if (configOrMod.actions && Array.isArray(configOrMod.actions)) {
    config = configOrMod;
  } else {
    config = buildConfigFromModule(configOrMod, pageLabel);
  }

  const container = new PIXI.Container();

  // 1. 固定模板（标题、返回按钮、API名、分割线、logo）
  const { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
    obj,
    title: config.title,
    api_name: config.apiName || config.title,
  });

  // 2. 渲染按钮列表
  const baseY = underline
    ? (underline.height || 0) + (underline.y || 0) + 80 * PIXI.ratio
    : (api_name.height || 0) + (api_name.y || 0) + 80 * PIXI.ratio;

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
      try {
        const result = action.handler();
        if (result && typeof (result as any).catch === 'function') {
          (result as any).catch((err: any) => {
            wx.showModal({ title: '错误', content: err.errMsg || String(err), showCancel: false });
          });
        }
      } catch (err: any) {
        console.error('[renderPage] handler error:', err);
        wx.showModal({ title: '错误', content: err.errMsg || String(err), showCancel: false });
      }
    });

    container.addChild(btn);
  });

  // 3. 返回按钮回调
  goBack.callBack = () => {
    if (config.onUnload) {
      config.onUnload();
    }
    window.router.getNowPage((page: any) => {
      if (!page.reload) {
        page.reload = function () {};
      }
    });
  };

  // 4. 组装
  container.addChild(goBack, title, api_name);
  if (underline) container.addChild(underline);
  container.addChild(logo, logoName);

  app.stage.addChild(container);

  // 5. 触发 onLoad
  if (config.onLoad) {
    try { config.onLoad(); } catch (err) { console.error('onLoad error:', err); }
  }

  return container;
};
