/**
 * 传感器页面通用的"开始监听/停止监听"互锁按钮工厂
 */

export function createSensorButtons(
  PIXI: any,
  obj: any,
  baseY: number,
  onStart: () => void,
  onStop: () => void
) {
  const { p_button, p_text } = require('../component/index');

  // 切换按钮可用/不可用状态
  function switchState(
    active: any, inactiveColor: number,
    inactive: any, activeColor: number
  ) {
    active.isTouchable(false);
    active.turnColors({ border: { color: inactiveColor } });
    active.children[0]?.children[0]?.turnColors?.(inactiveColor);
    inactive.isTouchable(true);
    inactive.turnColors({ border: { color: activeColor } });
    inactive.children[0]?.children[0]?.turnColors?.(activeColor);
  }

  const startBtn = p_button(PIXI, {
    width: 296 * PIXI.ratio, height: 66 * PIXI.ratio,
    border: { width: 2 * PIXI.ratio, color: 0x353535 },
    radius: 10 * PIXI.ratio, alpha: 0,
    x: 63 * PIXI.ratio, y: baseY,
  });
  startBtn.myAddChildFn(p_text(PIXI, {
    content: '开始监听', fontSize: 32 * PIXI.ratio, fill: 0x353535,
    relative_middle: { containerWidth: startBtn.width, containerHeight: startBtn.height },
  }));

  const stopBtn = p_button(PIXI, {
    width: 296 * PIXI.ratio, height: 66 * PIXI.ratio,
    border: { width: 2 * PIXI.ratio, color: 0xe9e9e9 },
    radius: 10 * PIXI.ratio, alpha: 0,
    x: obj.width - 357 * PIXI.ratio, y: baseY,
  });
  stopBtn.myAddChildFn(p_text(PIXI, {
    content: '停止监听', fontSize: 32 * PIXI.ratio, fill: 0xe9e9e9,
    relative_middle: { containerWidth: stopBtn.width, containerHeight: stopBtn.height },
  }));
  stopBtn.isTouchable(false);

  function start() {
    switchState(startBtn, 0xe9e9e9, stopBtn, 0x353535);
    onStart();
  }
  function stop() {
    switchState(stopBtn, 0xe9e9e9, startBtn, 0x353535);
    onStop();
  }

  startBtn.onClickFn(start);
  stopBtn.onClickFn(stop);

  return { startBtn, stopBtn, start, stop };
}
