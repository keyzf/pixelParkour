// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        //场景摄像机
        unlimitedScenesCamera: {
            default: null,
            type: cc.Camera
        },
        //场景摄像机精灵
        unlimitedScenesCameraSprite: {
            default: null,
            type: cc.Sprite
        },
        //要滚动的场景
        scene: {
            default: null,
            type: cc.Node
        },
        prevInsertCount: 2,
        //开始删除场景的 数量倍数
        multipleDeletePrevInsertCount: 2,
        //速度
        speed: 1,
        //是否停止动作
        isStopped: {
            visible: false,
            default: true
        }
    },
    update() {
        if (this.isStopped) return
        this.unlimitedScenesCamera.node.x += 1 * this.speed;
        //camera向左滚动的距离能被要删的场景数量的长度整除的时候 则开始删除无用的场景
        if ((this.unlimitedScenesCamera.node.x % (this.scene.width * this.multipleDeletePrevInsertCount)) === 0) {
            this.destroyScene()
            this.insertScene()
        }
    },
    destroyScene() {
        if (this.prevInsertCount === 0) return
        const parent = this.node.getParent()
        const children = parent.children.filter(value => value.name === this.scene.name);
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
        //预先插入场景数量
        const prevInsertCount = this.prevInsertCount
        const getParent = this.node.getParent()
        for (let i = 0; i < prevInsertCount; i++) {
            const scene = cc.instantiate(this.scene)
            //当前camera滚动到的x坐标
            const currentCameraX = this.unlimitedScenesCamera.node.x - (1 * this.speed) || 0
            let x = (this.scene.width * (i + 1)) + this.scene.x + currentCameraX
            const y = this.scene.y
            scene.setPosition(new cc.Vec2(x, y))
            getParent.addChild(scene)
        }
    },
    run() {
        this.isStopped = false
        const texture = new cc.RenderTexture();
        const spriteFrame = new cc.SpriteFrame();
        texture.initWithSize(this.unlimitedScenesCameraSprite.node.width, this.unlimitedScenesCameraSprite.node.height);
        spriteFrame.setTexture(texture);
        spriteFrame.setFlipY(true)
        this.unlimitedScenesCamera.targetTexture = texture;
        this.unlimitedScenesCameraSprite.spriteFrame = spriteFrame;
        this.insertScene()
    },
    resume() {
        this.isStopped = false
        this.node.resumeAllActions()
    },
    stop() {
        this.isStopped = true
        this.node.stopAllActions()
    },
    onLoad() {
        this.run()
    },
});
