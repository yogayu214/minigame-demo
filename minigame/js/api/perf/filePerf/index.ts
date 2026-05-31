/**
 * 性能 - 用户目录文件性能与日志
 * wx.env.USER_DATA_PATH（仅访问属性，不是函数调用）
 * 配合 FileSystemManager 演示用户目录文件的读写性能。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 查看当前小游戏的用户数据目录 */
export function showUserDataPath() {
  const path = wx.env.USER_DATA_PATH;
  display.data({
    'wx.env.USER_DATA_PATH': path,
    说明: '该目录文件可在小游戏卸载前持久保存',
  });
}

/** 在用户目录写入一个 1MB 文件并测量耗时 */
export function measureWriteSpeed() {
  const fs = wx.getFileSystemManager();
  const path = `${wx.env.USER_DATA_PATH}/perf_demo.bin`;
  const size = 1024 * 1024; // 1MB
  const data = new ArrayBuffer(size);

  const t0 = Date.now();
  try {
    fs.writeFileSync(path, data);
    const cost = Date.now() - t0;
    display.data({
      路径: path,
      大小: '1 MB',
      耗时: `${cost} ms`,
      速度: `${(1024 / cost * 1000).toFixed(1)} KB/s`,
    });
  } catch (e: any) {
    display.text(`写入失败：${e.message || e}`);
  }
}

/** 读取上一步写入的文件并测量耗时 */
export function measureReadSpeed() {
  const fs = wx.getFileSystemManager();
  const path = `${wx.env.USER_DATA_PATH}/perf_demo.bin`;

  const t0 = Date.now();
  try {
    const data: any = fs.readFileSync(path);
    const cost = Date.now() - t0;
    display.data({
      路径: path,
      读取大小: `${(data.byteLength / 1024).toFixed(1)} KB`,
      耗时: `${cost} ms`,
    });
  } catch (e: any) {
    display.text(`读取失败：${e.message || e}（请先写入）`);
  }
}

/** 清理 perf demo 写入的文件 */
export function cleanup() {
  const fs = wx.getFileSystemManager();
  const path = `${wx.env.USER_DATA_PATH}/perf_demo.bin`;
  try {
    fs.unlinkSync(path);
    display.text('✓ 已清理 perf_demo.bin');
  } catch (e: any) {
    display.text(`清理失败：${e.message || e}`);
  }
}
