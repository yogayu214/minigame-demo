/**
 * 统一 AR 渲染器
 *
 * 从旧版 minigame-demo AR/common/behavior + yuvBehavior + detectBoxBehavior + 各模块 renderComponent 合并而来。
 * 使用独立的离屏 WebGL Canvas 进行 Three.js + YUV + 人脸检测框渲染，
 * 然后通过 PIXI.Texture.fromCanvas() 将结果展示到 PIXI 舞台（避免与 PIXI 的 WebGL context 冲突）。
 *
 * 三种模式：
 *   - 'default'     : hitTest 点击位置放置 3D 模型（visionkit-basic/v2）
 *   - 'planeAR'     : reticle 光标 + hitTest 放置模型（plane-ar）
 *   - 'faceDetect'  : 人脸检测框绿点/红框渲染（face-detect）
 */

// gltf-clone 和 gltf-loader 是 TypeScript 模块，通过 import 引入（确保被 TS 编译器包含在分包中）
// threejs-miniprogram 是 vendor 目录下的 CommonJS JS 文件，在 initTHREE() 中延迟 require
import cloneGltf from '../loaders/gltf-clone';
import { registerGLTFLoader } from '../loaders/gltf-loader';

// ============== 着色器源码 ==============

// 人脸关键点顶点着色器（绿色圆点）
const VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main(){\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 4.0;\n' +
  '}\n';

// 人脸关键点片元着色器（绿色圆点）
const FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  ' precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main(){\n' +
  '  float d = distance(gl_PointCoord, vec2(0.5, 0.5));\n' +
  '  if(d < 0.5) {\n' +
  '    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' +
  '  } else { discard; }\n' +
  '}\n';

// 人脸边框顶点着色器（红色矩形）
const EDGE_VSHADER_SOURCE = `
attribute vec2 aPosition;
varying vec2 posJudge;
void main(void) {
  gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
  posJudge = aPosition;
}
`;

// 人脸边框片元着色器（红色矩形）
const EDGE_FSHADER_SOURCE = `
precision highp float;
uniform vec2 rightTopPoint;
uniform vec2 centerPoint;
varying vec2 posJudge;
float box(float x, float y){
  float xc = x - centerPoint.x;
  float yc = y - centerPoint.y;
  vec2 point = vec2(xc, yc);
  float right = rightTopPoint.x;
  float top =  rightTopPoint.y;
  float line_width = 0.01;
  vec2 b1 = 1.0 - step(vec2(right,top), abs(point));
  float outer = b1.x * b1.y;
  vec2 b2 = 1.0 - step(vec2(right-line_width,top-line_width), abs(point));
  float inner = b2.x * b2.y;
  return outer - inner;
}
void main(void) {
  if(box(posJudge.x, posJudge.y) == 0.0 ) discard;
  gl_FragColor = vec4(box(posJudge.x, posJudge.y), 0.0, 0.0, 1.0);
}
`;

// YUV → RGB 着色器源码
const YUV_VS = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  uniform mat3 displayTransform;
  varying vec2 v_texCoord;
  void main() {
    vec3 p = displayTransform * vec3(a_position, 0);
    gl_Position = vec4(p, 1);
    v_texCoord = a_texCoord;
  }
`;

const YUV_FS = `
  precision highp float;
  uniform sampler2D y_texture;
  uniform sampler2D uv_texture;
  varying vec2 v_texCoord;
  void main() {
    vec4 y_color = texture2D(y_texture, v_texCoord);
    vec4 uv_color = texture2D(uv_texture, v_texCoord);
    float Y, U, V;
    float R, G, B;
    Y = y_color.r;
    U = uv_color.r - 0.5;
    V = uv_color.a - 0.5;
    R = Y + 1.402 * V;
    G = Y - 0.344 * U - 0.714 * V;
    B = Y + 1.772 * U;
    gl_FragColor = vec4(R, G, B, 1.0);
  }
`;

// ============== 类型定义 ==============

export type ARMode = 'default' | 'planeAR' | 'faceDetect';

export interface ARConfig {
  track: { plane?: { mode: number }; face?: { mode: number } };
  cameraPosition?: number;
  version: string;
  gl?: any;
}

export interface ARRendererOptions {
  mode: ARMode;
  config: ARConfig;
  width: number;
  height: number;
  screenTop?: number;
  screenBottom?: number;
  onTouchEnd?: (x: number, y: number) => void;
}

// ============== ARRenderer 类 ==============

export class ARRenderer {
  // Three.js 相关
  THREE: any = null;
  canvas: any = null;
  gl: any = null;
  renderer: any = null;
  scene: any = null;
  camera: any = null;
  model: any = null;
  reticle: any = null;
  mixers: any[] | null = null;
  clock: any = null;
  _insertModels: any[] = [];

  // VKSession 相关
  session: any = null;
  anchor2DList: any[] = [];

  // 渲染参数
  data: {
    width: number;
    height: number;
    fps: number;
    screenTop: number;
    screenBottom: number;
    anchor2DList: any[];
    initShadersDone: boolean;
  } = {
    width: 1,
    height: 1,
    fps: 0,
    screenTop: -1,
    screenBottom: 1,
    anchor2DList: [],
    initShadersDone: false,
  };

  // 模式
  mode: ARMode = 'default';
  config: ARConfig;
  options: ARRendererOptions;

  // YUV Shader 相关
  _program: any = null;
  _vao: any = null;
  _ext: any = null;
  _dt: any = null;

  // 人脸检测框 Shader 相关
  vertexProgram: any = null;
  rectEdgeProgram: any = null;

  // 离屏 Canvas（用于 Three.js 渲染）
  offScreenCanvas: any = null;

  // 回调
  onTouchEndCallback: ((x: number, y: number) => void) | null = null;

  // 渲染循环标志
  private disposed = false;

  // VKSession 错误信息（环境不支持时设置）
  vkError: string | null = null;

  constructor(options: ARRendererOptions) {
    this.options = options;
    this.mode = options.mode;
    this.config = options.config;
    this.data.width = options.width;
    this.data.height = options.height;
    this.data.screenTop = options.screenTop ?? -1;
    this.data.screenBottom = options.screenBottom ?? 1;
    this.onTouchEndCallback = options.onTouchEnd ?? null;
  }

  setData(args: Record<string, any>) {
    for (const k in args) {
      (this.data as any)[k] = args[k];
    }
  }

  /**
   * 初始化 AR 渲染器
   * 创建离屏 WebGL Canvas → Three.js 场景 → VKSession
   */
  /**
   * 初始化 AR 渲染器
   * 创建离屏 WebGL Canvas → Three.js 场景 → VKSession
   *
   * 对齐旧版 behavior.js 架构：
   *   - offScreenCanvas: wx.createCanvas() + getContext("webgl") → 给 Three.js 用
   *   - 主 canvas (app.view) 的 2D context: 用于 drawImage 合成（由外部 aiAr.ts 处理）
   */
  init() {
    console.log('[AR] init 开始');
    try {
      // 创建独立的离屏 WebGL Canvas（与 PIXI 的 canvas 隔离）
      this.offScreenCanvas = (wx as any).createCanvas();
      console.log('[AR] offScreenCanvas 创建成功:', !!this.offScreenCanvas);
      this.offScreenCanvas.width = this.data.width;
      this.offScreenCanvas.height = this.data.height;

      // 关键：显式获取 WebGL context（对齐旧版 behavior.js 第 190 行）
      const webglCtx = this.offScreenCanvas.getContext('webgl') || this.offScreenCanvas.getContext('experimental-webgl');
      if (!webglCtx) {
        throw new Error('无法获取 WebGL context，设备可能不支持 WebGL');
      }
      console.log('[AR] WebGL context 获取成功');
      this.canvas = this.offScreenCanvas;
      this.gl = webglCtx; // 预先保存 gl 引用

      // 初始化 Three.js
      console.log('[AR] 开始 initTHREE');
      this.initTHREE();
      console.log('[AR] initTHREE 完成');

      // 初始化 GLSL（YUV + 人脸检测框）
      console.log('[AR] 开始 initGL');
      this.initGL();
      console.log('[AR] initGL 完成');

      // 初始化 VKSession
      console.log('[AR] 开始 initVK');
      this.initVK(this.config);
      console.log('[AR] initVK 完成, vkError=', this.vkError);

      // 请求相机权限
      (wx as any).authorize({
        scope: 'scope.camera',
        success: (res: any) => console.log('相机授权成功:', res),
        fail: (err: any) => console.log('相机授权失败:', err),
      });
    } catch (e) {
      console.error('[AR] init 过程中抛出异常:', e);
      throw e; // 向上抛出，由 aiAr.ts 的 catch 接收
    }
  }

  private initTHREE() {
    // 延迟加载 Three.js 和 GLTF Loader（避免模块加载时即失败）
    // threejs-miniprogram 是 vendor 目录下的 CommonJS JS 文件，在主包中，运行时 require
    const { createScopedThreejs } = require('../../../vendor/threejs-miniprogram/index');
    // registerGLTFLoader 已在文件顶部通过 import 引入

    const THREE = (this.THREE = createScopedThreejs(this.canvas));
    registerGLTFLoader(THREE);

    // 相机
    this.camera = new THREE.Camera();

    // 场景
    const scene = (this.scene = new THREE.Scene());

    // 光源
    const light1 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light1.position.set(0, 0.2, 0);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0, 0.2, 0.1);
    scene.add(light2);

    // 渲染层（使用离屏 Canvas，WebGL context 已在 init() 中获取）
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.offScreenCanvas,
    }));
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    // 使用已有的 gl 引用（init() 中通过 getContext("webgl") 获取）
    // Three.js 的 getContext() 应该返回同一个 WebGL context
    if (!this.gl) {
      this.gl = renderer.getContext();
    }
    this.gl.disable(this.gl.CULL_FACE);

    this.clock = new THREE.Clock();
  }

  private initVK(config: ARConfig) {
    // 检查 VKSession API 是否存在
    if (typeof (wx as any).createVKSession !== 'function') {
      console.warn('当前环境不支持 wx.createVKSession');
      this.vkError = '当前环境不支持 createVKSession\n请在真机上运行';
      return;
    }

    config.gl = this.gl;
    const session = (this.session = (wx as any).createVKSession(config));

    session.start((err: any) => {
      if (err) return console.error('VK error: ', err);
      console.log('VKSession.version', session.version);

      // 加载机器人模型
      const loader = new this.THREE.GLTFLoader();
      loader.load(
        'https://dldir1.qq.com/weixin/miniprogram/RobotExpressive_aa2603d917384b68bb4a086f32dabe83.glb',
        (gltf: any) => {
          this.model = {
            scene: gltf.scene,
            animations: gltf.animations,
          };
        }
      );

      // planeAR 模式加载 reticle 光标
      if (this.mode === 'planeAR') {
        loader.load(
          'https://dldir1.qq.com/weixin/miniprogram/reticle_4b6cc19698ca4a08b31fd3c95ce412ec.glb',
          (gltf: any) => {
            const reticle = (this.reticle = gltf.scene);
            reticle.visible = false;
            this.scene.add(reticle);
          }
        );
      }

      // faceDetect 模式监听人脸锚点
      if (this.mode === 'faceDetect') {
        session.on('addAnchors', (anchors: any[]) => {
          this.data.anchor2DList = anchors.map((anchor) => ({
            points: anchor.points,
            origin: anchor.origin,
            size: anchor.size,
          }));
        });
        session.on('updateAnchors', (anchors: any[]) => {
          this.data.anchor2DList = [];
          this.data.anchor2DList = this.data.anchor2DList.concat(
            anchors.map((anchor) => ({
              points: anchor.points,
              origin: anchor.origin,
              size: anchor.size,
            }))
          );
        });
        session.on('removeAnchors', () => {
          this.data.anchor2DList = [];
        });
      }

      // 逐帧渲染
      const onFrame = (_timestamp: number) => {
        if (this.disposed) return;
        const frame = this.session.getVKFrame(this.data.width, this.data.height);
        if (frame) {
          this.renderFrame(frame);
        }
        this.session.requestAnimationFrame(onFrame);
      };
      this.session.requestAnimationFrame(onFrame);
    });
  }

  // ============== YUV 相机背景渲染 ==============

  private initShader() {
    const gl = this.gl;
    const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, YUV_VS);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, YUV_FS);
    gl.compileShader(fragShader);

    const program = (this._program = gl.createProgram());
    this._program.gl = gl;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const uniformYTexture = gl.getUniformLocation(program, 'y_texture');
    gl.uniform1i(uniformYTexture, 5);
    const uniformUVTexture = gl.getUniformLocation(program, 'uv_texture');
    gl.uniform1i(uniformUVTexture, 6);

    this._dt = gl.getUniformLocation(program, 'displayTransform');
    gl.useProgram(currentProgram);
  }

  private initVAO() {
    const gl = this.gl;
    const ext = gl.getExtension('OES_vertex_array_object');
    this._ext = ext;

    const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
    const vao = ext.createVertexArrayOES();
    ext.bindVertexArrayOES(vao);

    const posAttr = gl.getAttribLocation(this._program, 'a_position');
    const pos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);

    const y1 = this.data.screenTop;
    const y2 = this.data.screenBottom;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([y2, 1, y1, 1, y2, -1, y1, -1]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttr);
    vao.posBuffer = pos;

    const texcoordAttr = gl.getAttribLocation(this._program, 'a_texCoord');
    const texcoord = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texcoordAttr);
    vao.texcoordBuffer = texcoord;

    ext.bindVertexArrayOES(currentVAO);
    this._vao = vao;
  }

  private initGL() {
    this.initShader();
    this.initVAO();
  }

  private renderGL(frame: any) {
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    const { yTexture, uvTexture } = frame.getCameraTexture(gl, 'yuv');
    const displayTransform = frame.getDisplayTransform();
    if (yTexture && uvTexture) {
      const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
      const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
      const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);

      gl.useProgram(this._program);
      this._ext.bindVertexArrayOES(this._vao);

      gl.uniformMatrix3fv(this._dt, false, displayTransform);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

      gl.activeTexture(gl.TEXTURE0 + 5);
      const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D);
      gl.bindTexture(gl.TEXTURE_2D, yTexture);

      gl.activeTexture(gl.TEXTURE0 + 6);
      const bindingTexture6 = gl.getParameter(gl.TEXTURE_BINDING_2D);
      gl.bindTexture(gl.TEXTURE_2D, uvTexture);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindTexture(gl.TEXTURE_2D, bindingTexture6);
      gl.activeTexture(gl.TEXTURE0 + 5);
      gl.bindTexture(gl.TEXTURE_2D, bindingTexture5);

      gl.useProgram(currentProgram);
      gl.activeTexture(currentActiveTexture);
      this._ext.bindVertexArrayOES(currentVAO);
    }
  }

  // ============== 人脸检测框渲染 ==============

  private loadShader(gl: any, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      console.log('编译着色器失败: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private initShaders(gl: any, vsSource: string, fsSource: string) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      console.log('程序对象连接失败: ' + gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    this.setData({ initShadersDone: true });
    return program;
  }

  private initVertexBuffers(gl: any, anchor2DList: any[]) {
    const flattenPoints: number[] = [];
    anchor2DList.forEach((anchor) => {
      anchor.points.forEach((point: any) => {
        const { x, y } = point;
        flattenPoints.push(x * 2 - 1, 1 - y * 2);
      });
    });
    const vertices = new Float32Array(flattenPoints);
    const n = flattenPoints.length / 2;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
  }

  private initRectEdgeBuffer(
    gl: any,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const shaderProgram = gl.program;
    const centerX = x * 2 - 1 + width;
    const centerY = -1 * (y * 2 - 1) - height;
    const right = width;
    const top = height;
    const vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    const rightTopLoc = gl.getUniformLocation(shaderProgram, 'rightTopPoint');
    gl.uniform2fv(rightTopLoc, [right, top]);
    const centerPointLoc = gl.getUniformLocation(
      shaderProgram,
      'centerPoint'
    );
    gl.uniform2fv(centerPointLoc, [centerX, centerY]);
    return vertices.length / 2;
  }

  private onDrawRectEdge(
    gl: any,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    width = Math.round(width * 100) / 100;
    height = Math.round(height * 100) / 100;
    const n = this.initRectEdgeBuffer(gl, x, y, width, height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }

  // ============== Reticle 光标 ==============

  private renderReticle() {
    const reticle = this.reticle;
    if (reticle) {
      const hitTestRes = this.session.hitTest(0.5, 0.5);
      if (hitTestRes.length) {
        reticle.matrixAutoUpdate = false;
        reticle.matrix.fromArray(hitTestRes[0].transform);
        reticle.matrix.decompose(
          reticle.position,
          reticle.quaternion,
          reticle.scale
        );
        reticle.visible = true;
      } else {
        reticle.visible = false;
      }
    }
  }

  // ============== 动画更新 ==============

  private updateAnimation() {
    const dt = this.clock.getDelta();
    if (this.mixers) this.mixers.forEach((mixer) => mixer.update(dt));
  }

  // ============== 模型克隆 ==============

  private copyRobot() {
    const THREE = this.THREE;
    const { scene, animations } = cloneGltf(this.model, THREE);
    scene.scale.set(0.05, 0.05, 0.05);

    const mixer = new THREE.AnimationMixer(scene);
    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      if (clip.name === 'Dance') {
        const action = mixer.clipAction(clip);
        action.play();
      }
    }

    this.mixers = this.mixers || [];
    this.mixers.push(mixer);
    scene._mixer = mixer;
    return scene;
  }

  private getRobot() {
    const THREE = this.THREE;
    const model = new THREE.Object3D();
    model.add(this.copyRobot());

    this._insertModels = this._insertModels || [];
    this._insertModels.push(model);

    // 限制最多 5 个模型
    if (this._insertModels.length > 5) {
      const needRemove = this._insertModels.splice(
        0,
        this._insertModels.length - 5
      );
      needRemove.forEach((item: any) => {
        if (item._mixer) {
          const mixer = item._mixer;
          this.mixers!.splice(this.mixers!.indexOf(mixer), 1);
          mixer.uncacheRoot(mixer.getRoot());
        }
        if (item.parent) item.parent.remove(item);
      });
    }
    return model;
  }

  // ============== 触摸交互 ==============

  onTouchEnd(x: number, y: number) {
    if (this.mode === 'faceDetect') {
      return;
    } else if (this.mode === 'planeAR') {
      if (this.scene && this.model && this.reticle) {
        const model = this.getRobot();
        model.position.copy(this.reticle.position);
        model.rotation.copy(this.reticle.rotation);
        this.scene.add(model);
      }
    } else {
      // default 模式：hitTest 点击位置放置机器人
      if (this.session && this.scene && this.model) {
        const hitTestRes = this.session.hitTest(
          x / this.data.width,
          y / this.data.height,
          this.resetPanel
        );
        this.resetPanel = false;
        if (hitTestRes.length) {
          const model = this.getRobot();
          model.matrixAutoUpdate = false;
          model.matrix.fromArray(hitTestRes[0].transform);
          this.scene.add(model);
        }
      }
    }
  }

  private resetPanel = false;

  // ============== 主渲染循环 ==============

  private renderFrame(frame: any) {
    const NEAR = 0.001;
    const FAR = 1000;

    // 1. 渲染 YUV 相机背景
    this.renderGL(frame);

    // 2. planeAR 模式更新 reticle 光标
    if (this.mode === 'planeAR') {
      this.renderReticle();
    }

    // 3. 更新动画
    this.updateAnimation();

    // 4. 更新相机矩阵
    const camera = frame.camera;
    if (camera) {
      this.camera.matrixAutoUpdate = false;
      this.camera.matrixWorldInverse.fromArray(camera.viewMatrix);
      this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse);
      const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR);
      this.camera.projectionMatrix.fromArray(projectionMatrix);
      this.camera.projectionMatrixInverse.getInverse(
        this.camera.projectionMatrix
      );
    }

    // 5. Three.js 3D 渲染（不清除颜色缓冲，保留 YUV 背景）
    this.renderer.autoClearColor = false;
    this.renderer.render(this.scene, this.camera);
    this.renderer.state.setCullFace(this.THREE.CullFaceNone);
    this.renderer.state.reset();

    // 6. faceDetect 模式渲染人脸检测框
    if (this.mode === 'faceDetect') {
      const gl = this.gl;
      const anchor2DList = this.data.anchor2DList;
      if (anchor2DList && anchor2DList.length > 0) {
        if (!this.data.initShadersDone) {
          this.vertexProgram = this.initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
          this.rectEdgeProgram = this.initShaders(
            gl,
            EDGE_VSHADER_SOURCE,
            EDGE_FSHADER_SOURCE
          );
          if (!this.vertexProgram || !this.rectEdgeProgram) {
            console.log('初始化着色器失败');
            return;
          }
          console.log('初始化着色器成功');
        }

        // 绘制绿色关键点
        gl.useProgram(this.vertexProgram);
        gl.program = this.vertexProgram;
        const n = this.initVertexBuffers(gl, anchor2DList);
        gl.drawArrays(gl.POINTS, 0, n);

        // 绘制红色边框
        gl.useProgram(this.rectEdgeProgram);
        gl.program = this.rectEdgeProgram;
        for (let i = 0; i < anchor2DList.length; i++) {
          this.onDrawRectEdge(
            gl,
            anchor2DList[i].origin.x,
            anchor2DList[i].origin.y,
            anchor2DList[i].size.width,
            anchor2DList[i].size.height
          );
        }
      }
    }
  }

  // ============== 切换摄像头 ==============

  switchCamera() {
    if (this.config.cameraPosition === 0) {
      this.config.cameraPosition = 1;
    } else {
      this.config.cameraPosition = 0;
    }
    if (this.session) {
      this.session.config = this.config;
    }
  }

  // ============== 获取渲染 Canvas ==============

  getCanvas() {
    return this.offScreenCanvas;
  }

  // ============== 资源销毁 ==============

  dispose() {
    this.disposed = true;

    if (this.session) {
      try {
        this.session.stop();
        this.session.destroy();
      } catch (_e) {
        /* noop */
      }
      this.session = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    if (this.scene) {
      this.scene.dispose();
      this.scene = null;
    }
    this.camera = null;
    this.model = null;
    this.reticle = null;
    this._insertModels = [];
    if (this.mixers) {
      this.mixers.forEach((mixer) => mixer.uncacheRoot(mixer.getRoot()));
      this.mixers = null;
    }
    this.clock = null;
    this.THREE = null;
    this.canvas = null;
    this.gl = null;
    this.anchor2DList = [];
  }
}
