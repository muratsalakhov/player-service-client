import { getActions } from "../../../js/request";
import {
    Action, ActionSwitchDrag,
    ActionSwitchKeyboard,
    ActionSwitchMouse,
    ActionSwitchPause,
    ActionSwitchScroll,
    ActionTypeName
} from "../../util";
import { KeyboardActionComponent } from "../frame/action/KeyboardActionComponent";
import * as m from "mithril";
import { ChapterEditor } from "./ChapterEditor";
import { PauseActionComponent } from "../frame/action/PauseActionComponent";
import { ScrollActionSwitchComponent } from "../frame/action/ScrollActionSwitchComponent";
import { AbstractList } from "./AbstractList";

export class ActionService extends AbstractList<Action> {

    constructor(private readonly editor: ChapterEditor) {
        super();
    }

    createActionSwitch(): any {
        switch (this.selectedElement.type.name) {
            case ActionTypeName.Mouse: return new ActionSwitchMouse(null, 0, 0, 40, 40, this.selectedElement.id);
            case ActionTypeName.Keyboard: return new ActionSwitchKeyboard(null, null, null, this.selectedElement.id);
            case ActionTypeName.Pause: return new ActionSwitchPause(null, 2000, this.selectedElement.id);
            case ActionTypeName.Scroll: return new ActionSwitchScroll(null, 0, 0, 40, 40, 0, this.selectedElement.id);
            case ActionTypeName.Drag: return new ActionSwitchDrag(null,
                0, 0, 0, 0, 0, 0, 0, 0, this.selectedElement.id);
            default: return null;
        }
    }

    createActionTypeComponent(): m.ClassComponent {
        if (!this.selectedElement) return null;
        switch (this.selectedElement.type.name) {
            case ActionTypeName.Keyboard: return new KeyboardActionComponent(this.editor);
            case ActionTypeName.Pause: return new PauseActionComponent(this.editor, this);
            case ActionTypeName.Scroll: return new ScrollActionSwitchComponent(this.editor);
            default: return {
                view(): m.Children {
                    return null;
                }
            };
        }
    }

    reload() {
        getActions().then((a: Action[]) => {
            this.reset();
            this.elements.push({
                id: null,
                name: "---",
                type: {
                    id: null,
                    name: ActionTypeName.None,
                    isExtended: false
                }
            }, ...a);
        });
    }
}
