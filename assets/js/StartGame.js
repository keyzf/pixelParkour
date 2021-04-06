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
        monsterFab: {
            default: null,
            type: cc.Prefab
        },
        //开始游戏预制件
        playPanelFab: {
            default: null,
            type: cc.Prefab
        },
        //游戏结束预制件
        finishedPanelFab: {
            default: null,
            type: cc.Prefab
        },
        //玩家
        player: {
            type: cc.Node,
            default: null
        },
        //场景音乐
        sceneMusic: {
            type: cc.Node,
            default: null
        },
        //场景切换摄像机
        unlimitedScenesCamera: {
            type: cc.Camera,
            default: null
        },
        //是否停止动作
        isStopped: {
            visible: false,
            default: false
        },
        //一次生成怪物的个数
        generateMonsterItemCount: 2
    },
    getPlayerWidth() {
        return this.player.getBoundingBox().width
    },
    generateMonsterItemX() {
        //怪物x轴坐标 以战场最大宽度为起点
        return this.node.width
    },
    generateMonsterItemY() {
        // 怪物y轴坐标 以玩家的y轴为准
        return parseInt(this.playerPosition.y)
    },
    generateMonsterItemMinSpacing() {
        //怪物之间最小间距为玩家+(怪物*2)的3倍宽度
        return (this.getPlayerWidth() + (this.monsterFab.data.width * this.generateMonsterItemCount)) * 2
    },
    generateMonsterItemMaxSpacing() {
        //怪物之间最大间距为战场宽度
        return this.node.width
    },
    generateRandomSpacing() {
        let min = this.generateMonsterItemMinSpacing()
        let max = this.generateMonsterItemMaxSpacing()
        return parseInt(Math.random() * (max - min + 1) + min);
    },
    generateMonsterItem(progressCallback) {
        const monsterItem = new cc.instantiate(this.monsterFab)
        //Monster组件添加StartGame引用
        //给Monster调用stop方法
        monsterItem.getComponent("Monster").StartGame = this

        //减去 10  是因为玩家的骨骼动画上下有多余空白
        const x = this.generateMonsterItemX()
        const y = this.generateMonsterItemY() - 10

        monsterItem.setPosition(cc.v2(x, y))
        this.node.addChild(monsterItem)

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
    monsterController() {
        if (this.isStopped) return;
        //当前生成的怪物数量已经达到最大
        if (this.randomMonsterCount >= this.generateMonsterItemCount) {
            this.randomMonsterCount = 0
            this.monsterController()
            return
        }

        //当前怪物是否已经触发了一次 monsterController
        //防止progress一直调用 monsterController
        let isGenerated = false

        const generateMonsterItem = this.generateMonsterItem((start, end, current, ratio) => {
            const currentProgressPosition = parseInt(Math.abs(end - start) * ratio)
            const generateRandomSpacing = this.generateRandomSpacing()
            if ((currentProgressPosition > generateRandomSpacing) && !isGenerated) {
                isGenerated = true
                this.monsterController()
            }
        })
        this.randomMonsterCount++
        this.randomMonsterList.push(generateMonsterItem)
    },
    savePlayerPosition() {
        const {x, y} = this.player.getBoundingBox().center
        this.playerPosition = {x, y}
    },
    removeDestroyedMonster() {
        const lastStartIndex = this.randomMonsterList.length - this.generateMonsterItemCount
        this.randomMonsterList = this.randomMonsterList.slice(lastStartIndex, this.randomMonsterList.length)
    },
    run() {
        this.savePlayerPosition()
        this.isStopped = false
        this.randomMonsterCount = 0
        this.randomMonsterList = []
        this.monsterController()
        this.player.getComponent("Player").run()
        this.sceneMusic.getComponent("SceneMusic").run()
        this.unlimitedScenesCamera.getComponent("UnlimitedScenesCamera").run()
    },
    resume() {
        this.isStopped = false
        this.node.resumeAllActions()
        this.player.getComponent("Player").resume()
        this.sceneMusic.getComponent("SceneMusic").resume()
        this.unlimitedScenesCamera.getComponent("UnlimitedScenesCamera").resume()
        for (let i = 0; i < this.randomMonsterList.length; i++) {
            const monsterItem = this.randomMonsterList[i].monsterItem
            const item = this.randomMonsterList[i].tween
            item.resume()
            if (monsterItem) {
                monsterItem.getComponent("Monster").stop()
            }
        }
    },
    stop() {
        this.isStopped = true
        this.node.stopAllActions()
        this.player.getComponent("Player").stop()
        this.sceneMusic.getComponent("SceneMusic").stop()
        this.unlimitedScenesCamera.getComponent("UnlimitedScenesCamera").stop()
        //移除已经不显示的怪物
        this.removeDestroyedMonster()
        for (let i = 0; i < this.randomMonsterList.length; i++) {
            const monsterItem = this.randomMonsterList[i].monsterItem
            const item = this.randomMonsterList[i].tween
            item.stop()
            if (monsterItem) {
                monsterItem.getComponent("Monster").stop()
            }
        }
        this.showFinishedPanel()
    },
    showPlayPanel() {
        const playPanelNode = cc.instantiate(this.playPanelFab)
        this.node.addChild(playPanelNode)
    },
    showFinishedPanel() {
        const finishedPanelFab = cc.instantiate(this.finishedPanelFab)
        this.node.addChild(finishedPanelFab)
    },
    onLoad() {
        this.savePlayerPosition()
        this.showPlayPanel()
    },
});
