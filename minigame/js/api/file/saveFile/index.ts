/**
 * 保存临时文件
 * FileSystemManager.saveFile
 */

/** 保存临时文件到本地 */
export function saveFile() {
  const fs = wx.getFileSystemManager();
  fs.writeFile({
    filePath: wx.env.USER_DATA_PATH + '/tempSave.txt',
    data: 'save test',
    encoding: 'utf8',
    success() {
      fs.saveFile({
        tempFilePath: wx.env.USER_DATA_PATH + '/tempSave.txt',
        success(res: any) { console.log('保存成功, 路径:', res.savedFilePath); },
        fail(err: any) { console.log('失败:', err.errMsg); },
      });
    },
  });
}
