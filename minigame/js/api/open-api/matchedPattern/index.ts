/**
 * 对局匹配
 * wx.getGameServerManager
 */

const gameServer = wx.getGameServerManager();

/** 登录游戏服务 */
export function login() {
  gameServer.login();
  gameServer.onLogout(gameServer.login);
  console.log('已登录游戏服务');
}

/** 登出游戏服务 */
export function logout() {
  gameServer.offLogout(gameServer.login);
  gameServer.logout();
  console.log('已登出游戏服务');
}

/** 开始 1v1 匹配 */
export function startMatch1v1() {
  gameServer.startMatch({ match_id: 'npvL4nYFZCEJuKT6jQwiWGO2FKMB6gIYN9svnB6C8PI' });
  wx.showLoading({ title: '匹配中...' });
  gameServer.onMatch(function onMatched(res: any) {
    wx.hideLoading();
    console.log('1v1 匹配成功:', res.groupInfoList);
    gameServer.offMatch(onMatched);
  });
}

/** 开始 3v3 匹配 */
export function startMatch3v3() {
  gameServer.startMatch({ match_id: 'rgisvVgmGZz0p3C61zIUexIgDibx0DNzbNTn4QcHZEc' });
  wx.showLoading({ title: '匹配中...' });
  gameServer.onMatch(function onMatched(res: any) {
    wx.hideLoading();
    console.log('3v3 匹配成功:', res.groupInfoList);
    gameServer.offMatch(onMatched);
  });
}

/** 取消匹配 */
export function cancelMatch() {
  wx.hideLoading();
  gameServer.cancelMatch({ match_id: 'npvL4nYFZCEJuKT6jQwiWGO2FKMB6gIYN9svnB6C8PI' });
  console.log('已取消匹配');
}
