/**
 * 视频解码器
 * wx.createVideoDecoder
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/video-decoder/wx.createVideoDecoder.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const SRC =
  'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/video.mp4';
let decoder: any = null;
let frameCanvas: any = null;

/** 创建解码器并开始解码 */
export function createDecoder() {
  if (decoder) {
    decoder.remove?.();
    decoder = null;
  }
  if (typeof wx.createVideoDecoder !== 'function') {
    display.text('当前环境不支持视频解码器');
    return;
  }
  decoder = wx.createVideoDecoder();
  decoder.on?.('start', () => {
    display.text('解码已开始，可点击「读取帧」查看画面');
  });
  decoder.on?.('seek', () => display.text('seek 完成'));
  decoder.on?.('stop', () => display.text('解码停止'));
  decoder.on?.('ended', () => display.text('解码结束'));
  decoder.on?.('error', (err: any) =>
    display.text(`解码错误: ${err?.errMsg || '未知'}`)
  );
  decoder.start?.({ source: SRC, mode: 0 });
}

/** 读取一帧并展示 */
export function getFrame() {
  if (!decoder) {
    display.text('请先创建解码器');
    return;
  }
  const frame = decoder.getFrameData?.();
  if (!frame || !frame.data) {
    display.text('暂无帧数据，请稍后再试');
    return;
  }

  const info = formatObj({
    宽度: frame.width,
    高度: frame.height,
    pts: frame.pts,
    数据大小: `${frame.data.byteLength} B`,
  });

  // 将帧数据绘制到 canvas 并通过 display.image 展示
  try {
    // 复用 canvas 实例，避免反复创建
    if (!frameCanvas) {
      frameCanvas = wx.createCanvas();
    }
    const c = frameCanvas;
    c.width = frame.width;
    c.height = frame.height;
    const ctx = c.getContext('2d');
    const imageData = (wx as any).createImageData
      ? (wx as any).createImageData(frame.width, frame.height)
      : ctx.createImageData(frame.width, frame.height);
    // frame.data 是 ArrayBuffer，复制到 ImageData
    const src = new Uint8Array(frame.data);
    const dst = imageData.data;
    for (let i = 0; i < dst.length && i < src.length; i++) {
      dst[i] = src[i];
    }
    ctx.putImageData(imageData, 0, 0);

    c.toTempFilePath({
      fileType: 'png',
      quality: 1,
      success(res: any) {
        display.image(res.tempFilePath);
      },
      fail(err: any) {
        console.error('[videoDecoder] toTempFilePath fail', err);
        display.text(info + `\n截图失败: ${err?.errMsg || '未知'}`);
      },
    });
  } catch (e: any) {
    console.error('[videoDecoder] draw fail', e);
    display.text(info + `\n绘制失败: ${e?.message || e}`);
  }
}

/** seek 到 2 秒 */
export function seek2s() {
  if (!decoder) {
    display.text('请先创建解码器');
    return;
  }
  decoder.seek?.(2000);
  display.text('已 seek 到 2 秒');
}

/** 停止解码 */
export function stop() {
  if (!decoder) {
    display.text('请先创建解码器');
    return;
  }
  decoder.stop?.();
  display.text('已停止解码');
}

/** 销毁解码器 */
export function destroyAll() {
  if (decoder) {
    decoder.remove?.();
    decoder = null;
  }
  frameCanvas = null;
  display.text('已销毁解码器');
}

export function onUnload() {
  destroyAll();
}
