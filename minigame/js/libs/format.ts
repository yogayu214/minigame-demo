/**
 * 通用格式化工具
 * 将任意对象递归展开为可读文本，避免嵌套对象显示 [object Object]
 */

/** 递归格式化值为可读字符串 */
export function formatValue(v: any): string {
  if (v === null || v === undefined) return '-';
  if (typeof v === 'object' && !Array.isArray(v)) {
    const entries = Object.entries(v);
    if (!entries.length) return '{}';
    const lines = entries.map(([key, val]) => `  ${key}: ${formatValue(val)}`);
    return '{\n' + lines.join('\n') + '\n}';
  }
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '[ ' + v.map((item) => formatValue(item)).join(', ') + ' ]';
  }
  return String(v);
}

/** 把任意对象格式化为 key: value 文本列表 */
export function formatObj(obj: any): string {
  if (!obj || typeof obj !== 'object') return String(obj);
  return Object.keys(obj)
    .map((k) => `${k}: ${formatValue(obj[k])}`)
    .join('\n');
}
