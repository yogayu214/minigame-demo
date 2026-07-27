/**
 * OPENLINK / PageManager
 * wx.createPageManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/openlink/wx.createPageManager.html
 *
 * 每个组件使用独立的 pageManager 实例（load + show 两步式）。
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

// ============== openlink 值 ==============

const RECOMMEND_OPENLINK =
  'TWFRCqV5WeM2AkMXhKwJ03MhfPOieJfAsvXKUbWvQFQtLyyA5etMPabBehga950uzfZcH3Vi3QeEh41xRGEVFw';

const WECARE_LIKE_OPENLINK =
  'wCIJpZM7N0rsMbYlKH03Z1uFI2G6Nr1nUhPqMc9lC4pqchc4G-s-zfU09baSzQWeztheB0DEF1KC8hbqI2ST31oGgGeJBipmVSO1trYCNmQ';

const CHARITY_FUND_OPENLINK =
  'X5TclDH7CWVKbF8uUysD_Qgj93ixPLYkuY57VTjGQ9797nwh9kT-rCy3fqSLsjW50BsiioV8OBPuXw4-vFG92Ge1PJHiXduZ5ilVE6rlURICbL35bMPxm68lGNhy1fK5';

// ============== 各实例（每个按钮独立） ==============

let recommendPM: any = null;
let likePM: any = null;
let charityPM: any = null;

// ============== 推荐组件 ==============

/** 推荐组件 */
export function recommendComponent() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    recommendPM.show()
      .then(() => setInfo('[推荐组件] show success'))
      .catch((e: any) => setInfo(`[推荐组件] show fail: ${JSON.stringify(e)}`));
  };

  if (recommendPM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('onClose', () => setInfo('[推荐组件] onClose — 半屏已关闭'));
  pm.on('error', (res: any) => setInfo(`[推荐组件] error: ${JSON.stringify(res)}`));

  setInfo('[推荐组件] loading...');
  pm.load({ openlink: RECOMMEND_OPENLINK })
    .then(() => {
      recommendPM = pm;
      setInfo('[推荐组件] load success，正在拉起半屏...');
      doShow();
    })
    .catch((err: any) => {
      setInfo(`[推荐组件] load fail: ${JSON.stringify(err)}`);
    });
}

// ============== WeCare 点赞活动 ==============

/** WeCare 点赞活动 */
export function wecareLikeActivity() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    likePM.show()
      .then(() => setInfo('[WeCare点赞] show success'))
      .catch((e: any) => setInfo(`[WeCare点赞] show fail: ${JSON.stringify(e)}`));
  };

  if (likePM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('onClose', () => setInfo('[WeCare点赞] onClose — 半屏已关闭'));
  pm.on('error', (res: any) => setInfo(`[WeCare点赞] error: ${JSON.stringify(res)}`));

  setInfo('[WeCare点赞] loading...');
  pm.load({ openlink: WECARE_LIKE_OPENLINK })
    .then(() => {
      likePM = pm;
      setInfo('[WeCare点赞] load success，正在拉起半屏...');
      doShow();
    })
    .catch((err: any) => {
      setInfo(`[WeCare点赞] load fail: ${JSON.stringify(err)}`);
    });
}

// ============== 公益金 ==============

/** 公益金 */
export function wecareCharityFund() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    charityPM.show()
      .then(() => setInfo('[公益金] show success'))
      .catch((e: any) => setInfo(`[公益金] show fail: ${JSON.stringify(e)}`));
  };

  if (charityPM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('onClose', () => setInfo('[公益金] onClose — 半屏已关闭'));
  pm.on('error', (res: any) => setInfo(`[公益金] error: ${JSON.stringify(res)}`));

  setInfo('[公益金] loading...');
  pm.load({ openlink: CHARITY_FUND_OPENLINK })
    .then(() => {
      charityPM = pm;
      setInfo('[公益金] load success，正在拉起半屏...');
      doShow();
    })
    .catch((err: any) => {
      setInfo(`[公益金] load fail: ${JSON.stringify(err)}`);
    });
}

// ============== 页面卸载清理 ==============

export function onUnload() {
  if (recommendPM) {
    recommendPM.destroy?.();
    recommendPM = null;
  }
  if (likePM) {
    likePM.destroy?.();
    likePM = null;
  }
  if (charityPM) {
    charityPM.destroy?.();
    charityPM = null;
  }
}
