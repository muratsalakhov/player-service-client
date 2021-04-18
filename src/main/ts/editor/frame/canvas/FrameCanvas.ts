import { ChapterEditor } from "../../service/ChapterEditor";
import { ActiveZone } from "./ActiveZone";
import { ActionTypeName } from "../../../util";
import { ActionService } from "../../service/ActionService";
import { DragActionHandler } from "./action/DragActionHandler";
import { ActionHandler } from "./action/ActionHandler";
import { MouseActionHandler } from "./action/MouseActionHandler";
import { fabric } from "fabric";

export class FrameCanvas extends fabric.Canvas {

    private parentWidth = 0;
    private parentHeight = 0;

    private _scaleFactor = 0;
    private _currentPictureLink = "";

    private actionHandler: ActionHandler;
    private image: fabric.Image;

    constructor(private readonly parentId: string, canvasId: string,
                private readonly editor: ChapterEditor, private readonly actionService: ActionService) {
        super(canvasId, { selection: false });
        this.reloadImage();
        editor.on(ChapterEditor.NEW_ACTION_SWITCH, () => this.reloadActionHandler());
    }

    get scaleFactor(): number {
        return this._scaleFactor;
    }

    get currentPictureLink(): string {
        return this._currentPictureLink;
    }

    resizeCanvas() {
        const parent: HTMLElement = document.getElementById(this.parentId);
        this.setDimensions({ width: 0, height: 0 });
        if (this.parentWidth == parent.offsetWidth && this.parentHeight == parent.offsetHeight) {
            this.setDimensions({
                width: this.editor.chapter.pictureWidth * this.scaleFactor,
                height: this.editor.chapter.pictureHeight * this.scaleFactor
            });
        } else {
            this.parentWidth = parent.offsetWidth;
            this.parentHeight = parent.offsetHeight;
            const newScaleFactor: number = Math.min(parent.offsetWidth / this.editor.chapter.pictureWidth,
                parent.offsetHeight / this.editor.chapter.pictureHeight);
            if (newScaleFactor > 0) {
                const oldScaleFactor: number = this.scaleFactor;
                this._scaleFactor = newScaleFactor;
                this.setDimensions({
                    width: this.editor.chapter.pictureWidth * this.scaleFactor,
                    height: this.editor.chapter.pictureHeight * this.scaleFactor
                });
                this.scaleContent(oldScaleFactor);
            }
        }
    }

    reloadImage() {
        this._currentPictureLink = this.editor.selectedFrame.pictureLink;
        this.clear();
        this.resizeCanvas();
        fabric.Image.fromURL(`/data/${this.currentPictureLink}`, i => {
            this.image = i;
            this.add(this.image);
            this.scaleContent();
            this.reloadActionHandler();
        }, { hoverCursor: "default", selectable: false });
    }

    add(...objects: fabric.Object[]): FrameCanvas {
        for (const object of objects) {
            if (object instanceof ActiveZone) {
                object.canvas = this;
            }
        }
        super.add(...objects);
        return this;
    }

    remove(...objects: fabric.Object[]): FrameCanvas {
        for (const object of objects) {
            if (object instanceof ActiveZone) {
                object.canvas = null;
            }
        }
        super.remove(...objects);
        return this;
    }

    dispose(): this {
        if (this.image) {
            this.image["dispose"]();
        }
        super.dispose();
        this.editor.off(ChapterEditor.NEW_ACTION_SWITCH);
        return this;
    }

    private reloadActionHandler() {
        if (this.actionHandler) {
            for (const object of this.actionHandler.objects) {
                this.remove(object);
            }
        }
        this.actionHandler = this.createActionHandler();
        if (this.actionHandler) {
            for (const object of this.actionHandler.objects) {
                object.scale(this.scaleFactor);
                object.left *= this.scaleFactor;
                object.top *= this.scaleFactor;
                this.add(object);
            }
        }
    }

    private createActionHandler(): ActionHandler {
        if (!this.actionService.selectedElement) return null;
        switch (this.actionService.selectedElement.type.name) {
            case ActionTypeName.Mouse: case ActionTypeName.Scroll:
                return new MouseActionHandler(this.editor, this.actionService);
            case ActionTypeName.Drag: return new DragActionHandler(this.editor, this.actionService);
            default: return null;
        }
    }

    private scaleContent(oldScaleFactor: number = 0) {
        this.getObjects().forEach(o => {
            let scaleX: number = o.scaleX;
            let scaleY: number = o.scaleY;
            let left: number = o.left;
            let top: number = o.top;
            if (oldScaleFactor != 0) {
                scaleX /= oldScaleFactor;
                scaleY /= oldScaleFactor;
                left /= oldScaleFactor;
                top /= oldScaleFactor;
            }
            o.scaleX = scaleX * this.scaleFactor;
            o.scaleY = scaleY * this.scaleFactor;
            o.left = left * this.scaleFactor;
            o.top = top * this.scaleFactor;
        });
    }
}
