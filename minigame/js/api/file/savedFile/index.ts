/**
 * 本地缓存文件
 * FileSystemManager.getSavedFileList / removeSavedFile
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取已保存文件列表 */
export function getSavedFileList() {
  wx.getFileSystemManager().getSavedFileList({
    success(res: any) {
      if (res.fileList.length === 0) {
        display.text('暂无已保存文件');
        return;
      }
      const list = res.fileList
        .map((f: any, i: number) => `[${i + 1}] ${f.filePath} (${f.size}B)`)
        .join('\n');
      display.text(`已保存 ${res.fileList.length} 个文件:\n${list}`);
    },
    fail(err: any) {
      display.text(`获取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 删除已保存文件 */
export function removeSavedFile() {
  wx.getFileSystemManager().getSavedFileList({
    success(res: any) {
      if (res.fileList.length > 0) {
        wx.getFileSystemManager().removeSavedFile({
          filePath: res.fileList[0].filePath,
          success() {
            display.text('已删除第一个已保存文件');
          },
          fail(err: any) {
            display.text(`删除失败: ${err?.errMsg || '未知错误'}`);
          },
        });
      } else {
        display.text('没有已保存文件');
      }
    },
    fail(err: any) {
      display.text(`获取列表失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}
