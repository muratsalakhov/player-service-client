export const enum ActionTypeName {
    None = "none",
    Mouse = "mouse",
    Keyboard = "keyboard",
    Pause = "pause",
    Drag = "drag",
    Scroll = "scroll"
}

export enum Keyboard {
    // noinspection JSUnusedGlobalSymbols
    Backspace = 8, Tab = 9, Enter = 13, Shift = 16, Ctrl = 17, Alt = 18, CapsLock = 20, Escape = 27, Space = 32
}

export interface AccountInfo {

    readonly isActive: boolean;
    readonly isAdmin: boolean;
    readonly isEditor: boolean;
}

export interface Action {
    readonly id: number, readonly name: string, readonly type: ActionType;
}

export interface ActionType {
    readonly id: number, readonly name: ActionTypeName, readonly isExtended: boolean;
}

export interface Chapter {

    readonly id: number;
    name: string;
    pictureWidth?: number;
    pictureHeight?: number;

    readonly frames?: Frame[];
}

export interface Frame {

    readonly chapterId: number;
    frameNumber: number;
    pictureLink?: string;
    isUnderlying?: boolean;

    taskTextId?: string;
    taskText?: string;
    hintTextId?: string;
    hintText?: string;

    taskVoiceId?: string;
    taskVoiceLink?: string;
    hintVoiceId?: string;
    hintVoiceLink?: string;

    readonly switchData: Switch;
}

export interface Script {

    id?: string;
    name?: string;
    isActive: boolean;
    dragDelta: number;
    dragTimeFactor: number;
    scrollMoveFactor: number;
}

export interface NewMongoScript {

    readonly script: Script;
    readonly chapters: ChapterBranchingData[];
}

export interface ChapterBranchingData {

    readonly chapterId: number;
    readonly chapterName: String;
    readonly branchPoints: ChapterBranchPoint[];
}

export interface ChapterBranchPoint {

    leftFrameNumberStart: number;
    leftFrameNumberFinish: number;

    rightChapterId?: number;
    rightFrameNumberStart: number;
    rightFrameNumberFinish: number;
}

export interface Switch {

    readonly chapterId: number;
    frameNumber: number;

    actionId?: number;
    actionSwitchId?: string;
    actionSwitch?: any;
    switchPictures?: any[];
}

export interface SwitchPicture {

    readonly actionSwitchId: string;
    readonly pictureNumber: number;

    readonly pictureLink: string;
    readonly x: number;
    readonly y: number;
}

export interface Text {
    readonly id: string, readonly text: string;
}

export class ActionSwitchDrag {
    constructor(readonly id: string, readonly startXLeft: number, readonly startYLeft: number,
                readonly startXRight: number, readonly startYRight: number,
                readonly finishXLeft: number, readonly finishYLeft: number,
                readonly finishXRight: number, readonly finishYRight: number, readonly actionId: number) {}

    createStartBounds(): Rectangle {
        return new Rectangle(this.startXRight - this.startXLeft,
            this.startYRight - this.startYLeft, this.startXLeft, this.startYLeft);
    }

    createFinishBounds(): Rectangle {
        return new Rectangle(this.finishXRight - this.finishXLeft,
            this.finishYRight - this.finishYLeft, this.finishXLeft, this.finishYLeft);
    }
}

export class ActionSwitchKeyboard {
    constructor(readonly id: string, public key: number, public modKey: number, readonly actionId: number) {}
}

export class ActionSwitchMouse {
    constructor(readonly id: string, readonly xLeft: number, readonly yLeft: number,
                readonly xRight: number, readonly yRight: number, readonly actionId: number) {}

    createBounds(): Rectangle {
        return new Rectangle(this.xRight - this.xLeft, this.yRight - this.yLeft, this.xLeft, this.yLeft);
    }
}

export class ActionSwitchPause {
    constructor(readonly id: string, readonly duration: number, readonly actionId: number) {}
}

export class ActionSwitchScroll extends ActionSwitchMouse {
    constructor(id: string, xLeft: number, yLeft: number, xRight: number, yRight: number,
                readonly ticksCount: number, actionId: number) {
        super(id, xLeft, yLeft, xRight, yRight, actionId);
    }
}

export class Rectangle {
    constructor(readonly width: number, readonly height: number, readonly x: number, readonly y: number) {}
}
