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
        maxJumpHeight: 200,
    },
    playJump() {
        this.getComponent("SoundControl").play(this._jumpAudioPathAudioClip)
    },
    playFall() {
        this.getComponent("SoundControl").play(this._fallAudioPathAudioClip)
    },
    jump() {
        if (this._isStopped) return
        this.isPressKeyUp = false
        const up = cc.tween().to(this.jumpDurationOff, {y: this.maxJumpHeight}, {easing: "sineOut"}).call(this.playJump.bind(this))
        const down = cc.tween().to(this.jumpDurationPress, {y: this._nodeInitPosition.y}, {easing: "sineIn"}).call(this.playFall.bind(this))
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
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.press, this)
    },
    saveInitPosition() {
        const {x, y} = this.node.getBoundingBox()
        this._nodeInitPosition = {x, y}
    },
    saveDragonBones() {
        this._dragonBones = this.getComponent(dragonBones.ArmatureDisplay)
    },
    run() {
        this._isStopped = false
        this.node.resumeAllActions()
        this.addEventListener()
        this._dragonBones.timeScale = 1
    },
    stop() {
        this._isStopped = true
        //dragonBones没有暂停方法  所以通过timeScale 将播放速度改为0  实现暂停
        this._dragonBones.timeScale = 0
        this.removeEventListener()
    },
    onDestroy() {
        this.removeEventListener()
    },
    loadAudioClip() {
        const jumpAudioPath = "audio/jump"
        const fallAudioPath = "audio/fall"
        cc.resources.load(jumpAudioPath, cc.AudioClip, (v, audioClip) => {
            this._jumpAudioPathAudioClip = audioClip
        })
        cc.resources.load(fallAudioPath, cc.AudioClip, (v, audioClip) => {
            this._fallAudioPathAudioClip = audioClip
        })
    },
    initProperty() {
        //是否松开了上键 防止重复触发缓动效果
        this.isPressKeyUp = true
        //node的初始化坐标
        this._nodeInitPosition = {x: 0, y: 0}
        //是否停止动作
        this._isStopped = true
        //当前骨骼对象
        this._dragonBones = null
        //跳跃音效
        this._jumpAudioPathAudioClip = null
        this._fallAudioPathAudioClip = null
    },
    onLoad() {
        this.initProperty()
        this.saveDragonBones()
        this.saveInitPosition()
        this.loadAudioClip()
    }
});
