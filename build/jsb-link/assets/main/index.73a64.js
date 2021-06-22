window.__require = function t(e, n, o) {
function i(r, c) {
if (!n[r]) {
if (!e[r]) {
var a = r.split("/");
a = a[a.length - 1];
if (!e[a]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(a, !0);
if (s) return s(a, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = a;
}
var h = n[r] = {
exports: {}
};
e[r][0].call(h.exports, function(t) {
return i(e[r][1][t] || t);
}, h, h.exports, t, e, n, o);
}
return n[r].exports;
}
for (var s = "function" == typeof __require && __require, r = 0; r < o.length; r++) i(o[r]);
return i;
}({
Fade: [ function(t, e) {
"use strict";
cc._RF.push(e, "05cc6pl7m1Le5/E/utsPgnt", "Fade");
cc.Class({
extends: cc.Component,
properties: {
duration: .5,
isOnLoadPlay: !0
},
show: function() {
return cc.tween(this.node).to(this.duration, {
opacity: 255
}).start();
},
hidden: function() {
return cc.tween(this.node).to(this.duration, {
opacity: 0
}).start();
},
run: function() {
cc.tween(this.node).sequence(this.show(), this.hidden()).start();
},
onLoad: function() {
this.isOnLoadPlay && this.show();
},
onDestroy: function() {
this.isOnLoadPlay && this.hidden();
}
});
cc._RF.pop();
}, {} ],
Flash: [ function(t, e) {
"use strict";
cc._RF.push(e, "3e417+RFUVLBpbz8KN7193l", "Flash");
cc.Class({
extends: cc.Component,
properties: {
duration: .1,
isOnLoadPlay: !0
},
show: function() {
return cc.tween(this.node).to(this.duration, {
opacity: 255
}).start();
},
hidden: function() {
return cc.tween(this.node).to(this.duration, {
opacity: 0
}).start();
},
run: function() {
cc.tween(this.node).sequence(this.hidden(), this.show(), this.hidden(), this.show(), this.hidden(), this.show()).start();
},
onLoad: function() {
this.isOnLoadPlay && this.show();
},
onDestroy: function() {}
});
cc._RF.pop();
}, {} ],
Hero: [ function(t, e) {
"use strict";
cc._RF.push(e, "52d36780q1Pu6KLh2EiXrMA", "Hero");
cc.Class({
extends: cc.Component,
properties: {
jumpDurationOff: .4,
jumpDurationPress: .3,
maxJumpHeight: 200
},
playJump: function() {
this.getComponent("SoundControl").play(this._jumpAudioPathAudioClip);
},
playFall: function() {
this.getComponent("SoundControl").play(this._fallAudioPathAudioClip);
},
jump: function() {
var t = this;
if (!this._isStopped) {
this.isPressKeyUp = !1;
var e = cc.tween().to(this.jumpDurationOff, {
y: this.maxJumpHeight
}, {
easing: "sineOut"
}).call(this.playJump.bind(this)), n = cc.tween().to(this.jumpDurationPress, {
y: this._nodeInitPosition.y
}, {
easing: "sineIn"
}).call(this.playFall.bind(this));
cc.tween(this.node).sequence(e, n).call(function() {
t.isPressKeyUp = !0;
}).start();
}
},
touchStart: function() {
this.isPressKeyUp && this.jump();
},
press: function(t) {
t.keyCode === cc.macro.KEY.up && this.isPressKeyUp && this.jump();
},
addEventListener: function() {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.press, this);
},
removeEventListener: function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.press, this);
},
saveInitPosition: function() {
var t = this.node.getBoundingBox(), e = t.x, n = t.y;
this._nodeInitPosition = {
x: e,
y: n
};
},
saveDragonBones: function() {
this._dragonBones = this.getComponent(dragonBones.ArmatureDisplay);
},
run: function() {
this._isStopped = !1;
this.node.resumeAllActions();
this.addEventListener();
this._dragonBones.timeScale = 1;
},
stop: function() {
this._isStopped = !0;
this._dragonBones.timeScale = 0;
this.removeEventListener();
},
onDestroy: function() {
this.removeEventListener();
},
loadAudioClip: function() {
var t = this;
cc.resources.load("audio/jump", cc.AudioClip, function(e, n) {
t._jumpAudioPathAudioClip = n;
});
cc.resources.load("audio/fall", cc.AudioClip, function(e, n) {
t._fallAudioPathAudioClip = n;
});
},
initProperty: function() {
this.isPressKeyUp = !0;
this._nodeInitPosition = {
x: 0,
y: 0
};
this._isStopped = !0;
this._dragonBones = null;
this._jumpAudioPathAudioClip = null;
this._fallAudioPathAudioClip = null;
},
onLoad: function() {
this.initProperty();
this.saveDragonBones();
this.saveInitPosition();
this.loadAudioClip();
}
});
cc._RF.pop();
}, {} ],
InfiniteScrollScenesCamera: [ function(t, e) {
"use strict";
cc._RF.push(e, "914ce+zxcBJqoTCluOYHDAo", "InfiniteScrollScenesCamera");
cc.Class({
extends: cc.Component,
properties: {
sceneImageNode: {
default: null,
type: cc.Node
},
prevInsertCount: 2,
multipleDeletePrevInsertCount: 2,
speed: 1
},
update: function() {
if (!this._isStopped) {
this.node.x += 1 * this.speed;
if (this.node.x % (this.sceneImageNode.width * this.multipleDeletePrevInsertCount) == 0) {
this.destroyScene();
this.insertScene();
}
}
},
destroyScene: function() {
var t = this;
if (0 !== this.prevInsertCount) for (var e = cc.find("SceneNode"), n = e.children.filter(function(e) {
return e.name === t.sceneImageNode.name;
}), o = 0; o < n.length; o++) if (0 !== o && o !== n.length - 1) {
var i = n[o];
i.destroy();
e.removeChild(i);
}
},
insertScene: function() {
for (var t = this.prevInsertCount, e = cc.find("SceneNode"), n = 0; n < t; n++) {
var o = cc.instantiate(this.sceneImageNode), i = this.node.x - 1 * this.speed || 0, s = this.sceneImageNode.width * (n + 1) + this.sceneImageNode.x + i, r = this.sceneImageNode.y;
o.setPosition(new cc.Vec2(s, r));
e.addChild(o);
}
},
initProperty: function() {
this._isStopped = !1;
},
onLoad: function() {
this.initProperty();
this.insertScene();
}
});
cc._RF.pop();
}, {} ],
Monster: [ function(t, e) {
"use strict";
cc._RF.push(e, "c3e55SzeF5MArH304ILw7Ik", "Monster");
cc.Class({
extends: cc.Component,
properties: {},
update: function() {
if (!this._isStopped) if (this.getHeroDistance() <= .76 * this.getHeroBoundingBox().width) {
this.stop();
this.StartGameController.stop();
} else !this._isCalculateScore && this.getHeroLeftX() >= this.getMonsterLeftX() && this.addScore();
},
getHeroBoundingBox: function() {
return this.StartGameController.hero.getBoundingBox();
},
getMonsterBoundingBox: function() {
return this.node.getBoundingBox();
},
getHeroLeftX: function() {
var t = this.getHeroBoundingBox(), e = t.center, n = t.width;
return e.x - n / 2;
},
getMonsterLeftX: function() {
var t = this.getMonsterBoundingBox(), e = t.center, n = t.width;
return e.x + n / 2;
},
getHeroDistance: function() {
var t = new cc.Vec2(this.getMonsterBoundingBox().center.x, this.getMonsterBoundingBox().origin.y), e = new cc.Vec2(this.getHeroBoundingBox().center.x, this.getHeroBoundingBox().origin.y), n = parseInt(t.sub(new cc.Vec2(e.x, e.y)).mag());
return Math.abs(n);
},
addScore: function() {
this._isCalculateScore = !0;
this.StartGameController.addScore();
},
saveDragonBones: function() {
this._dragonBones = this.getComponent(dragonBones.ArmatureDisplay);
},
run: function() {
this.saveDragonBones();
},
stop: function() {
this._isStopped = !0;
this.node.stopAllActions();
this._dragonBones.timeScale = 0;
},
initProperty: function() {
this._isStopped = !1;
this._dragonBones = null;
this._isCalculateScore = !1;
},
onLoad: function() {
this.initProperty();
this.saveDragonBones();
}
});
cc._RF.pop();
}, {} ],
PlayButton: [ function(t, e) {
"use strict";
cc._RF.push(e, "1ccccwxHKtGd5ALwBi177rB", "PlayButton");
cc.Class({
extends: cc.Component,
properties: {},
play: function() {
cc.audioEngine.play(this._audioClip, !1, 1);
},
onClickPlayBtn: function() {
this.play();
cc.find("RootNode/PanelNode/PlayPanel").destroy();
cc.find("RootNode").getComponent("StartGameController").run();
},
loadAudioClip: function() {
var t = this;
cc.resources.load("audio/click", cc.AudioClip, function(e, n) {
t._audioClip = n;
});
},
initProperty: function() {
this._audioClip = null;
},
onLoad: function() {
this.initProperty();
this.loadAudioClip();
}
});
cc._RF.pop();
}, {} ],
RestartButton: [ function(t, e) {
"use strict";
cc._RF.push(e, "45b813LubFGbKuB/uyavnle", "RestartButton");
cc.Class({
extends: cc.Component,
properties: {},
play: function() {
cc.audioEngine.play(this._audioClip, !1, 1);
},
onClickPlayBtn: function() {
this.play();
cc.find("RootNode/PanelNode/FinishedPanel").destroy();
cc.find("RootNode").getComponent("StartGameController").run();
},
loadAudioClip: function() {
var t = this;
cc.resources.load("audio/click", cc.AudioClip, function(e, n) {
t._audioClip = n;
});
},
initProperty: function() {
this._audioClip = null;
},
onLoad: function() {
this.initProperty();
this.loadAudioClip();
}
});
cc._RF.pop();
}, {} ],
ScoreLabel: [ function(t, e) {
"use strict";
cc._RF.push(e, "17f15wwL4NFc5X/+ARuZTlj", "ScoreLabel");
cc.Class({
extends: cc.Component,
properties: {},
initProperty: function() {
this._score = 0;
this._label = "SCORE: ";
},
setText: function(t) {
this._score = t;
this.setString();
this.play();
},
play: function() {
if (this._score > 0 && Number.isInteger(this._score / 1e3)) {
this.getComponent("SoundControl").run();
this.getComponent("Flash").run();
}
},
setString: function() {
this.getComponent(cc.Label).string = "" + this._label + this._score;
},
onLoad: function() {
this.initProperty();
this.setString();
}
});
cc._RF.pop();
}, {} ],
SoundControl: [ function(t, e) {
"use strict";
cc._RF.push(e, "20320h0uYpPSa6sdvKKX4PY", "SoundControl");
cc.Class({
extends: cc.Component,
properties: {
audioClip: {
type: cc.AudioClip,
default: null
},
volume: 1,
isLoop: !1,
isOnLoadPlay: !1
},
play: function(t) {
return this._audioId = cc.audioEngine.play(t, this.isLoop, this.volume);
},
stopAudio: function(t) {
cc.audioEngine.stop(t);
},
run: function() {
return this.play(this.audioClip);
},
initProperty: function() {
this._audioId = null;
},
onLoad: function() {
this.isOnLoadPlay && this.run();
},
onDestroy: function() {
this.stopAudio(this._audioId);
}
});
cc._RF.pop();
}, {} ],
StartGameController: [ function(t, e) {
"use strict";
cc._RF.push(e, "b4bdd6d12lDjaAoILdLgRKM", "StartGameController");
function n(t, e) {
var n;
if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
if (Array.isArray(t) || (n = o(t)) || e && t && "number" == typeof t.length) {
n && (t = n);
var i = 0;
return function() {
return i >= t.length ? {
done: !0
} : {
done: !1,
value: t[i++]
};
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
return (n = t[Symbol.iterator]()).next.bind(n);
}
function o(t, e) {
if (t) {
if ("string" == typeof t) return i(t, e);
var n = Object.prototype.toString.call(t).slice(8, -1);
"Object" === n && t.constructor && (n = t.constructor.name);
return "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(t, e) : void 0;
}
}
function i(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var n = 0, o = new Array(e); n < e; n++) o[n] = t[n];
return o;
}
cc.Class({
extends: cc.Component,
properties: {
monsterPrefab: {
default: null,
type: cc.Prefab
},
playPanelPrefab: {
default: null,
type: cc.Prefab
},
finishedPanelPrefab: {
default: null,
type: cc.Prefab
},
hero: {
type: cc.Node,
default: null
},
generateMonsterItemCount: 2,
scoreLabel: {
type: cc.Label,
default: null
},
secondIncreaseSpacing: .05
},
getHeroWidth: function() {
return this.hero.getBoundingBox().width;
},
generateMonsterItemX: function() {
return this.node.width;
},
generateMonsterItemY: function() {
return parseInt(this.heroPosition.y);
},
generateMonsterItemMinSpacing: function() {
return 2 * (this.getHeroWidth() + this.monsterPrefab.data.width * this.generateMonsterItemCount);
},
generateMonsterItemMaxSpacing: function() {
return this.node.width;
},
generateMonsterRandomSpacing: function() {
var t = this.generateMonsterItemMinSpacing(), e = this.generateMonsterItemMaxSpacing();
return parseInt(Math.random() * (e - t + 1) + t);
},
generateMonsterMoveSpeed: function() {
var t = parseFloat(this._roundRuntimeInterval * this.secondIncreaseSpacing).toFixed(2);
(t = 4.5 - t) > 4.5 && (t = 4.5);
t < 2.5 && (t = 2.5);
return t;
},
generateMonsterItem: function(t) {
var e = new cc.instantiate(this.monsterPrefab);
e.getComponent("Monster").StartGameController = this;
var n = this.generateMonsterItemX(), o = this.generateMonsterItemY() - 8;
e.setPosition(cc.v2(n, o));
this.node.getChildByName("PanelNode").addChild(e);
return {
monsterItem: e,
tween: cc.tween(e).to(this.generateMonsterMoveSpeed(), {
x: -this.node.width - e.width
}, {
progress: function(e, n, o, i) {
t && t(e, n, o, i);
return e + (n - e) * i;
}
}).call(function() {
e.destroy();
}).start()
};
},
generateMonsterController: function() {
var t = this;
if (!this._isStopped) if (this._randomMonsterCount >= this.generateMonsterItemCount) {
this._randomMonsterCount = 0;
this.generateMonsterController();
} else {
var e = !1, n = this.generateMonsterItem(function(n, o, i, s) {
if (parseInt(Math.abs(o - n) * s) > t.generateMonsterRandomSpacing() && !e) {
e = !0;
t.generateMonsterController();
}
});
this._randomMonsterCount++;
this._randomMonsterList.push(n);
}
},
resetScore: function() {
this.scoreLabel.getComponent("ScoreLabel").setText(this._score);
},
addScore: function() {
this._score += 100;
this.scoreLabel.getComponent("ScoreLabel").setText(this._score);
},
showPlayPanel: function() {
var t = cc.instantiate(this.playPanelPrefab);
this.node.getChildByName("PanelNode").addChild(t);
},
showFinishedPanel: function() {
var t = cc.instantiate(this.finishedPanelPrefab);
this.node.getChildByName("PanelNode").addChild(t);
},
saveHeroPosition: function() {
var t = this.hero.getBoundingBox().center, e = t.x, n = t.y;
this.heroPosition = {
x: e,
y: n
};
},
removeAllMonster: function() {
for (var t, e = n(this._randomMonsterList); !(t = e()).done; ) {
var o = t.value;
cc.isValid(o.monsterItem) && o.monsterItem.destroy();
}
this._randomMonsterList = [];
},
clearRoundRuntimeIntervalTiming: function() {
clearInterval(this._roundRuntimeIntervalTimer);
},
setRoundRuntimeIntervalTiming: function() {
var t = this;
this._roundRuntimeIntervalTimer = setInterval(function() {
return t._roundRuntimeInterval++;
}, 1e3);
},
run: function() {
this.initProperty();
this.resetScore();
this.generateMonsterController();
this.hero.getComponent("Hero").run();
this._audioId = this.getComponent("SoundControl").run();
this.setRoundRuntimeIntervalTiming();
},
stop: function() {
this._isStopped = !0;
this.node.stopAllActions();
this.hero.getComponent("Hero").stop();
this.getComponent("SoundControl").stopAudio(this._audioId);
this.removeAllMonster();
this.clearRoundRuntimeIntervalTiming();
this.showFinishedPanel();
},
initProperty: function() {
this._isStopped = !1;
this._audioId = null;
this._randomMonsterCount = 0;
this._randomMonsterList = [];
this._score = 0;
this._roundRuntimeInterval = 0;
this._roundRuntimeIntervalTimer = null;
},
onLoad: function() {
var t = this;
this.initProperty();
this.saveHeroPosition();
this.clearRoundRuntimeIntervalTiming();
this.showPlayPanel();
cc.find("CameraNode").getComponent("TouchEventControl").on(cc.Node.EventType.TOUCH_START, function() {
t._isStopped || t.hero.getComponent("Hero").touchStart();
});
},
onDestroy: function() {
this.clearRoundRuntimeIntervalTiming();
}
});
cc._RF.pop();
}, {} ],
TouchEventControl: [ function(t, e) {
"use strict";
cc._RF.push(e, "77631SM7QxDSJnfIZ8zTuSN", "TouchEventControl");
cc.Class({
extends: cc.Component,
properties: {},
on: function(t, e) {
switch (t) {
case cc.Node.EventType.TOUCH_START:
this._onTouchStartEventCallBack = e;
}
},
addEventListener: function() {
this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartEvent, this);
},
removeEventListener: function() {
this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStartEvent, this);
},
onTouchStartEvent: function() {
this._onTouchStartEventCallBack && this._onTouchStartEventCallBack();
},
onLoad: function() {
this.addEventListener();
},
onDestroy: function() {
this.removeEventListener();
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Fade", "Flash", "SoundControl", "StartGameController", "TouchEventControl", "Hero", "InfiniteScrollScenesCamera", "Monster", "PlayButton", "RestartButton", "ScoreLabel" ]);