import { ChapterService } from "./ChapterService";
import {
    ActionSwitchKeyboard,
    ActionSwitchMouse,
    Chapter,
    Frame,
    ActionSwitchPause,
    ActionSwitchScroll, ActionSwitchDrag
} from "../../util";
import { getChapter, getFrame, updateChapter } from "../../../js/request";
import { Dictionary } from "./Dictionary";
import * as EventEmitter from "eventemitter3";

export class ChapterEditor extends EventEmitter {

    static readonly NEW_ACTION_SWITCH = "newActionSwitch";

    private _isChanged = false;
    private _isSaved = false;

    selectedFrameIndex = 0;

    constructor(private readonly dictionary: Dictionary, private readonly chapterService: ChapterService) {
        super();
    }

    get isChanged(): boolean {
        return this._isChanged;
    }

    get isSaved(): boolean {
        return this._isSaved;
    }

    get isSelectedFrameFirst(): boolean {
        return this.chapter.frames && this.chapter.frames.length > 0 ? this.selectedFrameIndex == 0 : true;
    }

    get isSelectedFrameLast(): boolean {
        return this.chapter.frames && this.chapter.frames.length > 0
            ? this.selectedFrameIndex == this.chapter.frames.length - 1 : true;
    }

    get chapter(): Chapter {
        return this.chapterService.selectedElement;
    }

    get selectedFrame(): Frame {
        return this.chapter.frames[this.selectedFrameIndex];
    }

    get currentActionSwitchId(): string {
        return this.selectedFrame.switchData.actionSwitchId;
    }

    retrieveActionSwitchMouse(): ActionSwitchMouse {
        const actionSwitch: any = this.selectedFrame.switchData.actionSwitch;
        if (actionSwitch instanceof ActionSwitchMouse) return actionSwitch;
        return new ActionSwitchMouse(actionSwitch["id"], actionSwitch["x_left"], actionSwitch["y_left"],
            actionSwitch["x_right"], actionSwitch["y_right"], actionSwitch["action_id"])
    }

    retrieveActionSwitchKeyboard(): ActionSwitchKeyboard {
        const actionSwitch: any = this.selectedFrame.switchData.actionSwitch;
        if (actionSwitch instanceof ActionSwitchKeyboard) return actionSwitch;
        return new ActionSwitchKeyboard(actionSwitch["id"],
            actionSwitch["key"], actionSwitch["mod_key"], actionSwitch["action_id"])
    }

    retrieveActionSwitchPause(): ActionSwitchPause {
        const actionSwitch: any = this.selectedFrame.switchData.actionSwitch;
        if (actionSwitch instanceof ActionSwitchPause) return actionSwitch;
        return new ActionSwitchPause(actionSwitch["id"], actionSwitch["duration"], actionSwitch["action_id"]);
    }

    retrieveActionSwitchScroll(): ActionSwitchScroll {
        const actionSwitch: any = this.selectedFrame.switchData.actionSwitch;
        if (actionSwitch instanceof ActionSwitchScroll) return actionSwitch;
        return new ActionSwitchScroll(actionSwitch["id"], actionSwitch["x_left"], actionSwitch["y_left"],
            actionSwitch["x_right"], actionSwitch["y_right"], actionSwitch["ticks_count"], actionSwitch["action_id"]);
    }

    retrieveActionSwitchDrag(): ActionSwitchDrag {
        const actionSwitch: any = this.selectedFrame.switchData.actionSwitch;
        if (actionSwitch instanceof ActionSwitchDrag) return actionSwitch;
        return new ActionSwitchDrag(actionSwitch["id"], actionSwitch["start_x_left"], actionSwitch["start_y_left"],
            actionSwitch["start_x_right"], actionSwitch["start_y_right"],
            actionSwitch["finish_x_left"], actionSwitch["finish_y_left"],
            actionSwitch["finish_x_right"], actionSwitch["finish_y_right"], actionSwitch["action_id"]);
    }

    addEmptyFrame() {
        if (this.chapter.frames.length == 0) {
            this.selectedFrameIndex = 0;
        } else {
            this.selectedFrameIndex++;
        }
        this.chapter.frames.splice(this.selectedFrameIndex, 0, this.createEmptyFrame());
        this.updateFrameNumbers();
        this.notifyDataChanged();
    }

    swapSelectedFrameWith(index: number) {
        const selectedFrame: Frame = this.selectedFrame;
        this.chapter.frames[this.selectedFrameIndex] = this.chapter.frames[index];
        this.chapter.frames[index] = selectedFrame;
        this.selectedFrameIndex = index;
        this.updateFrameNumbers();
        this.notifyDataChanged();
    }

    updateSelectedFrameTaskTextId() {
        this.selectedFrame.taskTextId = this.dictionary.taskTexts.findTextId(this.selectedFrame.taskText);
    }

    updateSelectedFrameHintTextId() {
        this.selectedFrame.hintTextId = this.dictionary.hintTexts.findTextId(this.selectedFrame.hintText);
    }

    deleteSelectedFramePicture() {
        this.selectedFrame.pictureLink = null;
        this.notifyDataChanged();
    }

    deleteSelectedFrame() {
        this.chapter.frames.splice(this.selectedFrameIndex, 1);
        if (this.selectedFrameIndex == this.chapter.frames.length && !this.isSelectedFrameFirst) {
            this.selectedFrameIndex--;
        }
        this.updateFrameNumbers();
        this.notifyDataChanged();
    }

    notifyActionSwitchChanged() {
        this.notifyDataChanged();
        this.emit(ChapterEditor.NEW_ACTION_SWITCH);
    }

    notifyDataChanged() {
        this._isChanged = true;
        this._isSaved = false;
    }

    save(): Promise<void> {
        return updateChapter(this.chapter).then(() => {
            this._isChanged = false;
            this._isSaved = true;
            this.dictionary.reload();
        });
    }

    reloadChapter(id?: number) {
        getChapter(id ? id : this.chapter.id).then(c => this.updateData(c));
    }

    reloadFrame(chapterId: number, frameNumber: number) {
        getFrame(chapterId, frameNumber).then((frame: Frame) => this.chapter.frames[this.selectedFrameIndex] = frame);
    }

    reset() {
        this.clear();
        this.chapterService.reset();
    }

    private createEmptyFrame(): Frame {
        const frameNumber: number = this.chapter.frames.length + 1;
        return {
            chapterId: this.chapter.id,
            frameNumber: frameNumber,
            switchData: {
                chapterId: this.chapter.id,
                frameNumber: frameNumber
            }
        };
    }

    private updateData(chapter: Chapter) {
        this.clear();
        if (this.chapterService.selectedIndex == -1) {
            this.chapterService.selectElement(0);
        }
        this.chapterService.updateChapter(chapter, true);
    }

    private updateFrameNumbers() {
        this.chapter.frames.forEach((f, i) => {
            f.frameNumber = i + 1;
            if (f.switchData) {
                f.switchData.frameNumber = f.frameNumber;
            }
        });
    }

    private clear() {
        this._isChanged = false;
        this._isSaved = false;
        this.selectedFrameIndex = 0;
    }
}
