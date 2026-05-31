/**
 * 对局匹配
 * wx.getGameServerManager
 */

const gameServer = wx.getGameServerManager();
let isLoggedIn = false;
let currentMatchId = '';

/** 登录游戏服务 */
export function login() {
  gameServer.login();
  gameServer.onLogout(gameServer.login);
  isLoggedIn = true;
  console.log('已登录游戏服务');
  wx.showToast({ title: '已登录' });
}

/** 登出游戏服务 */
export function logout() {
  if (currentMatchId) {
    wx.showToast({ title: '请先取消匹配', icon: 'none' });
    return;
  }
  gameServer.offLogout(gameServer.login);
  gameServer.logout();
  isLoggedIn = false;
  console.log('已登出游戏服务');
  wx.showToast({ title: '已登出' });
}

/** 开始 1v1 匹配 */
export function startMatch1v1() {
  if (!isLoggedIn) { wx.showToast({ title: '请先登录', icon: 'none' }); return; }
  currentMatchId = 'npvL4nYFZCEJuKT6jQwiWGO2FKMB6gIYN9svnB6C8PI';
  gameServer.startMatch({ match_id: currentMatchId });
  wx.showLoading({ title: '1v1 匹配中...' });
  gameServer.onMatch(function onMatched(res: any) {
    wx.hideLoading();
    currentMatchId = '';
    console.log('1v1 匹配成功:', res.groupInfoList);
    wx.showToast({ title: '匹配成功' });
    gameServer.offMatch(onMatched);
  });
}

/** 开始 3v3 匹配 */
export function startMatch3v3() {
  if (!isLoggedIn) { wx.showToast({ title: '请先登录', icon: 'none' }); return; }
  currentMatchId = 'rgisvVgmGZz0p3C61zIUexIgDibx0DNzbNTn4QcHZEc';
  gameServer.startMatch({ match_id: currentMatchId });
  wx.showLoading({ title: '3v3 匹配中...' });
  gameServer.onMatch(function onMatched(res: any) {
    wx.hideLoading();
    currentMatchId = '';
    console.log('3v3 匹配成功:', res.groupInfoList);
    wx.showToast({ title: '匹配成功' });
    gameServer.offMatch(onMatched);
  });
}

/** 取消匹配 */
export function cancelMatch() {
  if (!currentMatchId) { wx.showToast({ title: '当前无匹配', icon: 'none' }); return; }
  wx.hideLoading();
  gameServer.cancelMatch({ match_id: currentMatchId });
  currentMatchId = '';
  console.log('已取消匹配');
  wx.showToast({ title: '已取消' });
}
