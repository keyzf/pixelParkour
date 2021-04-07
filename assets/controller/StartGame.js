// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        //怪物预制件
        monsterPrefab: {
            default: null,
            type: cc.Prefab
        },
        //开始游戏预制件
        playPanelPrefab: {
            default: null,
            type: cc.Prefab
        },
        //游戏结束预制件
        finishedPanelPrefab: {
            default: null,
            type: cc.Prefab
        },
        //玩家
        hero: {
            type: cc.Node,
            default: null
        },
        //场景切换摄像机
        unlimitedScenesCamera: {
            type: cc.Camera,
            default: null
        },
        //一次生成怪物的个数
        generateMonsterItemCount: 2
    },
    //英雄宽度
    getHeroWidth() {
        return this.hero.getBoundingBox().width
    },
    //怪物x轴坐标 以战场最大宽度为起点
    generateMonsterItemX() {
        return this.node.width
    },
    // 怪物y轴坐标 以玩家的y轴为准
    generateMonsterItemY() {
        return parseInt(this.heroPosition.y)
    },
    //怪物之间最小间距为玩家+(怪物*2)的2倍宽度
    generateMonsterItemMinSpacing() {
        return (this.getHeroWidth() + (this.monsterPrefab.data.width * this.generateMonsterItemCount)) * 2
    },
    //怪物之间最大间距为战场宽度
    generateMonsterItemMaxSpacing() {
        return this.node.width
    },
    //怪物随机间距大小
    generateMonsterRandomSpacing() {
        let min = this.generateMonsterItemMinSpacing()
        let max = this.generateMonsterItemMaxSpacing()
        return parseInt(Math.random() * (max - min + 1) + min);
    },
    //生成怪物
    generateMonsterItem(progressCallback) {
        const renderNodeName = "PanelNode"
        const monsterItem = new cc.instantiate(this.monsterPrefab)
        //Monster组件添加StartGame引用
        //给Monster调用stop方法
        monsterItem.getComponent("Monster").StartGame = this

        const x = this.generateMonsterItemX()
        //减去 10  是因为玩家的骨骼动画上下有多余空白
        const y = this.generateMonsterItemY() - 10

        monsterItem.setPosition(cc.v2(x, y))
        this.node.getChildByName(renderNodeName).addChild(monsterItem)

        return {
            monsterItem,
            tween: cc.tween(monsterItem)
                //将monsterItem完全移除战场 所以x包括了怪物本身的宽度
                .to(4, {x: -this.node.width + (-monsterItem.width)}, {
                    progress: (start, end, current, ratio) => {
                        if (progressCallback) progressCallback(start, end, current, ratio)
                        return start + (end - start) * ratio
                    }
                })
                .call(() => {
                    monsterItem.destroy()
                }).start()
        }
    },
    //生成怪物控制器
    generateMonsterController() {
        if (this._isStopped) return;
        //当前生成的怪物数量已经达到最大
        if (this._randomMonsterCount >= this.generateMonsterItemCount) {
            this._randomMonsterCount = 0
            this.generateMonsterController()
            return
        }

        //当前怪物是否已经触发了一次 generateMonsterController
        //防止progress一直调用 generateMonsterController
        let isGenerated = false

        const generateMonsterItem = this.generateMonsterItem((start, end, current, ratio) => {
            const currentProgressPosition = parseInt(Math.abs(end - start) * ratio)
            const generateMonsterRandomSpacing = this.generateMonsterRandomSpacing()
            if ((currentProgressPosition > generateMonsterRandomSpacing) && !isGenerated) {
                isGenerated = true
                this.generateMonsterController()
            }
        })

        this._randomMonsterCount++
        this._randomMonsterList.push(generateMonsterItem)
    },
    //显示开始游戏界面
    showPlayPanel() {
        const renderNodeName = "PanelNode"
        const playPanelNode = cc.instantiate(this.playPanelPrefab)
        this.node.getChildByName(renderNodeName).addChild(playPanelNode)
    },
    //显示游戏结束界面
    showFinishedPanel() {
        const renderNodeName = "PanelNode"
        const finishedPanelPrefab = cc.instantiate(this.finishedPanelPrefab)
        this.node.getChildByName(renderNodeName).addChild(finishedPanelPrefab)
    },
    //保存英雄位置
    saveHeroPosition() {
        const {x, y} = this.hero.getBoundingBox().center
        this.heroPosition = {x, y}
    },
    //移除所有怪物
    removeAllMonster() {
        for (let value of this._randomMonsterList) {
            if (cc.isValid(value.monsterItem)) {
                value.monsterItem.destroy()
            }
        }
        this._randomMonsterList = []
    },
    run() {
        this.initProperty()
        this.saveHeroPosition()
        this.generateMonsterController()
        this.hero.getComponent("Hero").run()
        this._audioId = this.getComponent("SoundControl").run()
        // this.unlimitedScenesCamera.getComponent("UnlimitedScenesCamera").run()
    },
    stop() {
        this._isStopped = true
        this.node.stopAllActions()
        this.hero.getComponent("Hero").stop()
        this.getComponent("SoundControl").stopAudio(this._audioId)
        // this.unlimitedScenesCamera.getComponent("UnlimitedScenesCamera").stop()
        this.removeAllMonster()
    },
    initProperty() {
        this._isStopped = false
        this._audioId = null
        this._randomMonsterCount = 0
        this._randomMonsterList = []
    },
    onLoad() {
        this.initProperty()
        this.saveHeroPosition()
        this.showPlayPanel()
    },
});
