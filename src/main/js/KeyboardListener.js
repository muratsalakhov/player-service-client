const EventEmitter = require("eventemitter3");

const keyboardListener = new EventEmitter();
keyboardListener.KEY_DOWN = "keydown";
keyboardListener.KEY_UP = "keyup";
var isKeyDown = false;
var modKeyDelayed = null;

keyboardListener.switchOn = function() {
    window.onkeydown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        isKeyDown = true;
        const key = e.which || e.keyCode;
        const modKey = findModKey(e);
        modKeyDelayed = modKey;
        keyboardListener.emit(keyboardListener.KEY_DOWN, key, modKey);
        return false;
    };
    window.onkeyup = function(e) {
        const key = (e.which || e.keyCode) === 190 ? (e.code === 'Slash' ? 191 : 190) : (e.which || e.keyCode);
        if (isKeyDown) {
            const isModKey = key >= 16 && key <= 18;
            if (isModKey) {
                //TODO: добавить отправку отдельно нажатых shift, ctrl, alt
                modKeyDelayed = key;
                setTimeout(function () {
                    modKeyDelayed = null;
                }, 250);
            } else {
                isKeyDown = false;
            }
            keyboardListener.emit(keyboardListener.KEY_UP, key, findModKey(e) || modKeyDelayed);
        }
        return false;
    };
};

keyboardListener.switchOff = function() {
    window.onkeydown = null;
    window.onkeyup = null;
    this.off(keyboardListener.KEY_DOWN);
    this.off(keyboardListener.KEY_UP);
};

//TODO: сделать полноценную обработку любых клавиш-модификаторов
function findModKey(e) {
    if (e.shiftKey) return 16;
    if (e.ctrlKey) return 17;
    if (e.altKey) return 18;
    return null;
}

module.exports = keyboardListener;
