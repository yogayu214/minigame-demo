/**
 * 游戏对局回放
 * wx.getGameRecorder / wx.createGameRecorderShareButton
 */

let gr: any = null;
let shareButton: any = null;
let writeTime = 0;

export function onLoad() {
  gr = wx.getGameRecorder();
}

/** 开始录制 */
export function startGameRecord() {
  writeTime = 0;
  wx.showLoading({ title: '正在启动录屏' });
  gr.start().then((res: any) => {
    wx.hideLoading();
    if (res.error?.code) {
      wx.showModal({ title: '录屏错误', content: res.errMsg, showCancel: false });
      return;
    }
    gr.on('timeUpdate', (r: any) => {
      writeTime = Math.min(r.currentTime, 60000);
      console.log(`录制中: ${writeTime}ms`);
    });
    console.log('录制已开始');
  });
}

/** 暂停录制 */
export function pause() {
  wx.showLoading({ title: '正在暂停录屏' });
  gr.pause().then((res: any) => {
    wx.hideLoading();
    if (res.error?.code) { wx.showModal({ content: res.errMsg, showCancel: false }); return; }
    console.log('已暂停');
  });
}

/** 继续录制 */
export function resume() {
  wx.showLoading({ title: '继续录屏' });
  gr.resume().then((res: any) => {
    wx.hideLoading();
    if (res.error?.code) { wx.showModal({ content: res.errMsg, showCancel: false }); return; }
    console.log('已继续');
  });
}

/** 停止录制 */
export function stopGameRecord() {
  if (writeTime < 2000) {
    wx.showToast({ title: '录屏时间需大于2秒', icon: 'none' });
    return;
  }
  wx.showLoading({ title: '正在结束录屏' });
  gr.stop().then((res: any) => {
    wx.hideLoading();
    if (res.error?.code) { wx.showModal({ content: res.errMsg, showCancel: false }); return; }
    gr.off('timeUpdate');
    console.log('录制完成, 时长:', writeTime, 'ms');

    // 创建分享录制视频按钮
    if (!shareButton) {
      shareButton = wx.createGameRecorderShareButton({
        style: { left: 100, top: 400, height: 40, backgroundColor: '#ffffff', color: '#576b95' } as any,
        text: '分享录制视频',
        share: {
          query: 'test=test',
          timeRange: [[0, writeTime]],
        } as any,
      });
    } else {
      shareButton.share.timeRange = [[0, writeTime]];
    }
    shareButton.show();
    shareButton.onTap((r: any) => { console.log('分享结果:', r); });
  });
}

/** 放弃录制 */
export function abort() {
  wx.showLoading({ title: '正在放弃录制' });
  gr.abort().then((res: any) => {
    wx.hideLoading();
    if (res.error?.code) { wx.showModal({ content: res.errMsg, showCancel: false }); return; }
    gr.off('timeUpdate');
    console.log('已放弃');
  });
}

/** 隐藏分享按钮 */
export function hideShareButton() {
  if (shareButton) shareButton.hide();
}

/** 显示分享按钮 */
export function showShareButton() {
  if (shareButton) shareButton.show();
}

export function onUnload() {
  if (shareButton) { shareButton.hide(); shareButton = null; }
  if (gr) { gr.off('timeUpdate'); }
  writeTime = 0;
}
