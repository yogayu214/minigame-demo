/**
 * OPENLINK / PageManager
 * wx.createPageManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/openlink/wx.createPageManager.html
 *
 * 本页演示通过 wx.createPageManager 加载并展示不同 openlink 模板：
 *  - 单游戏 CPS 组件（指定 / 未指定游戏、指定位置、错误 id）
 *  - 多游戏 CPS 组件（横版 / 竖版）
 *  - 橱窗组件（load + show 两步式）
 *  - 推荐组件
 *  - WeCare 点赞活动
 *  - 公益金
 *
 * 所有事件日志统一输出到按钮上方信息区（setInfo），方便排查时序与回调。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮触发对应 openlink 模板，事件日志将在此区域实时展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'openLink';
// ============== 共享 openlink（CPS 单/多游戏组件共用） ==============
const CPS_OPENLINK =
  'wFFX1cDJnwJCet72QGUJJvBpa9z9lfAob-7EYHwzFENHJ_tNECj5LquvJqnbm82RktAcRyg7gORaUSh0yRSiuYF21JvF84j7-SgazajvTW-ScbwFiQccq8FWsrzHVPox1dr90HHv_CTrgRJD4HOdiRJFeLNRrDu0Pj3vsIGuonI';

// 推荐组件 openlink
const RECOMMEND_OPENLINK =
  'TWFRCqV5WeM2AkMXhKwJ03MhfPOieJfAsvXKUbWvQFQtLyyA5etMPabBehga950uzfZcH3Vi3QeEh41xRGEVFw';

// WeCare 点赞活动 openlink
const WECARE_LIKE_OPENLINK =
  'wCIJpZM7N0rsMbYlKH03Z1uFI2G6Nr1nUhPqMc9lC4pqchc4G-s-zfU09baSzQWeztheB0DEF1KC8hbqI2ST31oGgGeJBipmVSO1trYCNmQ';

// 公益金 openlink
const CHARITY_FUND_OPENLINK =
  'X5TclDH7CWVKbF8uUysD_Qgj93ixPLYkuY57VTjGQ9797nwh9kT-rCy3fqSLsjW50BsiioV8OBPuXw4-vFG92Ge1PJHiXduZ5ilVE6rlURICbL35bMPxm68lGNhy1fK5';

// ============== 通用：给 pageManager 挂全套事件日志 ==============
function bindPageManagerEvents(pm: any, name: string) {
  if (!pm) return;
  pm.on('show', () => setInfo(`[${name}] show`));
  pm.on('destroy', () => setInfo(`[${name}] destroy`));
  pm.on('ready', () => setInfo(`[${name}] ready`));
  pm.on('click', (res: any) => setInfo(`[${name}] click: ${JSON.stringify(res)}`));
  pm.on('error', (res: any) => setInfo(`[${name}] error: ${JSON.stringify(res)}`));
}

// ============== 通用：show 一个 pageManager ==============
function showPageManager(name: string, openlink: string, query?: Record<string, any>) {
  const pm: any = (wx as any).createPageManager?.();
  if (!pm) {
    setInfo('当前版本不支持 createPageManager');
    return;
  }
  bindPageManagerEvents(pm, name);
  pm.show({ openlink, query })
    .then((res: any) => setInfo(`[${name}] show success: ${JSON.stringify(res)}`))
    .catch((err: any) => setInfo(`[${name}] show fail: ${JSON.stringify(err)}`))
    .finally((res: any) => setInfo(`[${name}] show complete: ${JSON.stringify(res)}`));
}

// ============== 橱窗组件共享实例（load + show 两步式） ==============
let showcasePageManager: any = null;

// ============== 按钮函数 ==============

/** 单游戏组件0（错误组件 id） */
export function cpsSingleGameWrongId() {
  showPageManager('单游戏组件0-错误id', CPS_OPENLINK, { id: 'fooooooo' });
}

/** 单游戏组件1（指定游戏、未指定位置） */
export function cpsSingleGameDefault() {
  showPageManager('单游戏组件1-指定游戏', CPS_OPENLINK, {
    id: 'CpsCBgAAoXkpQY8NWzzP0cJ5',
  });
}

/** 单游戏组件2（未指定游戏、指定位置） */
export function cpsSingleGameWithPos() {
  showPageManager('单游戏组件2-指定位置', CPS_OPENLINK, {
    id: 'CpsCBgAAoXkpQY8NWzzP0cJ-',
    top: 200,
    left: 100,
  });
}

/** 多游戏组件1（指定游戏、未指定位置、横版） */
export function cpsMultiGameLandscape() {
  showPageManager('多游戏组件1-横版', CPS_OPENLINK, {
    id: 'CpsCBgAAoXkpQY8NWzzP0cJ4',
  });
}

/** 多游戏组件2（指定游戏、未指定位置、竖版） */
export function cpsMultiGameVertical() {
  showPageManager('多游戏组件2-竖版', CPS_OPENLINK, {
    id: 'CpsCBgAAoXkpQY8NWzzP0cJ4',
    isVertical: true,
  });
}

/** 橱窗组件（指定游戏）- load 阶段 */
export function showcaseLoad() {
  if (!showcasePageManager) {
    showcasePageManager = (wx as any).createPageManager?.();
    if (!showcasePageManager) {
      setInfo('当前版本不支持 createPageManager');
      return;
    }
    bindPageManagerEvents(showcasePageManager, '橱窗组件');
  }
  showcasePageManager
    .load({
      openlink: CPS_OPENLINK,
      query: {
        id: 'CpsCBgAAoXkpQY8NWzzP0cJ_',
      },
    })
    .then(() => setInfo('[橱窗组件] load success，可点击 showcaseShow 展示'))
    .catch((e: any) => setInfo(`[橱窗组件] load error: ${JSON.stringify(e)}`));
}

/** 橱窗组件（指定游戏）- show 阶段 */
export function showcaseShow() {
  if (!showcasePageManager) {
    setInfo('请先点击 showcaseLoad 加载橱窗组件');
    return;
  }
  showcasePageManager
    .show()
    .then(() => setInfo('[橱窗组件] show success'))
    .catch((e: any) => setInfo(`[橱窗组件] show error: ${JSON.stringify(e)}`));
}

/** 推荐组件 */
export function recommendComponent() {
  showPageManager('推荐组件', RECOMMEND_OPENLINK);
}

/** WeCare 点赞活动 */
export function wecareLikeActivity() {
  showPageManager('WeCare点赞活动', WECARE_LIKE_OPENLINK);
}

/** 公益金 */
export function wecareCharityFund() {
  showPageManager('公益金', CHARITY_FUND_OPENLINK);
}

// ============== 页面卸载时清理共享实例 ==============
export function onUnload() {
  if (showcasePageManager) {
    showcasePageManager.destroy?.();
    showcasePageManager = null;
  }
}
