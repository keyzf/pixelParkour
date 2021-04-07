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
        cc.find("Canvas/FinishedPanel").destroy();
        cc.find("Canvas").getComponent("StartGame").run()
    },
    initProperty() {
        this._audioClip = null
    },
    onLoad() {
        this.initProperty()
        const path = "audio/click"
        cc.resources.load(path, cc.AudioClip, (v, audioClip) => {
            this._audioClip = audioClip
        })
    }
});
