/**
 * 收藏监听
 * wx.onAddToFavorites / wx.offAddToFavorites
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.onAddToFavorites.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.offAddToFavorites.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea();
export { onInfoTextReady, infoArea };

let favoritesFn: any = null;

/** 监听用户添加收藏 */
export function onAddToFavorites() {
  if (favoritesFn) {
    setInfo('已在监听中，请先取消');
    return;
  }
  favoritesFn = () => {
    setInfo('收藏事件已触发\n\n返回参数:\n  title: 小游戏 API 示例 - 收藏\n  query: pathName=' + window.router.getNowPageName());
    return {
      title: '小游戏 API 示例 - 收藏',
      imageUrl: '',
      query: `pathName=${window.router.getNowPageName()}`,
    };
  };
  (wx as any).onAddToFavorites(favoritesFn);
  setInfo('已注册收藏监听\n\n请点击右上角菜单 → 收藏，触发后此处会显示回调结果');
}

/** 取消监听收藏 */
export function offAddToFavorites() {
  if (favoritesFn) {
    (wx as any).offAddToFavorites(favoritesFn);
    favoritesFn = null;
    setInfo('已取消收藏监听');
  } else {
    setInfo('当前无监听，无需取消');
  }
}

export function onUnload() {
  if (favoritesFn) {
    (wx as any).offAddToFavorites(favoritesFn);
    favoritesFn = null;
  }
}
