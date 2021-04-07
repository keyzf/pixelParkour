// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        //要滚动的场景
        sceneImageNode: {
            default: null,
            type: cc.Node
        },
        prevInsertCount: 2,
        //开始删除场景的 数量倍数
        multipleDeletePrevInsertCount: 2,
        //速度
        speed: 1,
    },
    update() {
        if (this._isStopped) return
        this.node.x += 1 * this.speed;
        //camera向左滚动的距离能被要删的场景数量的长度整除的时候 则开始删除无用的场景
        if ((this.node.x % (this.sceneImageNode.width * this.multipleDeletePrevInsertCount)) === 0) {
            this.destroyScene()
            this.insertScene()
        }
    },
    destroyScene() {
        if (this.prevInsertCount === 0) return
        const renderNodePath = "SceneNode"
        const parent = cc.find(renderNodePath)
        const children = parent.children.filter(value => value.name === this.sceneImageNode.name);
        for (let i = 0; i < children.length; i++) {
            //排除了原本和最后的的场景
            if (i !== 0 && i !== children.length - 1) {
                const item = children[i]
                item.destroy()
                parent.removeChild(item)
            }
        }
    },
    insertScene() {
        const renderNodePath = "SceneNode"
        //预先插入场景数量
        const prevInsertCount = this.prevInsertCount
        const getParent = cc.find(renderNodePath)
        for (let i = 0; i < prevInsertCount; i++) {
            const scene = cc.instantiate(this.sceneImageNode)
            //当前camera滚动到的x坐标
            const currentCameraX = this.node.x - (1 * this.speed) || 0
            let x = (this.sceneImageNode.width * (i + 1)) + this.sceneImageNode.x + currentCameraX
            const y = this.sceneImageNode.y
            scene.setPosition(new cc.Vec2(x, y))
            getParent.addChild(scene)
        }
    },
    initProperty() {
        this._isStopped = false
    },
    onLoad() {
        this.initProperty()
        this.insertScene()
    }
});
