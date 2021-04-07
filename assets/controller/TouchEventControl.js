// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {},
    on(eventName, callback) {
        switch (eventName) {
            case cc.Node.EventType.TOUCH_START:
                this._onTouchStartEventCallBack = callback
                break
        }
    },
    addEventListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartEvent, this)
    },
    removeEventListener() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStartEvent, this)
    },
    onTouchStartEvent() {
        if (this._onTouchStartEventCallBack) this._onTouchStartEventCallBack()
    },
    onLoad() {
        this.addEventListener()
    },
    onDestroy() {
        this.removeEventListener()
    }
});
