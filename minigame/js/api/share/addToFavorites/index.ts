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
  favoritesFn = () => {
    let imageUrl = '';
    try {
      imageUrl = canvas.toTempFilePathSync({
        x: 0,
        y: 0,
        width: canvas.width,
        height: (canvas.width * 4) / 5,
      });
    } catch (e: any) {
      console.error('[addToFavorites] toTempFilePathSync 失败', e);
    }
    return {
      title: '小游戏 API 示例 - 收藏',
      imageUrl,
      query: `pathName=${window.router.getNowPageName()}`,
    };
  };
  (wx as any).onAddToFavorites(favoritesFn);
  wx.showToast({ title: '点击右上角菜单收藏查看效果', icon: 'none' });
}

/** 取消监听收藏 */
export function offAddToFavorites() {
  if (favoritesFn) {
    (wx as any).offAddToFavorites(favoritesFn);
    favoritesFn = null;
    wx.showToast({ title: '已取消监听', icon: 'none' });
  } else {
    wx.showToast({ title: '当前无监听，无需取消', icon: 'none' });
  }
}

export function onUnload() {
  if (favoritesFn) {
    (wx as any).offAddToFavorites(favoritesFn);
    favoritesFn = null;
  }
}
