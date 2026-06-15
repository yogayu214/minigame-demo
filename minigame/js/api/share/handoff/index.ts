/**
 * PC 接力
 * wx.setHandoffQuery / wx.onHandoff / wx.offHandoff / wx.checkHandoffEnabled
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.setHandoffQuery.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.onHandoff.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.offHandoff.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.checkHandoffEnabled.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let handoffFn: any = null;

/** 设置接力 query（同步接口，返回 Boolean） */
export function setHandoffQuery() {
  const query = 'from=demo&ts=' + Date.now();
  const ok = (wx as any).setHandoffQuery(query);
  display.text(
    formatObj({
      query,
      设置结果: ok ? '成功' : '失败',
    })
  );
}

/** 监听接力事件 */
export function onHandoff() {
  handoffFn = (res: any) => {
    display.text(
      formatObj({
        事件: 'onHandoff',
        query: res.query ?? '-',
      })
    );
  };
  (wx as any).onHandoff(handoffFn);
  display.text('已监听接力事件');
}

/** 取消监听接力 */
export function offHandoff() {
  if (handoffFn) {
    (wx as any).offHandoff(handoffFn);
    handoffFn = null;
    display.text('已取消监听接力');
  } else {
    display.text('当前无监听，无需取消');
  }
}

/** 检查接力是否可用（异步接口） */
export function checkHandoffEnabled() {
  (wx as any).checkHandoffEnabled({
    success(res: any) {
      display.text(
        formatObj({
          接力可用: String(!!res.isEnabled),
          errCode: res.errCode ?? '-',
        })
      );
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '查询失败',
          原因: err.errMsg,
        })
      );
    },
  });
}

export function onUnload() {
  if (handoffFn) {
    (wx as any).offHandoff(handoffFn);
    handoffFn = null;
  }
}
