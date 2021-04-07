// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {},
    update() {
        if (!this._isStopped) {
            //对骨骼动画周边多余的空白区域做出修正
            if (this.getHeroDistance() <= this.getHeroBoundingBox().width * 0.76) {
                this.stop()
                this.StartGame.stop()
            }
        }
    },
    getHeroBoundingBox() {
        return this.StartGame.hero.getBoundingBox()
    },
    getMonsterBoundingBox() {
        return this.node.getBoundingBox()
    },
    getHeroDistance() {
        //一般来说应该是统一 origin  或者 center
        //但是因为这个骨骼动画是一个竖着的长方形 所以左右跟上下的中心不一样  这里需要做调整
        const nodePos = new cc.Vec2(this.getMonsterBoundingBox().center.x, this.getMonsterBoundingBox().origin.y)
        const heroPos = new cc.Vec2(this.getHeroBoundingBox().center.x, this.getHeroBoundingBox().origin.y)
        let mag = parseInt(nodePos.sub(new cc.Vec2(heroPos.x, heroPos.y)).mag())
        return Math.abs(mag)
    },
    saveDragonBones() {
        this._dragonBones = this.getComponent(dragonBones.ArmatureDisplay)
    },
    run() {
        this.saveDragonBones()
    },
    stop() {
        this._isStopped = true
        this.node.stopAllActions()
        //dragonBones没有暂停方法  所以通过timeScale 将播放速度改为0  实现暂停
        this._dragonBones.timeScale = 0
    },
    initProperty() {
        //是否停止动作
        this._isStopped = false
        //当前骨骼对象
        this._dragonBones = null
    },
    onLoad() {
        this.initProperty()
        this.saveDragonBones()
    }
});
