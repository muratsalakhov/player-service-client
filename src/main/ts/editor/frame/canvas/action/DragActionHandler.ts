import { fabric } from "fabric";
import { ActionHandler } from "./ActionHandler";
import { ChapterEditor } from "../../../service/ChapterEditor";
import { ActionService } from "../../../service/ActionService";
import { ActionSwitchDrag, Rectangle } from "../../../../util";
import { ActiveZone } from "../ActiveZone";
import * as m from "mithril";

export class DragActionHandler implements ActionHandler {

    private static readonly POINT_SIZE = 16;
    private static readonly LINE_THICKNESS = 6;

    private readonly startZone: ActiveZone;
    private readonly finishZone: ActiveZone;
    objects: fabric.Object[] = [];

    constructor(private readonly editor: ChapterEditor, private readonly actionService: ActionService) {
        const actionSwitch: ActionSwitchDrag = editor.retrieveActionSwitchDrag();
        this.startZone = new ActiveZone(actionSwitch.createStartBounds(), "green");
        this.objects.push(this.startZone);
        const linePoints: fabric.Point[] = [];
        if (editor.selectedFrame.switchData.switchPictures) {
            for (const switchPicture of editor.selectedFrame.switchData.switchPictures) {
                linePoints.push(new fabric.Point(switchPicture.x - DragActionHandler.LINE_THICKNESS / 2,
                    switchPicture.y - DragActionHandler.LINE_THICKNESS / 2));
                this.objects.push(new fabric.Rect({
                    hoverCursor: "default",
                    selectable: false,
                    fill: "orange",
                    opacity: 0.6,
                    width: DragActionHandler.POINT_SIZE,
                    height: DragActionHandler.POINT_SIZE,
                    left: switchPicture.x - DragActionHandler.POINT_SIZE / 2,
                    top: switchPicture.y - DragActionHandler.POINT_SIZE / 2
                }));
            }
        }
        this.objects.push(new fabric.Polyline(linePoints, {
            hoverCursor: "default",
            selectable: false,
            fill: "orange",
            opacity: 0.6,
            stroke: "orange",
            strokeWidth: DragActionHandler.LINE_THICKNESS
        }));
        this.finishZone = new ActiveZone(actionSwitch.createFinishBounds(), "red");
        this.objects.push(this.finishZone);

        this.startZone.on("modified", () => this.updateActionSwitch());
        this.finishZone.on("modified", () => this.updateActionSwitch());
    }

    private updateActionSwitch() {
        const startBounds: Rectangle = this.startZone.getBounds();
        const finishBounds: Rectangle = this.finishZone.getBounds();
        this.editor.selectedFrame.switchData.actionSwitch = new ActionSwitchDrag(
            this.editor.currentActionSwitchId, startBounds.x, startBounds.y,
            startBounds.width, startBounds.height, finishBounds.x, finishBounds.y,
            finishBounds.width, finishBounds.height, this.actionService.selectedElement.id);
        this.editor.notifyDataChanged();
        m.redraw();
    }
}
