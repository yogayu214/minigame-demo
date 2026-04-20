/**
 * 关系链互动数据
 * 在赠送/索要/邀请场景搭配好友列表、排行榜使用
 */

/** 上报默认分数并展示关系链互动数据 */
export function showRelationalChainData() {
  wx.setUserCloudStorage({
    KVDataList: [{
      key: 'score',
      value: JSON.stringify({ wxgame: { score: 0, update_time: (Date.now() / 1000) | 0 } }),
    }],
  });
  wx.getOpenDataContext().postMessage({ event: 'relationalChaininteractiveData' });
  console.log('已上报分数并发送关系链互动事件到开放数据域');
}
