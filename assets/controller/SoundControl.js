// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        //点击音效
        audioClip: {
            type: cc.AudioClip,
            default: null
        },
        //音量
        volume: 1,
        //是否循环
        isLoop: false,
        //是否在加载的时候播放
        isOnLoadPlay: false
    },
    play(audioClip) {
        return this._audioId = cc.audioEngine.play(audioClip, this.isLoop, this.volume)
    },
    stopAudio(audioId) {
        cc.audioEngine.stop(audioId)
    },
    run() {
        return this.play(this.audioClip)
    },
    initProperty() {
        this._audioId = null
    },
    onLoad() {
        if (this.isOnLoadPlay) this.run()
    },
    onDestroy() {
        this.stopAudio(this._audioId)
    }
});
