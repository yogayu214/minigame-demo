/**
 * 通用结果展示 rich-config 工厂
 *
 * 适用场景：业务层只需要把 API 返回值展示到页面上（文本 / 键值对 / 图片），
 * 不需要自定义 UI 的 API。用这个工厂可以避免为每个 API 单独写一份 rich-config。
 *
 * 约定：业务模块必须暴露 setDisplay 插槽（通过 createDisplay() 生成），
 * rich-config 的 buildTopView 会在这个插槽上挂载「更新展示区」的回调。
 *
 * 业务层用法（示例见 api/device/getBatteryInfo/index.ts）：
 *   import { createDisplay } from '../../../libs/display-slot';
 *   const display = createDisplay();
 *   export const setDisplay = display.setter;   // 给 rich-config 用
 *
 *   export function getBatteryInfo() {
 *     wx.getBatteryInfo({
 *       success: (res) => display.data({ '电量': res.level + '%' }),
 *     });
 *   }
 */

import type { RichConfig } from '../rich-renderer';

/**
 * 业务层暴露给 rich-config 的接口约定。
 * 业务层必须 export `setDisplay`，用来把展示区 api 回调给自己使用。
 */
export interface DisplayApi {
  /** 展示纯文本（一行） */
  text(content: string): void;
  /** 展示键值对列表 */
  data(kv: Record<string, any>): void;
  /** 展示图片（远程 url 或本地 path） */
  image(src: string): void;
  /** 清空展示区 */
  clear(): void;
}

export interface DisplayModule {
  title?: string;
  apiName?: string;
  /** 业务层必须 export 一个同名函数，rich-config 调用它来把 DisplayApi 交给业务层 */
  setDisplay: (api: DisplayApi) => void;
  /** 业务层可选的 onLoad */
  onLoad?: () => void;
  /** 业务层可选的 onUnload */
  onUnload?: () => void;
  /** 其他的任意 export function 都会被当作按钮 */
  [key: string]: any;
}

/**
 * 从业务模块构建 RichConfig。
 *
 * @param mod           业务模块（require 进来的 index）
 * @param pageLabel     路由里的 label（作为标题兜底）
 */
export function createDisplayConfig(mod: DisplayModule, pageLabel?: string): RichConfig {
  const { p_text, p_box } = require('../component/index');

  // 收集 export 的业务函数作为按钮（跳过约定字段）
  const skipKeys = ['__esModule', 'default', 'title', 'apiName', 'onLoad', 'onUnload', 'setDisplay'];
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

  return {
    title: mod.title || pageLabel || '',
    apiName: mod.apiName || '',
    actions,

    buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
      const baseY = underline ? (underline.y || 0) + (underline.height || 0) : 0;

      // 展示区容器（位于标题下方、按钮上方）
      const topContainer = new PIXI.Container();
      topContainer.y = baseY + 30 * PIXI.ratio;

      // 文本展示
      const textView = p_text(PIXI, {
        content: '',
        fontSize: 28 * PIXI.ratio,
        fill: 0x555555,
        lineHeight: 40 * PIXI.ratio,
        y: 0,
        relative_middle: { containerWidth: obj.width },
      });
      textView.visible = false;

      // 键值对列表容器
      const dataView = new PIXI.Container();
      dataView.visible = false;
      dataView.x = 30 * PIXI.ratio;

      // 图片
      let imageView: any = null;

      topContainer.addChild(textView, dataView);

      // 给业务层注入回调
      const api: DisplayApi = {
        text(content: string) {
          textView.visible = true;
          dataView.visible = false;
          if (imageView) { imageView.visible = false; }
          if (textView.turnText) textView.turnText(content);
        },
        data(kv: Record<string, any>) {
          dataView.visible = true;
          textView.visible = false;
          if (imageView) { imageView.visible = false; }
          // 清空旧行
          while (dataView.children.length > 0) {
            dataView.removeChildAt(0);
          }
          let yOffset = 0;
          for (const [key, value] of Object.entries(kv)) {
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
            dataView.addChild(row);
            yOffset += 62 * PIXI.ratio;
          }
        },
        image(src: string) {
          textView.visible = false;
          dataView.visible = false;
          if (imageView) {
            topContainer.removeChild(imageView);
            imageView.destroy(true);
          }
          const img = new PIXI.Sprite(PIXI.Texture.fromImage(src));
          img.width = 240 * PIXI.ratio;
          img.height = 240 * PIXI.ratio;
          img.x = (obj.width - img.width) / 2;
          img.y = 0;
          topContainer.addChild(img);
          imageView = img;
        },
        clear() {
          textView.visible = false;
          dataView.visible = false;
          if (imageView) { imageView.visible = false; }
        },
      };

      // 把 api 交给业务层（业务层存起来，API 成功回调时调用）
      mod.setDisplay(api);

      // 预留高度：用 box 占位以便 rich-renderer 计算按钮基线
      topContainer.height = 320 * PIXI.ratio;
      return topContainer;
    },

    onLoad: mod.onLoad,
    onUnload: mod.onUnload ? () => mod.onUnload!() : undefined,
  };
}
