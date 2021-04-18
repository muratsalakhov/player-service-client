import { ChapterEditor } from "../../service/ChapterEditor";
import { Keyboard, ActionSwitchKeyboard } from "../../../util";
import * as keyboardListener from "../../../../js/KeyboardListener";
import * as m from "mithril";

export class KeyboardActionComponent implements m.ClassComponent {

    private static findKeyByCode(keyCode?: number): string {
        if (!keyCode) return "[нет]";
        if (Keyboard[keyCode]) return Keyboard[keyCode].toString();
        if (keyCode >= 96) return String.fromCharCode(keyCode - 48 * Math.floor(keyCode / 48));
        return String.fromCharCode(keyCode);
    }

    private _state = State.Idle;

    constructor(private readonly editor: ChapterEditor) {}

    onremove() {
        this.state = State.Idle;
    }

    view(): m.Children {
        const blockContent = {
            children: null
        };
        if (this.state == State.Idle) {
            const actionSwitch: ActionSwitchKeyboard = this.editor.retrieveActionSwitchKeyboard();
            const btnChangeKey = {
                attrs: {
                    onclick: () => this.state = State.WaitingKey
                }
            };
            const btnRemoveKey = {
                attrs: {
                    disabled: !actionSwitch.key,
                    onclick: () => this.updateKey(false, null)
                }
            };
            const btnChangeModKey = {
                attrs: {
                    onclick: () => this.state = State.WaitingModKey
                }
            };
            const btnRemoveModKey = {
                attrs: {
                    disabled: !actionSwitch.modKey,
                    onclick: () => this.updateKey(true, null)
                }
            };
            blockContent.children = m("p", "Клавиша: ",
                m("b", KeyboardActionComponent.findKeyByCode(actionSwitch.key)), " ",
                m("button[type=button].mini", btnChangeKey.attrs, "Изменить"),
                m("button[type=button].mini", btnRemoveKey.attrs, "Удалить"),
                m("br"), "Модификатор: ", m("b", KeyboardActionComponent.findKeyByCode(actionSwitch.modKey)), " ",
                m("button[type=button].mini", btnChangeModKey.attrs, "Изменить"),
                m("button[type=button].mini", btnRemoveModKey.attrs, "Удалить")
            );
        } else {
            const btnCancel = {
                attrs: {
                    onclick: () => this.state = State.Idle
                }
            };
            blockContent.children = m("b", "Ожидание ввода. Нажмите требуемую клавишу.",
                m("button[type=button].mini", btnCancel.attrs, "Отмена")
            );
        }
        return m("", blockContent.children);
    }

    private get state(): number {
        return this._state;
    }

    private set state(value: number) {
        this._state = value;
        if (value == State.Idle) {
            keyboardListener.switchOff();
            keyboardListener.off(keyboardListener.KEY_UP);
        } else if (value == State.WaitingKey) {
            keyboardListener.switchOn();
            keyboardListener.once(keyboardListener.KEY_UP, (key: number) => {
                this.state = State.Idle;
                this.updateKey(false, key);
                m.redraw();
            });
        } else if (value == State.WaitingModKey) {
            keyboardListener.switchOn();
            keyboardListener.once(keyboardListener.KEY_UP, (key: number) => {
                this.state = State.Idle;
                this.updateKey(true, key);
                m.redraw();
            });
        }
    }

    private updateKey(isModKey: boolean, key: number) {
        const actionSwitch: ActionSwitchKeyboard = this.editor.retrieveActionSwitchKeyboard();
        if (isModKey) {
            actionSwitch.modKey = key;
        } else {
            actionSwitch.key = key;
        }
        this.editor.selectedFrame.switchData.actionSwitch = actionSwitch;
        this.editor.notifyDataChanged();
    }
}

const enum State {
    Idle, WaitingKey, WaitingModKey
}
