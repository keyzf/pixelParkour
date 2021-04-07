// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        //是否停止动作
        isStopped: {
            visible: false,
            default: false
        },
        //当前骨骼对象
        dragonBones: {
            visible: false,
            default: null
        }
    },
    update() {
        if (!this.isStopped) {
            //对骨骼动画周边多余的空白区域做出修正
            if (this.getPlayerDistance() <= this.getPlayerBoundingBox().width * 0.76) {
                this.stop()
                this.StartGame.stop()
            }
        }
    },
    getPlayerBoundingBox() {
        return this.StartGame.player.getBoundingBox()
    },
    getMonsterBoundingBox() {
        return this.node.getBoundingBox()
    },
    getPlayerDistance() {
        //一般来说应该是统一 origin  或者 center
        //但是因为这个骨骼动画是一个竖着的长方形 所以左右跟上下的中心不一样  这里需要做调整
        const nodePos = new cc.Vec2(this.getMonsterBoundingBox().center.x, this.getMonsterBoundingBox().origin.y)
        const playerPos = new cc.Vec2(this.getPlayerBoundingBox().center.x, this.getPlayerBoundingBox().origin.y)
        let mag = parseInt(nodePos.sub(new cc.Vec2(playerPos.x, playerPos.y)).mag())
        return Math.abs(mag)
    },
    saveDragonBones() {
        this.dragonBones = this.getComponent(dragonBones.ArmatureDisplay)
    },
    run() {
        this.saveDragonBones()
    },
    resume() {
        this.isStopped = false
        this.node.resumeAllActions()
        //dragonBones没有暂停方法  所以通过timeScale 将播放速度改为0  实现暂停
        this.dragonBones.timeScale = 1
    },
    stop() {
        this.isStopped = true
        this.node.stopAllActions()
        //dragonBones没有暂停方法  所以通过timeScale 将播放速度改为0  实现暂停
        this.dragonBones.timeScale = 0
    },
    onLoad() {
        this.saveDragonBones()
    }
});
