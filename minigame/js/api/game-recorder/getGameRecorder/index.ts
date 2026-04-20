/**
 * 游戏对局回放
 * wx.getGameRecorder
 */

let gr: any = null;

/** 初始化录制器 */
export function onLoad() {
  gr = wx.getGameRecorder();
}

/** 开始录制 */
export function startGameRecord() {
  gr.on('timeUpdate', (r: any) => console.log('录制中...', r.currentTime, 'ms'));
  gr.start({ duration: 300, gop: 1, hookBgm: false }).then(() => console.log('录制已开始'));
}

/** 暂停录制 */
export function pause() {
  gr.pause().then(() => console.log('已暂停'));
}

/** 继续录制 */
export function resume() {
  gr.resume().then(() => console.log('已继续'));
}

/** 停止录制 */
export function stopGameRecord() {
  gr.stop().then((res: any) => console.log('录制完成, 时长:', res.duration, 'ms'));
}

/** 放弃录制 */
export function abort() {
  gr.abort().then(() => console.log('已放弃'));
}
