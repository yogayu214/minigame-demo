/**
 * 收藏监听
 * wx.onAddToFavorites / wx.offAddToFavorites
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.onAddToFavorites.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.offAddToFavorites.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let favoritesFn: any = null;

/** 监听用户添加收藏 */
export function onAddToFavorites() {
  favoritesFn = () => ({
    title: '小游戏 API 示例 - 收藏',
    imageUrl: canvas.toTempFilePathSync({
      x: 0,
      y: 0,
      width: canvas.width,
      height: (canvas.width * 4) / 5,
    }),
    query: `pathName=${window.router.getNowPageName()}`,
  });
  (wx as any).onAddToFavorites(favoritesFn);
  display.text('已监听收藏事件');
}

/** 取消监听收藏 */
export function offAddToFavorites() {
  if (favoritesFn) {
    (wx as any).offAddToFavorites(favoritesFn);
    favoritesFn = null;
    display.text('已取消监听收藏');
  } else {
    display.text('当前无监听，无需取消');
  }
}

export function onUnload() {
  if (favoritesFn) {
    (wx as any).offAddToFavorites(favoritesFn);
    favoritesFn = null;
  }
}
