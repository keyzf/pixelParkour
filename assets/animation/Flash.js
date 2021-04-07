// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        duration: 0.1,
        //是否在加载的时候播放
        isOnLoadPlay: true
    },
    show() {
        return cc.tween(this.node).to(this.duration, {opacity: 255}).start()
    },
    hidden() {
        return cc.tween(this.node).to(this.duration, {opacity: 0}).start()
    },
    run() {
        cc.tween(this.node).sequence(this.hidden(), this.show(), this.hidden(), this.show(), this.hidden(), this.show(),).start()
    },
    onLoad() {
        if (this.isOnLoadPlay) this.show()
    },
    onDestroy() {
    }
});
