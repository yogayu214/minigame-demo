/**
 * 获取用户信息
 * wx.createUserInfoButton
 */

let userInfoBtn: any = null;

/** 创建获取用户信息按钮 */
export function createButton() {
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  userInfoBtn = wx.createUserInfoButton({
    type: 'text',
    text: '获取用户信息',
    style: { left: windowWidth / 2 - 75, top: windowHeight / 2, width: 150, height: 40, backgroundColor: '#07c160', color: '#ffffff', fontSize: 16, textAlign: 'center', lineHeight: 40, borderRadius: 4 },
  });
  userInfoBtn.onTap((res: any) => {
    console.log('用户信息:', res.userInfo);
  });
}

/** 销毁按钮 */
export function destroyButton() {
  if (userInfoBtn) { userInfoBtn.destroy(); userInfoBtn = null; }
}
