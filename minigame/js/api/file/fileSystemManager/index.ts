/**
 * 文件系统管理器（综合）
 * 演示 FileSystemManager 的常用操作：读、写、追加、复制、移动、删除、stat、压缩。
 *
 * 涉及 API：
 *   wx.getFileSystemManager → FileSystemManager.* 链式调用
 *     writeFile / writeFileSync / readFile / readFileSync
 *     appendFile / appendFileSync / copyFile / copyFileSync
 *     unlink / unlinkSync / truncate / truncateSync
 *     open / openSync / close / closeSync / read / readSync / write / writeSync
 *     fstat / fstatSync / ftruncate / ftruncateSync
 *     readCompressedFile / readCompressedFileSync / readZipEntry
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/file/FileSystemManager.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const FS = wx.getFileSystemManager();
const USER = wx.env.USER_DATA_PATH;
const PATH = `${USER}/fs_demo.txt`;
const COPY_PATH = `${USER}/fs_demo_copy.txt`;

/** 写入文本文件 */
export function writeFile() {
  FS.writeFile({
    filePath: PATH,
    data: 'Hello FileSystem!\nLine 2\nLine 3',
    encoding: 'utf8',
    success() {
      display.text(`路径: ${PATH}\n状态: 写入成功`);
    },
    fail(err: any) {
      display.text(`写入失败: ${err.errMsg}`);
    },
  });
}

/** 同步写入 */
export function writeFileSync() {
  try {
    FS.writeFileSync(PATH, 'sync write @ ' + Date.now(), 'utf8');
    display.text('同步写入成功');
  } catch (e: any) {
    display.text(`同步写入失败: ${e.message}`);
  }
}

/** 读取文本文件 */
export function readFile() {
  FS.readFile({
    filePath: PATH,
    encoding: 'utf8',
    success(res: any) {
      const content = String(res.data).slice(0, 60);
      display.text(`内容: ${content}\n长度: ${String(res.data).length}`);
    },
    fail(err: any) {
      display.text(`读取失败: ${err.errMsg}（请先 writeFile）`);
    },
  });
}

/** 同步读取 */
export function readFileSync() {
  try {
    const data = FS.readFileSync(PATH, 'utf8');
    display.text(`内容: ${String(data).slice(0, 60)}\n同步: 是`);
  } catch (e: any) {
    display.text(`同步读取失败: ${e.message}`);
  }
}

/** 追加内容 */
export function appendFile() {
  FS.appendFile({
    filePath: PATH,
    data: `\nappended @ ${new Date().toLocaleTimeString()}`,
    encoding: 'utf8',
    success() {
      display.text('追加成功');
    },
    fail(err: any) {
      display.text(`追加失败: ${err.errMsg}`);
    },
  });
}

/** 复制文件 */
export function copyFile() {
  FS.copyFile({
    srcPath: PATH,
    destPath: COPY_PATH,
    success() {
      display.text(`源: ${PATH}\n目标: ${COPY_PATH}\n状态: 复制成功`);
    },
    fail(err: any) {
      display.text(`复制失败: ${err.errMsg}`);
    },
  });
}

/** 删除文件 */
export function unlink() {
  FS.unlink({
    filePath: COPY_PATH,
    success() {
      display.text('副本已删除');
    },
    fail(err: any) {
      display.text(`删除失败: ${err.errMsg}`);
    },
  });
}

/** 截断文件（保留前 5 字节） */
export function truncate() {
  FS.truncate({
    filePath: PATH,
    length: 5,
    success() {
      display.text('已截断到 5 字节');
    },
    fail(err: any) {
      display.text(`截断失败: ${err.errMsg}`);
    },
  });
}

/** 文件描述符 open/close/read */
export function fdReadWrite() {
  FS.open({
    filePath: PATH,
    flag: 'r',
    success(res: any) {
      const fd = res.fd;
      const buf = new ArrayBuffer(64);
      FS.read({
        fd,
        arrayBuffer: buf,
        success(r: any) {
          display.text(
            `读取字节: ${r.bytesRead}\n内容: ${bufToText(buf, r.bytesRead)}`
          );
          FS.close({ fd });
        },
        fail(err: any) {
          display.text(`read 失败: ${err.errMsg}`);
          FS.close({ fd });
        },
      });
    },
    fail(err: any) {
      display.text(`open 失败: ${err.errMsg}（请先 writeFile）`);
    },
  });
}

/** fstat - 通过 fd 查询文件状态 */
export function fstat() {
  FS.open({
    filePath: PATH,
    flag: 'r',
    success(res: any) {
      const fd = res.fd;
      FS.fstat({
        fd,
        success(r: any) {
          display.text(
            `size: ${r.stats.size}\n` +
              `isFile: ${r.stats.isFile()}\n` +
              `mtime: ${new Date(r.stats.lastModifiedTime * 1000).toLocaleString()}`
          );
          FS.close({ fd });
        },
        fail(err: any) {
          display.text(`fstat 失败: ${err.errMsg}`);
          FS.close({ fd });
        },
      });
    },
    fail(err: any) {
      display.text(`open 失败: ${err.errMsg}`);
    },
  });
}

/** 读取压缩文件 */
export function readCompressedFile() {
  if (typeof FS.readCompressedFile !== 'function') {
    display.text('当前版本不支持 readCompressedFile');
    return;
  }
  FS.readCompressedFile({
    filePath: PATH,
    compressionAlgorithm: 'br',
    success(res: any) {
      display.text('压缩文件读取成功，长度 ' + res.data.byteLength);
    },
    fail(err: any) {
      display.text(`读取失败: ${err.errMsg}`);
    },
  });
}

function bufToText(buf: ArrayBuffer, len: number) {
  const view = new Uint8Array(buf, 0, len);
  return String.fromCharCode.apply(null, Array.from(view));
}
