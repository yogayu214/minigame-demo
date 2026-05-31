/**
 * 查看目录内容
 * FileSystemManager.readdir
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 读取用户目录下的文件列表 */
export function readdir() {
  wx.getFileSystemManager().readdir({
    dirPath: wx.env.USER_DATA_PATH,
    success(res: any) {
      if (res.files.length === 0) {
        display.text('（目录为空）');
        return;
      }
      const data: Record<string, string> = {};
      res.files.forEach((f: string, i: number) => {
        data[`[${i + 1}]`] = f;
      });
      display.data(data);
    },
    fail(err: any) {
      wx.showModal({ title: '失败', content: err.errMsg, showCancel: false });
    },
  });
}
