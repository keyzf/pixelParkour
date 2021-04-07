// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {},
    play() {
        cc.audioEngine.play(this._audioClip, false, 1)
    },
    onClickPlayBtn() {
        this.play()
        const rootNodePath = `RootNode`
        const panelNodePath = `${rootNodePath}/PanelNode`
        cc.find(`${panelNodePath}/FinishedPanel`).destroy();
        cc.find(`${rootNodePath}`).getComponent("StartGame").run()
    },
    loadAudioClip() {
        const path = "audio/click"
        cc.resources.load(path, cc.AudioClip, (v, audioClip) => {
            this._audioClip = audioClip
        })
    },
    initProperty() {
        this._audioClip = null
    },
    onLoad() {
        this.initProperty()
        this.loadAudioClip()
    },
});
