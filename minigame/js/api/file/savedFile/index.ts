/**
 * 本地缓存文件
 * FileSystemManager.getSavedFileList / removeSavedFile
 */

/** 获取已保存文件列表 */
export function getSavedFileList() {
  wx.getFileSystemManager().getSavedFileList({
    success(res: any) { console.log('已保存文件:', res.fileList); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}

/** 删除已保存文件 */
export function removeSavedFile() {
  wx.getFileSystemManager().getSavedFileList({
    success(res: any) {
      if (res.fileList.length > 0) {
        wx.getFileSystemManager().removeSavedFile({
          filePath: res.fileList[0].filePath,
          success() { wx.showToast({ title: '已删除' }); },
        });
      } else {
        console.log('没有已保存文件');
      }
    },
  });
}
