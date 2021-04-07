// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {},
    initProperty() {
        this._duration = 0.5
    },
    onLoad() {
        cc.tween(this.node).to(this._duration, {opacity: 255}).start()
    },
    onDestroy() {
        cc.tween(this.node).to(this._duration, {opacity: 0}).start()
    }
});
