/**
 * 游戏服务管理器（非分包模式的入门示例）
 * wx.getGameServerManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/game-server-manager/GameServerManager.html
 *
 * 注意：完整的好友帧同步演示请走分包：路由「游戏服务 → 好友对战」会加载 sub-lockstep。
 * 这里只展示 GameServerManager 的基础 API 形态，不真正建房间。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let manager: any = null;

function ensure() {
  if (!manager) manager = wx.getGameServerManager();
  return manager;
}

/** 登录 GameServer（必须先调用） */
export function login() {
  ensure().login({
    success(res: any) {
      display.text(`login 成功\naccessInfo: ${JSON.stringify(res || {})}`);
    },
    fail(err: any) {
      display.text(`login 失败：${err.errMsg}`);
    },
  });
}

/** 监听比赛对局开始 */
export function onMatch() {
  ensure().onMatch((res: any) => {
    display.text(`事件: onMatch\n详情: ${JSON.stringify(res).slice(0, 100)}`);
  });
  display.text('已注册 onMatch 监听');
}

/** 创建房间（演示用，会立即 fail，仅展示 API） */
export function createRoom() {
  ensure().createRoom({
    maxMemberNum: 4,
    needUserInfo: true,
    roomType: 'demo',
    gameType: 'demo',
    success(res: any) {
      display.text(`创建房间成功\n房间号: ${res.accessInfo}`);
    },
    fail(err: any) {
      display.text(`createRoom 失败：${err.errMsg}`);
    },
  });
}

/** 查询房间信息（演示，需先有房间号） */
export function getRoomInfo() {
  ensure().getRoomInfo({
    success(res: any) {
      display.text(
        `getRoomInfo 成功\n详情: ${JSON.stringify(res).slice(0, 100)}`
      );
    },
    fail(err: any) {
      display.text(`getRoomInfo 失败：${err.errMsg}`);
    },
  });
}

/** 完整帧同步对战请进入分包：游戏服务 → 好友对战 */
export function gotoLockstepDemo() {
  display.text(
    `完整帧同步对战请进入分包\n路径: 主菜单 → 游戏服务 → 好友对战（帧同步）\n源码: sub-lockstep/`
  );
}

export function onUnload() {
  manager = null;
}
