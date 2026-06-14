/**
 * 判断路径是否是目录
 * FileSystemManager.stat
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取路径 stat 信息 */
export function statPath() {
  wx.getFileSystemManager().stat({
    path: wx.env.USER_DATA_PATH,
    success(res: any) {
      display.text(
        `路径: ${wx.env.USER_DATA_PATH}\n` +
          `类型: ${res.stats.isDirectory() ? '目录' : '文件'}\n` +
          `大小: ${res.stats.size} 字节`
      );
    },
    fail(err: any) {
      display.text(`获取失败: ${err.errMsg}`);
    },
  });
}
