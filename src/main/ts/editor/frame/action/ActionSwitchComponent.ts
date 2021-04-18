import { ActionTypeName, Switch } from "../../../util";
import { ChapterEditor } from "../../service/ChapterEditor";
import { getActions } from "../../../../js/request";
import * as m from "mithril";
import { ActionService } from "../../service/ActionService";

export class ActionSwitchComponent implements m.ClassComponent {

    private isExpanded = false;

    private currentFrameNumber = 0;
    private currentActionType: ActionTypeName;
    private actionTypeComponent: m.ClassComponent;

    constructor(private readonly editor: ChapterEditor, private readonly actionService: ActionService) {}

    onremove() {
        this.isExpanded = false;
        this.currentActionType = null;
        this.actionTypeComponent = null;
    }

    view(): m.Children {
        this.actionService.selectElementById(this.editor.selectedFrame.switchData.actionId);
        if (!this.actionService.selectedElement) return null;

        const linkExpand = {
            attrs: {
                onclick: () => this.isExpanded = !this.isExpanded
            }
        };
        const blockAction = {
            children: null
        };
        if (this.isExpanded) {
            const switchData: Switch = this.editor.selectedFrame.switchData;
            const selectAction = {
                attrs: {
                    disabled: !switchData,
                    onchange: e => {
                        this.actionService.selectElement(e.target.value);
                        switchData.actionId = this.actionService.selectedElement.id;
                        switchData.actionSwitchId = null;
                        switchData.actionSwitch = this.actionService.createActionSwitch();
                        switchData.switchPictures = null;
                        this.editor.notifyActionSwitchChanged();
                    }
                },
                children: this.actionService.elements.map((a, i) => {
                    const optionAction = {
                        attrs: {
                            selected: this.actionService.selectedIndex == i,
                            value: i
                        },
                        text: a.name
                    };
                    return m("option", optionAction.attrs, optionAction.text);
                })
            };
            if (this.currentFrameNumber != this.editor.selectedFrame.frameNumber
                || this.currentActionType != this.actionService.selectedElement.type.name) {
                this.currentFrameNumber = this.editor.selectedFrame.frameNumber;
                this.currentActionType = this.actionService.selectedElement.type.name;
                this.actionTypeComponent = this.actionService.createActionTypeComponent();
            }
            blockAction.children = [
                m("select[name=action]", selectAction.attrs, selectAction.children),
                m(this.actionTypeComponent)
            ];
        }
        return m("",
            m("label[for=action].link", linkExpand.attrs, "Действие для смены кадра"),
            m("", blockAction.children),
        );
    }
}
