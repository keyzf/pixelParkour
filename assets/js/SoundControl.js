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
        clickAudioClip: {
            type: cc.AudioClip,
            default: null
        },
        //登场背景声音
        debutAudioClip: {
            type: cc.AudioClip,
            default: null
        },
        volume: 0.2
    },
    play(audioClip, isLoop = false) {
        return cc.audioEngine.play(audioClip, isLoop, this.volume)
    },
    stopAudio(audioId) {
        cc.audioEngine.stop(audioId)
    },
    onClickEvent() {
        return this.play(this.clickAudioClip)
    },
    onLoadDebutAudioClip() {
        return this.play(this.debutAudioClip, true)
    }
});
