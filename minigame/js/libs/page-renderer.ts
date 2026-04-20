/**
 * 通用页面渲染器
 *
 * 支持两种模块格式：
 * 1. PageConfig 对象（旧模式，逐步淘汰）
 * 2. 纯 export 函数模块（新模式）：每个 export function 自动生成一个按钮
 */
import { p_button, p_text, p_box } from '../component/index';
import fixedTemplate from '../template/fixed';
import type { PageConfig, DemoContext } from '../demo-types';

/**
 * 从纯函数模块构建 PageConfig
 * 模块中每个 export 的 function 会变成一个按钮
 */
function buildConfigFromModule(mod: any, pageLabel?: string): PageConfig {
  const actions: { label: string; handler: (ctx: DemoContext) => void }[] = [];
  const skipKeys = ['__esModule', 'default', 'title', 'apiName', 'onLoad', 'onUnload'];

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
    // PageConfig 格式
    config = configOrMod;
  } else {
    // 纯函数模块格式
    config = buildConfigFromModule(configOrMod, pageLabel);
  }

  const container = new PIXI.Container();

  // 1. 固定模板（标题、返回按钮、API名、分割线、logo）
  const { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
    obj,
    title: config.title,
    api_name: config.apiName,
  });

  // 2. 结果展示区（文本）
  const resultText = p_text(PIXI, {
    content: '',
    fontSize: 28 * PIXI.ratio,
    fill: 0x888888,
    lineHeight: 40 * PIXI.ratio,
    y: 0,
    relative_middle: { containerWidth: obj.width },
  });
  resultText.visible = false;

  // 3. 结果展示区（键值对列表）
  const dataContainer = new PIXI.Container();
  dataContainer.visible = false;

  // 4. 结果展示区（图片）
  let resultImage: any = null;

  // 5. 构建 DemoContext
  const ctx: DemoContext = {
    showResult(text: string) {
      resultText.visible = true;
      dataContainer.visible = false;
      if (resultText.turnText) {
        resultText.turnText(text);
      }
    },
    showData(data: Record<string, any>) {
      dataContainer.visible = true;
      resultText.visible = false;
      while (dataContainer.children.length > 0) {
        dataContainer.removeChildAt(0);
      }
      let yOffset = 0;
      for (const [key, value] of Object.entries(data)) {
        const row = p_box(PIXI, {
          width: obj.width - 60 * PIXI.ratio,
          height: 60 * PIXI.ratio,
          y: yOffset,
          color: 0xffffff,
        });
        const keyText = p_text(PIXI, {
          content: key,
          fontSize: 26 * PIXI.ratio,
          fill: 0x353535,
          x: 20 * PIXI.ratio,
          y: 15 * PIXI.ratio,
        });
        const valText = p_text(PIXI, {
          content: String(value),
          fontSize: 26 * PIXI.ratio,
          fill: 0x888888,
          x: 250 * PIXI.ratio,
          y: 15 * PIXI.ratio,
        });
        row.addChild(keyText, valText);
        dataContainer.addChild(row);
        yOffset += 62 * PIXI.ratio;
      }
    },
    showImage(src: string) {
      if (resultImage) {
        container.removeChild(resultImage);
      }
      const img = new PIXI.Sprite(PIXI.Texture.fromImage(src));
      img.width = 200 * PIXI.ratio;
      img.height = 200 * PIXI.ratio;
      img.x = (obj.width - img.width) / 2;
      img.y = resultText.y;
      container.addChild(img);
      resultImage = img;
    },
    showLoading(title?: string) {
      wx.showLoading({ title: title || '加载中...', mask: true });
    },
    hideLoading() {
      wx.hideLoading();
    },
    toast(title: string, icon?: string) {
      wx.showToast({ title, icon: icon || 'success', duration: 1500 });
    },
    modal(content: string, title?: string) {
      wx.showModal({
        title: title || '结果',
        content,
        showCancel: false,
        confirmColor: '#02BB00',
      });
    },
    updateButtonLabel(index: number, label: string) {
      if (buttons[index] && buttons[index].turnText) {
        buttons[index].turnText(label);
      }
    },
    setButtonEnabled(index: number, enabled: boolean) {
      if (buttons[index] && buttons[index].isTouchable) {
        buttons[index].isTouchable(enabled);
      }
    },
  };

  // 6. 渲染按钮列表
  const baseY = underline
    ? (underline.height || 0) + (underline.y || 0) + 80 * PIXI.ratio
    : (api_name.height || 0) + (api_name.y || 0) + 80 * PIXI.ratio;

  const buttons: any[] = [];

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
        const result = action.handler(ctx);
        if (result && typeof (result as any).catch === 'function') {
          (result as any).catch((err: any) => {
            ctx.modal(err.errMsg || String(err), '错误');
          });
        }
      } catch (err: any) {
        ctx.modal(err.errMsg || String(err), '错误');
      }
    });

    buttons.push(btn);
    container.addChild(btn);
  });

  // 7. 定位结果区
  const lastBtnY = buttons.length > 0
    ? baseY + (buttons.length - 1) * (80 * PIXI.ratio + 20 * PIXI.ratio) + 80 * PIXI.ratio
    : baseY;
  const resultY = lastBtnY + 40 * PIXI.ratio;
  resultText.y = resultY;
  dataContainer.y = resultY;
  dataContainer.x = 30 * PIXI.ratio;

  // 8. 返回按钮回调
  goBack.callBack = () => {
    if (config.onUnload) {
      config.onUnload(ctx);
    }
    window.router.getNowPage((page: any) => {
      if (!page.reload) {
        page.reload = function () {};
      }
    });
  };

  // 9. 组装
  container.addChild(goBack, title, api_name);
  if (underline) container.addChild(underline);
  container.addChild(resultText, dataContainer, logo, logoName);

  app.stage.addChild(container);

  // 10. 触发 onLoad
  if (config.onLoad) {
    try { config.onLoad(ctx); } catch (err) { console.error('onLoad error:', err); }
  }

  return container;
};
