/**
 * API 示例页面的类型定义
 *
 * 新模式：index.ts 只写纯 API 调用逻辑（export function），
 * page-renderer 自动读取 export 的函数列表来生成 UI 按钮。
 *
 * PageConfig/ActionConfig 为 page-renderer 内部使用，
 * API 页面无需直接引用。
 */

/** 渲染上下文，由框架注入给 handler */
export interface DemoContext {
  /** 显示结果文本 */
  showResult(text: string): void;
  /** 显示键值对列表 */
  showData(data: Record<string, any>): void;
  /** 显示图片 */
  showImage(src: string): void;
  /** 显示 loading */
  showLoading(title?: string): void;
  /** 隐藏 loading */
  hideLoading(): void;
  /** 显示 toast */
  toast(title: string, icon?: string): void;
  /** 显示弹窗 */
  modal(content: string, title?: string): void;
  /** 更新按钮文案 */
  updateButtonLabel(index: number, label: string): void;
  /** 设置按钮可用状态 */
  setButtonEnabled(index: number, enabled: boolean): void;
}

/** 单个操作按钮的配置 */
export interface ActionConfig {
  /** 按钮文案 */
  label: string;
  /** 点击回调 */
  handler: (ctx: DemoContext) => void | Promise<void>;
}

/** 页面配置 */
export interface PageConfig {
  /** 页面标题 */
  title: string;
  /** API 名称（标题下方灰色小字） */
  apiName: string;
  /** 操作按钮列表 */
  actions: ActionConfig[];
  /** 页面初始化时执行（可用于创建广告组件、监听事件等） */
  onLoad?: (ctx: DemoContext) => void | Promise<void>;
  /** 页面销毁时执行（清理监听、销毁组件等） */
  onUnload?: (ctx: DemoContext) => void;
}
