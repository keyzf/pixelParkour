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
        this._score = 0
        this._label = "SCORE: "
    },
    setText(score) {
        this._score = score
        this.setString()
        this.play()
    },
    play() {
        const multiple = 1000
        if (this._score > 0 && Number.isInteger((this._score / multiple))) {
            this.getComponent("SoundControl").run()
            this.getComponent("Flash").run()
        }
    },
    setString() {
        this.getComponent(cc.Label).string = `${this._label}${this._score}`
    },
    onLoad() {
        this.initProperty()
        this.setString()
    }
});
