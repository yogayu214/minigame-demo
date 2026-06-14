/**
 * 分包加载
 * wx.loadSubpackage / wx.preDownloadSubpackage
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/subpackage/wx.loadSubpackage.html
 *
 * 注意：本 demo 已有 chattool / lockstep 两个分包（见 game.json），
 * 由 router 在用户进入对应页面时按需加载，这里仅做 API 用法演示。
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const DEMO_SUBPACKAGE = 'chattool'; // 复用项目里已有的分包名

/** 加载指定分包 */
export function loadSubpackage() {
  display.text('开始加载分包 ' + DEMO_SUBPACKAGE + '...');
  const task = wx.loadSubpackage({
    name: DEMO_SUBPACKAGE,
    success() {
      display.text(
        formatObj({
          状态: '分包加载成功',
          分包名: DEMO_SUBPACKAGE,
        })
      );
    },
    fail(err: any) {
      display.text(`加载失败：${err.errMsg}`);
    },
    complete() {},
  });

  task.onProgressUpdate((res: any) => {
    display.text(
      formatObj({
        进度: `${res.progress}%`,
        已下载: `${res.totalBytesWritten} B`,
        总大小: `${res.totalBytesExpectedToWrite} B`,
      })
    );
  });
}

/** 预下载分包（不执行，仅下载） */
export function preDownloadSubpackage() {
  display.text('开始预下载分包...');
  const task = wx.preDownloadSubpackage({
    name: DEMO_SUBPACKAGE,
    success() {
      display.text('预下载完成');
    },
    fail(err: any) {
      display.text(`预下载失败：${err.errMsg}`);
    },
    complete() {},
  });

  task.onProgressUpdate((res: any) => {
    display.text(
      formatObj({
        预下载进度: `${res.progress}%`,
        已下载: `${res.totalBytesWritten} B`,
        总大小: `${res.totalBytesExpectedToWrite} B`,
      })
    );
  });
}
