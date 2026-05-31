/**
 * WebAssembly
 * WXWebAssembly.instantiate (小游戏全局对象，不在 wx 命名空间下)
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/wxwebassembly/WXWebAssembly.html
 *
 * 注意：本示例演示 API 用法和错误处理，真正运行需配套 .wasm 文件。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

declare const WXWebAssembly: any;

/** 检测当前环境是否支持 WXWebAssembly */
export function checkSupport() {
  const hasGlobal = typeof WXWebAssembly !== 'undefined';
  display.data({
    'typeof WXWebAssembly': hasGlobal ? 'object' : 'undefined',
    instantiate: hasGlobal && typeof WXWebAssembly.instantiate === 'function' ? '✓' : '✗',
    支持情况: hasGlobal ? '✓ 当前环境支持' : '✗ 不支持',
  });
}

/** 加载并实例化 .wasm 文件（路径需放置 wasm 资源） */
export function instantiateWasm() {
  if (typeof WXWebAssembly === 'undefined') {
    display.text('当前环境不支持 WXWebAssembly');
    return;
  }
  display.text('正在加载 wasm/example.wasm ...');
  WXWebAssembly.instantiate('wasm/example.wasm', {})
    .then((res: any) => {
      const exports = res.instance ? res.instance.exports : res.exports;
      display.data({
        状态: '✓ 加载成功',
        导出符号: Object.keys(exports || {}).slice(0, 5).join(', ') || '-',
      });
    })
    .catch((err: any) => {
      display.data({
        状态: '✗ 加载失败',
        原因: String(err.message || err),
        提示: '请将 .wasm 文件放在 wasm/ 目录',
      });
    });
}
