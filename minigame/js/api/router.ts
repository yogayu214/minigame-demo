const signIn = [
  {
    label: '小游戏示例',
    name: 'APIentry',
    path: 'APIentry/index',
    tabBar: 'index',
    children: [
      // ========== 基础能力 ==========
      {
        label: '基础',
        name: 'base',
        children: [
          // 待补充：系统信息、更新、生命周期、分包加载等
        ],
      },
      {
        label: '跳转',
        name: 'navigate',
        children: [
          // 待补充：重启小程序、跳转小程序、退出小程序等
        ],
      },
      {
        label: '转发',
        name: 'share',
        children: [
          {
            label: '转发',
            name: 'onShareAppMessage',
            path: 'share/onShareAppMessage/index',
          },
          {
            label: '主动转发',
            name: 'shareAppMessage',
            path: 'share/shareAppMessage/index',
          },
          {
            label: '朋友圈分享',
            name: 'shareTimeLine',
            path: 'share/shareTimeLine/index',
          },
        ],
      },
      {
        label: '界面',
        name: 'ui',
        children: [
          {
            label: '显示操作菜单',
            name: 'showActionSheet',
            path: 'ui/showActionSheet/index',
          },
          {
            label: '显示模态弹窗',
            name: 'showModal',
            path: 'ui/showModal/index',
          },
          {
            label: '显示消息提示框',
            name: 'showToast',
            path: 'ui/showToast/index',
          },
        ],
      },

      // ========== 数据通信 ==========
      {
        label: '网络',
        name: 'network',
        children: [
          {
            label: '发送请求',
            name: 'request',
            path: 'network/request/index',
          },
          {
            label: '下载文件',
            name: 'downloadFile',
            path: 'network/downloadFile/index',
          },
          {
            label: '上传文件',
            name: 'uploadFile',
            path: 'network/uploadFile/index',
          },
          {
            label: 'WebSocket',
            name: 'WebSocket',
            path: 'network/webSocket/index',
          },
        ],
      },
      {
        label: '数据缓存',
        name: 'storage',
        children: [
          {
            label: '数据缓存',
            name: 'storageOp',
            path: 'storage/storage/index',
          },
        ],
      },
      {
        label: '数据分析',
        name: 'data-analysis',
        children: [
          // 待补充：事件上报、游戏场景上报等
        ],
      },

      // ========== 多媒体 ==========
      {
        label: '渲染',
        name: 'render',
        children: [
          {
            label: '画布内容转换为URL',
            name: 'toDataURL',
            path: 'render/toDataURL/index',
          },
          {
            label: '截图生成一个临时文件',
            name: 'toTempFilePath',
            path: 'render/toTempFilePath/index',
          },
          {
            label: '渲染帧率',
            name: 'setPreferredFramesPerSecond',
            path: 'render/setPreferredFramesPerSecond/index',
          },
          {
            label: '加载自定义字体文件',
            name: 'loadFont',
            path: 'render/loadFont/index',
          },
          {
            label: '创建一个图片对象',
            name: 'createImage',
            path: 'render/createImage/index',
          },
        ],
      },
      {
        label: '媒体',
        name: 'media',
        children: [
          {
            label: '视频',
            name: 'video',
            path: 'media/video/index',
          },
          {
            label: '音频',
            name: 'voiceFrequency',
            path: 'media/voiceFrequency/index',
          },
          {
            label: '录音',
            name: 'voice',
            path: 'media/voice/index',
          },
          {
            label: '相机',
            name: 'camera',
            path: 'media/camera/index',
          },
        ],
      },

      // ========== 系统能力 ==========
      {
        label: '位置',
        name: 'location',
        children: [
          {
            label: '获取当前位置',
            name: 'getLocation',
            path: 'location/getLocation/index',
          },
        ],
      },
      {
        label: '设备',
        name: 'device',
        children: [
          {
            label: '更新',
            name: 'getUpdateManager',
            path: 'device/getUpdateManager/index',
          },
          {
            label: '振动',
            name: 'vibrate',
            path: 'device/vibrate/index',
          },
          {
            label: '剪贴板',
            name: 'clipboardData',
            path: 'device/clipboardData/index',
          },
          {
            label: '获取手机网络状态',
            name: 'getNetworkType',
            path: 'device/getNetworkType/index',
          },
          {
            label: '监听手机网络变化',
            name: 'onNetworkStatusChange',
            path: 'device/onNetworkStatusChange/index',
          },
          {
            label: '获取设备电量状态',
            name: 'getBatteryInfo',
            path: 'device/getBatteryInfo/index',
          },
          {
            label: '屏幕亮度',
            name: 'screenBrightness',
            path: 'device/screenBrightness/index',
          },
          {
            label: '设置保持常亮状态',
            name: 'setKeepScreenOn',
            path: 'device/setKeepScreenOn/index',
          },
          {
            label: '监听罗盘数据',
            name: 'compassChange',
            path: 'device/compassChange/index',
          },
          {
            label: '重力感应',
            name: 'accelerometerChange',
            path: 'device/accelerometerChange/index',
          },
          {
            label: '监听设备方向',
            name: 'deviceMotionChange',
            path: 'device/deviceMotionChange/index',
          },
          {
            label: '监听陀螺仪数据',
            name: 'gyroscopeChange',
            path: 'device/gyroscopeChange/index',
          },
          {
            label: '横竖屏切换',
            name: 'deviceOrientationChange',
            path: 'device/deviceOrientationChange/index',
          },
        ],
      },
      {
        label: '文件',
        name: 'file',
        children: [
          {
            label: '创建/删除目录',
            name: 'dir',
            path: 'file/dir/index',
          },
          {
            label: '判断文件/目录是否存在',
            name: 'access',
            path: 'file/access/index',
          },
          {
            label: '重命名',
            name: 'rename',
            path: 'file/rename/index',
          },
          {
            label: '保存临时文件到本地',
            name: 'saveFile',
            path: 'file/saveFile/index',
          },
          {
            label: '查看目录内容',
            name: 'readdir',
            path: 'file/readdir/index',
          },
          {
            label: '操作文件',
            name: 'operationFile',
            path: 'file/operationFile/index',
          },
          {
            label: '获取文件信息',
            name: 'getFileInfo',
            path: 'file/getFileInfo/index',
          },
          {
            label: '判断文件路径是否是目录',
            name: 'stat',
            path: 'file/stat/index',
          },
          {
            label: '解压文件',
            name: 'unzip',
            path: 'file/unzip/index',
          },
          {
            label: '本地缓存文件',
            name: 'savedFile',
            path: 'file/savedFile/index',
          },
        ],
      },

      // ========== 开放能力 ==========
      {
        label: '开放接口',
        name: 'open-api',
        children: [
          {
            label: '微信登录',
            name: 'login',
            path: 'open-api/login/index',
          },
          {
            label: '获取用户信息',
            name: 'getUserInfo',
            path: 'open-api/getUserInfo/index',
          },
          {
            label: '开放数据域',
            name: 'openDataContext',
            path: 'open-api/openDataContext/index',
          },
          {
            label: '关系链互动',
            name: 'relationalChaininteractiveData',
            path: 'open-api/relationalChaininteractiveData/index',
          },
          {
            label: '定向分享',
            name: 'directedSharing',
            path: 'open-api/directedSharing/index',
          },
          {
            label: '一次性订阅',
            name: 'requestSubscribeMessage',
            path: 'open-api/requestSubscribeMessage/index',
          },
          {
            label: '永久订阅',
            name: 'requestSubscribeSystemMessage',
            path: 'open-api/requestSubscribeSystemMessage/index',
          },
          {
            label: '对局匹配',
            name: 'matchedPattern',
            path: 'open-api/matchedPattern/index',
          },
          {
            label: '实时语音',
            name: 'VoIPChat',
            path: 'open-api/VoIPChat/index',
          },
          {
            label: 'PC接力',
            name: 'startHandoff',
            path: 'open-api/startHandoff/index',
          },
          {
            label: '二维码',
            name: 'appletCode',
            path: 'open-api/appletCode/index',
          },
          {
            label: 'UnionID',
            name: 'UnionID',
            path: 'open-api/UnionID/index',
          },
          {
            label: '游戏圈',
            name: 'createGameClubButton',
            path: 'open-api/createGameClubButton/index',
          },
          {
            label: '客服服务',
            name: 'customerService',
            path: 'open-api/customerService/index',
          },
          {
            label: '设置',
            name: 'setting',
            path: 'open-api/setting/index',
          },
        ],
      },
      {
        label: '虚拟支付',
        name: 'pay',
        children: [
          // 待补充：商户号支付、蓝包等
        ],
      },

      // ========== 游戏能力 ==========
      {
        label: '游戏对局回放',
        name: 'game-recorder',
        children: [
          {
            label: '游戏对局回放',
            name: 'getGameRecorder',
            path: 'game-recorder/getGameRecorder/index',
          },
        ],
      },
      {
        label: '游戏服务',
        name: 'game-server',
        children: [
          {
            label: '好友对战（帧同步）',
            name: 'getGameServerManager',
            path() {
              // gitHub地址 https://github.com/wechat-miniprogram/minigame-lockstep-demo
              wx.navigateToMiniProgram({ appId: 'wx4f4a4549a1069d03' });
            },
          },
        ],
      },

      // ========== 广告与推荐 ==========
      {
        label: '广告',
        name: 'ad',
        children: [
          {
            label: 'banner 广告',
            name: 'createBannerAd',
            path: 'ad/createBannerAd/index',
          },
          {
            label: 'grid 广告',
            name: 'createGridAd',
            path: 'ad/createGridAd/index',
          },
          {
            label: '激励视频广告',
            name: 'createRewardedVideoAd',
            path: 'ad/createRewardedVideoAd/index',
          },
          {
            label: '插屏广告',
            name: 'createInterstitialAd',
            path: 'ad/createInterstitialAd/index',
          },
        ],
      },
      {
        label: '推荐',
        name: 'recommend',
        children: [
          {
            label: 'Banner 推荐',
            name: 'createGameBanner',
            path: 'recommend/createGameBanner/index',
          },
          {
            label: 'Icon 推荐',
            name: 'createGameIcon',
            path: 'recommend/createGameIcon/index',
          },
          {
            label: 'Portal 推荐',
            name: 'createGamePortal',
            path: 'recommend/createGamePortal/index',
          },
        ],
      },

      // ========== 工具与高级 ==========
      {
        label: '工具',
        name: 'util',
        children: [
          // 待补充：编码/解码等
        ],
      },
      {
        label: 'Worker',
        name: 'worker',
        path: 'worker/index',
      },
      {
        label: 'WASM',
        name: 'wasm',
        children: [
          // 待补充：WebAssembly 相关
        ],
      },
      {
        label: '聊天工具',
        name: 'chat-tool',
        children: [
          {
            label: '群活动',
            name: 'groupTask',
            path: 'chat-tool/groupTask/index',
            children: [
              {
                label: '创建群活动',
                name: 'createGroupTask',
                path: 'chat-tool/groupTask/createGroupTask/index',
              },
              {
                label: '群活动详情',
                name: 'groupTaskDetail',
                path: 'chat-tool/groupTask/groupTaskDetail/index',
              },
            ],
          },
        ],
      },
      {
        label: 'AI',
        name: 'ai',
        children: [
          {
            label: 'VisionKit基础',
            name: 'visionkit-basic',
            path: 'ai/visionkit-basic/index',
          },
          {
            label: 'VisionKit基础-v2',
            name: 'visionkit-basic-v2',
            path: 'ai/visionkit-basic-v2/index',
          },
          {
            label: '水平面AR',
            name: 'plane-ar',
            path: 'ai/plane-ar/index',
          },
          {
            label: '人脸识别',
            name: 'face-detect',
            path: 'ai/face-detect/index',
          },
        ],
      },

      // ========== 服务端 & 性能 ==========
      {
        label: '服务端API',
        name: 'server',
        children: [
          // 待补充：内容安全、二维码生成等
        ],
      },
      {
        label: '性能',
        name: 'perf',
        children: [
          // 待补充：性能相关
        ],
      },
    ],
  },
];

const renderPage = require('../libs/page-renderer');

/**
 * 加载页面模块，兼容两种格式：
 * 1. 旧模式：module.exports = function(PIXI, app, obj) { return container }
 * 2. 新模式：纯 export 函数，自动用 page-renderer 包装
 */
function loadPageModule(mod, PIXI, app, params, pageLabel?, children?) {
  if (typeof mod === 'function') {
    // 旧模式：直接调用
    return mod(PIXI, app, params, children);
  }
  // 新模式：纯 export 函数，传 label 作为页面标题
  return renderPage(PIXI, app, params, mod, pageLabel);
}

function router(PIXI, app, parameter) {
  let treePage = {};
  function regroup(circularArr) {
    circularArr = circularArr.slice(0);
    while (circularArr.length) {
      let page = circularArr.shift();
      parameter = { ...parameter, name: page.name, isTabBar: !!page.tabBar };
      page.path &&
        (treePage[page.name] = {
          label: page.label,
          path: page.path,
          parameter,
        });
      (page.children || []).length &&
        circularArr.unshift(...page.children.slice(0));
    }
  }
  regroup(signIn);

  for (let i = 0, len = signIn.length; i < len; i++) {
    let name = signIn[i].name;
    let mod = require(treePage[name].path);
    treePage[name].page = loadPageModule(
      mod,
      PIXI,
      app,
      treePage[name].parameter,
      treePage[name].label,
      signIn[i].children
    );
    treePage[name].init = true;
  }

  window.router = new (function () {
    this.treeView = ['APIentry'];
    this.navigateTo = function (newPage, query, res) {
      let lastOne = this.treeView.length - 1,
        name = this.treeView[lastOne];
      if (name === newPage) return;

      if (typeof treePage[newPage].path === 'function')
        return treePage[newPage].path();

      this.treeView.push(newPage);
      treePage[newPage].reload && treePage[newPage].reload();

      try {
        if (!treePage[newPage].init) {
          console.warn('!!! newPage', newPage, treePage[newPage].path);
          let mod = require(treePage[newPage].path);
          treePage[newPage].page = loadPageModule(mod, PIXI, app, {
            ...treePage[newPage].parameter,
            ...query,
            ...res,
          }, treePage[newPage].label);
          treePage[newPage].init = true;
        }

        treePage[name].page.visible = false;
        treePage[newPage].page.visible = true;
      } catch (e) {
        console.error('!!! 功能错误:', e);
        this.treeView.pop();
        wx.showModal({
          content: '你的微信版本过低，无法演示该功能！',
          showCancel: false,
          confirmColor: '#02BB00',
        });
      }
    };
    this.navigateBack = function () {
      if (this.treeView.length < 2) return;

      if (!treePage[this.getNowPageName()].reload) {
        this.delPage();
        treePage[this.getNowPageName()].reload?.();
        return;
      }

      treePage[this.treeView.pop()].page.visible = false;
      treePage[this.getNowPageName()].page.visible = true;
    };
    this.delPage = function () {
      if (this.treeView.length < 2) return;
      let name = this.treeView.pop();
      treePage[name].page.visible = false;
      app.stage.removeChild(treePage[name].page).destroy(true);
      treePage[name].page = null;
      treePage[name].init = false;
      treePage[this.getNowPageName()].page.visible = true;
    };
    this.getNowPageName = function () {
      return this.treeView[this.treeView.length - 1];
    };
    this.getNowPageLabel = function () {
      return treePage[this.treeView[this.treeView.length - 1]].label;
    };
    this.getNowPage = function (callBack) {
      callBack(treePage[this.treeView[this.treeView.length - 1]]);
    };
  })();
}
module.exports = router;
