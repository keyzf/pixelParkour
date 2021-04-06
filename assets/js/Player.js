// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        //松开过渡
        jumpDurationOff: 0.4,
        //按下过渡
        jumpDurationPress: 0.3,
        //最大跳跃高度
        maxJumpHeight: 0,
        //是否松开了上键 防止重复触发缓动效果
        isPressKeyUp: {
            visible: false,
            default: true
        },
        //node的初始化坐标
        nodeInitPosition: {
            visible: false,
            default: null
        },
        //是否停止动作
        isStopped: {
            visible: false,
            default: true
        },
        //当前骨骼对象
        dragonBones: {
            visible: false,
            default: null
        }
    },
    jump() {
        if (this.isStopped) return
        this.isPressKeyUp = false
        const up = cc.tween().to(this.jumpDurationOff, {y: this.maxJumpHeight}, {easing: "sineOut"})
        const down = cc.tween().to(this.jumpDurationPress, {y: this.nodeInitPosition.y}, {easing: "sineIn"})
        cc.tween(this.node)
            .sequence(up, down)
            .call(() => {
                this.isPressKeyUp = true
            })
            .start()
    },
    touchStart() {
        this.jump()
    },
    press(event) {
        if (event.keyCode === cc.macro.KEY.up && this.isPressKeyUp) this.jump()
    },
    addEventListener() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.press, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.press, this)
    },
    removeEventListener() {
        cc.systemEvent.of(cc.systemEvent.EventType.KEY_DOWN, this.press, this)
    },
    saveInitPosition() {
        const {x, y} = this.node.getBoundingBox()
        this.nodeInitPosition = {x, y}
    },
    saveDragonBones() {
        this.dragonBones = this.getComponent(dragonBones.ArmatureDisplay)
    },
    run() {
        this.isStopped = false
        this.addEventListener()
        this.saveDragonBones()
        this.saveInitPosition()
        this.dragonBones.timeScale = 1
    },
    resume() {
        this.isStopped = false
        this.node.resumeAllActions()
        this.dragonBones.timeScale = 1
    },
    stop() {
        this.isStopped = true
        this.node.stopAllActions()
        //dragonBones没有暂停方法  所以通过timeScale 将播放速度改为0  实现暂停
        this.dragonBones.timeScale = 0
    },
    onDestroy() {
        this.removeEventListener()
    },
    onLoad() {
        this.saveDragonBones()
        this.saveInitPosition()
        if (this.isStopped) {
            this.stop()
        }
    }
});
