// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        //音频源文件
        audio: {
            type: cc.AudioClip,
            default: null
        },
        //音量
        volume: 1,
        //是否停止动作
        isStopped: {
            visible: false,
            default: true
        },
        audioId: {
            visible: false,
            default: null
        }
    },
    playMusic() {
        if (this.isStopped) return
        this.audioId = cc.audioEngine.play(this.audio, true, this.volume)
    },
    pauseMusic() {
        cc.audioEngine.pause(this.audioId)
    },
    resumeMusic() {
        cc.audioEngine.resume(this.audioId)
    },
    run() {
        this.isStopped = false
        this.playMusic()
    },
    resume() {
        this.isStopped = false
        this.resumeMusic()
        this.node.resumeAllActions()
    },
    stop() {
        this.isStopped = true
        this.pauseMusic()
        this.node.stopAllActions()
    },
});
