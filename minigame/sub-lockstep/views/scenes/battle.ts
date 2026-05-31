// @ts-nocheck
/**
 * Battle 场景 - 视图层
 *
 * 职责：
 * 1. 渲染游戏元素（玩家飞机、子弹、血条、摇杆、技能按钮）
 * 2. 把玩家输入（摇杆/射击按钮）转发给 ../../logic/battle.js
 * 3. 实现 renderUpdate / logicUpdate / preditUpdate，由 gameserver 驱动
 * 4. 把 server 下发的玩家指令（action）映射到本地 Player 对象的方法
 *
 * ★ 不直接调 gameServer.uploadFrame 等 API，所有 API 走 logic 层
 */

import PIXI from '../../pixi-ref';
import config from '../../config';
import databus from '../../databus';
import { createBtn, createText } from '../../common/ui';
import { checkCircleCollision } from '../../common/util';

import JoyStick from '../components/joystick';
import Player from '../components/player';
import Skill from '../components/skill';
import Hp from '../components/hp';
import Debug from '../components/debug';

import gameServer from '../../logic/gameserver';
import * as battleLogic from '../../logic/battle';

export default class Battle extends PIXI.Container {
    constructor() {
        super();
    }

    launch() {
        console.log('[lockstep][battle] launch');
        this.debug = new Debug();
        this.addChild(this.debug);

        this.initPlayer();
        console.log('[lockstep][battle] players:', databus.playerList.length, 'selfClientId:', databus.selfClientId);

        // ===== 虚拟摇杆：变化 → logic.sendMoveDirection/Stop =====
        this.joystick = new JoyStick((e) => {
            if (e === -9999) {
                console.log('[lockstep][battle] joystick stop');
                battleLogic.sendMoveStop();
            } else {
                console.log('[lockstep][battle] joystick move, degree:', e.degree);
                battleLogic.sendMoveDirection(e.degree);
            }
        });
        this.addChild(this.joystick);

        // ===== 技能按钮：点击 → logic.sendShoot =====
        this.skill = new Skill();
        this.skill.eventemitter.on('click', () => {
            console.log('[lockstep][battle] shoot');
            battleLogic.sendShoot();
        });
        this.addChild(this.skill);

        this.appendBackBtn();

        // ===== 订阅对方离开事件 =====
        battleLogic.setOnOpponentLeave(() => {
            this.showLeaveModal('对方已离开房间，无法继续进行PK！', true);
        });
        battleLogic.subscribe();

        // ===== 把本场景的 3 个 update 方法注入 gameserver =====
        gameServer.setRenderUpdate((dt) => this.renderUpdate(dt));
        gameServer.setLogicUpdate((dt, frameId) => this.logicUpdate(dt, frameId));
        gameServer.setPreditUpdate((dt) => this.preditUpdate(dt));
        gameServer.setDebugMsgUpdate((msg) => this.debug.updateDebugMsg(msg));
        console.log('[lockstep][battle] gameServer setters injected');

        // ===== 把 server 下发的玩家指令映射到本地 Player 对象 =====
        gameServer.setPlayerAction((obj) => {
            const player = databus.playerMap[obj.n];
            if (!player) return;
            switch (obj.e) {
                case battleLogic.msgType.SHOOT:
                    player.shoot();
                    break;
                case battleLogic.msgType.MOVE_DIRECTION:
                    player.setDestDegree(obj.d);
                    break;
                case battleLogic.msgType.MOVE_STOP:
                    player.setSpeed(0);
                    player.desDegree = player.frameDegree;
                    break;
            }
        });
    }

    appendBackBtn() {
        const back = createBtn({
            img: 'sub-lockstep/images/goBack.png',
            x: 104,
            y: 68,
            onclick: () => this.showLeaveModal('离开房间会游戏结束！你确定吗？'),
        });
        this.addChild(back);
    }

    showLeaveModal(content, isCancel) {
        battleLogic.confirmLeaveGame(content, isCancel);
    }

    initPlayer() {
        const memberList = gameServer.roomInfo.memberList || [];

        memberList.forEach((member, index) => {
            const { role, clientId, nickname, isReady } = member;

            const player = new Player();
            player.setData(member);
            databus.playerMap[clientId] = player;
            databus.playerList.push(player);
            this.addChild(player);

            const hp = new Hp({ width: 231, height: 22, hp: config.playerHp });
            this.addChild(hp);
            player.hpRender = hp;

            player.y = config.GAME_HEIGHT / 2;
            player.frameY = player.y;

            if (role === config.roleMap.owner || (databus.matchPattern && index)) {
                player.x = player.width / 2;
                player.setDirection(0);
                hp.setPos(330, 56);
                this.createPlayerInformation(hp, nickname, isReady, (name, value) => {
                    value.x = hp.graphics.x - value.width / 2;
                    this.addChild(name, value);
                });
            } else {
                player.x = config.GAME_WIDTH - player.width / 2;
                player.setDirection(180);
                hp.setPos(config.GAME_WIDTH - 231 - 253, 56);
                this.createPlayerInformation(hp, nickname, isReady, (name, value) => {
                    value.x = hp.graphics.x - value.width / 2;
                    name ? this.addChild(name, value) : this.addChild(value);
                });
            }
            player.frameX = player.x;
        });
    }

    createPlayerInformation(hp, nickname, isName, fn) {
        let name, value;
        if (isName) {
            name = createText({
                str: nickname,
                style: { fontSize: 28, align: 'center', fill: '#1D1D1D' },
                left: true,
                x: hp.graphics.x,
                y: 96,
            });
        }
        value = createText({
            str: '生命值：',
            style: { fontSize: 24, fill: '#383838' },
            y: hp.graphics.y + hp.graphics.height / 2,
        });
        fn(name, value);
    }

    // ===== 倒计时 UI =====
    renderCount(count) {
        this.countdownText = createText({
            str: `倒计时${count}秒`,
            x: config.GAME_WIDTH / 2,
            y: 330,
        });
        this.addChild(this.countdownText);
    }

    addCountdown(count) {
        if (this.countdownText) this.removeChild(this.countdownText);
        this.renderCount(count--);
        if (count >= 0) {
            setTimeout(() => this.addCountdown(count), 1000);
        } else {
            setTimeout(() => this.removeChild(this.countdownText), 1000);
        }
    }

    // ===== 三大更新函数（由 gameserver 回调驱动）=====

    renderUpdate(dt) {
        if (databus.gameover) return;
        databus.playerList.forEach(player => player.renderUpdate(dt));
        databus.bullets.forEach(bullet => bullet.renderUpdate(dt));
    }

    logicUpdate(dt, frameId) {
        if (databus.gameover) return;

        if (frameId === 1 || frameId % 50 === 0) {
            console.log('[lockstep][battle] logicUpdate frameId =', frameId, 'joystickEnabled:', !this.joystick.hasDisable);
        }

        // 收到第一帧开始倒计时
        if (frameId === 1) this.addCountdown(1);

        // 倒计时后允许操作（>= 以防某些帧跳过）
        if (!this._inputEnabled && frameId >= parseInt(1000 / gameServer.fps)) {
            console.log('[lockstep][battle] ✅ input enabled at frameId', frameId);
            this._inputEnabled = true;
            this.joystick.enable();
            this.skill.enable();
        }

        databus.playerList.forEach(player => player.frameUpdate(dt));

        databus.bullets.forEach(bullet => {
            bullet.frameUpdate(dt);
            // 碰撞检测的仲裁逻辑（所有客户端基于同样的逻辑帧得出同样的结果）
            databus.playerList.forEach(player => {
                if (bullet.sourcePlayer !== player
                    && checkCircleCollision(player.collisionCircle, bullet.collisionCircle)) {
                    databus.removeBullets(bullet);
                    player.hp--;
                    player.hpRender.updateHp(player.hp);
                    if (player.hp <= 0) {
                        gameServer.settle();
                        gameServer.endGame();
                    }
                }
            });
        });
    }

    preditUpdate(dt) {
        databus.playerList.forEach(player => player.preditUpdate(dt));
        databus.bullets.forEach(bullet => bullet.preditUpdate(dt));
    }

    _destroy() {
        battleLogic.unsubscribe();
        // 清理 gameserver 注入的回调，避免下一个场景意外触发
        gameServer.setRenderUpdate(null);
        gameServer.setLogicUpdate(null);
        gameServer.setPreditUpdate(null);
        gameServer.setDebugMsgUpdate(null);
        gameServer.setPlayerAction(null);
    }
}
