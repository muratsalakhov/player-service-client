import EventEmitter from "eventemitter3";

const keyboardListener:EventEmitter = new EventEmitter();
let isKeyDown:boolean = false;
let modKeyDelayed:number | null = null;

export const keyboardListenerSwitchOn = () => {
    window.onkeydown = function(e:KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
        isKeyDown = true;
        const key = e.which || e.keyCode;
        const modKey = findModKey(e);
        modKeyDelayed = modKey;
        keyboardListener.emit('keydown', key, modKey);
        return false;
    };
    window.onkeyup = function(e:KeyboardEvent) {
        const key = (e.which || e.keyCode) === 190 ? (e.code === 'Slash' ? 191 : 190) : (e.which || e.keyCode);
        if (isKeyDown) {
            const isModKey = key >= 16 && key <= 18;
            if (isModKey) {
                modKeyDelayed = key;
                window.setTimeout(function () {
                    modKeyDelayed = null;
                }, 250);
            } else {
                isKeyDown = false;
            }
            keyboardListener.emit('keyup', key, findModKey(e) || modKeyDelayed);
        }
        return false;
    };
};

export const keyboardListenerSwitchOff = () => {
    window.onkeydown = null;
    window.onkeyup = null;
    keyboardListener.off('keydown');
    keyboardListener.off('keyup');
};

function findModKey(e:KeyboardEvent) {
    if (e.shiftKey) return 16;
    if (e.ctrlKey) return 17;
    if (e.altKey) return 18;
    return null;
}

export default keyboardListener;