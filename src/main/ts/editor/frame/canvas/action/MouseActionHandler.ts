import { ActionHandler } from "./ActionHandler";
import { ActiveZone } from "../ActiveZone";
import { ActionSwitchMouse, ActionSwitchScroll, ActionTypeName, Rectangle } from "../../../../util";
import { ChapterEditor } from "../../../service/ChapterEditor";
import { ActionService } from "../../../service/ActionService";
import { fabric } from "fabric";
import * as m from "mithril";

export class MouseActionHandler implements ActionHandler {

    readonly objects: fabric.Object[] = [];

    constructor(private readonly editor: ChapterEditor, private readonly actionService: ActionService) {
        const actionZone = new ActiveZone(this.editor.retrieveActionSwitchMouse().createBounds(), "yellow");
        this.objects.push(actionZone);
        actionZone.on("modified", () => {
            const bounds: Rectangle = actionZone.getBounds();
            if (this.actionService.selectedElement.type.name == ActionTypeName.Mouse) {
                this.editor.selectedFrame.switchData.actionSwitch = new ActionSwitchMouse(
                    this.editor.currentActionSwitchId, bounds.x, bounds.y,
                    bounds.width, bounds.height, this.actionService.selectedElement.id);
            } else if (this.actionService.selectedElement.type.name == ActionTypeName.Scroll) {
                this.editor.selectedFrame.switchData.actionSwitch = new ActionSwitchScroll(
                    this.editor.currentActionSwitchId, bounds.x, bounds.y, bounds.width, bounds.height,
                    this.editor.selectedFrame.switchData.actionSwitch.ticksCount,
                    this.actionService.selectedElement.id);
            }
            this.editor.notifyDataChanged();
            m.redraw();
        });
    }
}
