export interface IState {
    scriptsReducer: IScriptsReducer
    settingsReducer: ISettingsReducer
}

export interface IScriptsReducer {
    scripts: IScripts
    //chapters: IChapters
    frames: IFrames

    selectedScriptId: string | null
    //selectedChapterId: string | null
    selectedFrameId: string | null

    dragCurrentPicture:HTMLImageElement | null
    hintPicture:HTMLImageElement | null

    canvasZoom: number,
    mistakeCounter: number
}

export interface ISettingsReducer {
    sidebarAutoHiding: boolean
    examMode: boolean
    voiceTaskEnable: boolean
    voiceHintEnable: boolean
    voiceVolume: number
}

export interface IScripts {
    [key: string]: IScript
}

/*export interface IChapters {
    [key: string]: IChapter
}*/

export interface IFrames {
    [key: string]: IFrame
}

export interface IScript {
    uid: string
    name: string
    dragDelta: number
    dragTimeFactor: number
    scrollMoveFactor: number
    firstFrame: string
    pictureWidth: number
    pictureHeight: number
    frames: Array<IFrame>
}

export interface IScriptWithFullFrames {
    uid: string
    name: string
    dragDelta: number
    dragTimeFactor: number
    scrollMoveFactor: number
    firstFrame: string
    pictureWidth: number
    pictureHeight: number
    frames: Array<IFrame>
}

/*export interface IChapter {
    id: string
    name: string
    scriptId: string
    firstFrameId: string
    pictureWidth: number
    pictureHeight: number
    chapterNumber: number
    frames: Array<string>
}

export interface IChapterWithFullFrames {
    id: string
    name: string
    scriptId: string
    firstFrameId: string
    pictureWidth: number
    pictureHeight: number
    chapterNumber: number
    frames: Array<IFrame>
}*/

export interface IFrame {
    uid: string
    pictureLink: string
    pictureData?:HTMLImageElement
    underlying: boolean
    taskText: string
    hintText: string
    actions: Array<ISwitchData>
}

/*export interface IFrame {
    uid: string
    pictureLink: string
    pictureData?:HTMLImageElement
    underlying: boolean
    taskText: ITaskText
    hintText: IHintText
    taskVoice?: ITaskVoice
    hintVoice?: any
    actions: Array<ISwitchData>
}*/

/*
export interface ITaskText {
    id: string
    text: string
}

export interface IHintText {
    id: string
    text: string
}

export interface ITaskVoice {
    id: string
    link: string
}
*/
export type IEvent<K, V = void> = V extends void ? { actionId: K } : { actionId: K } & V

// export type IDragEvent = IEvent<'Drag', {xstartLeft: number, ystartLeft: number, xstartRight: number, ystartRight: number,
//     xendLeft: number, yendLeft: number, xendRight: number, yendRight: number,
//     pictures: Array<ISwitchPicture>
// }>;

// 1 Левый щелчок мышью
// 2 Левое нажатие мышью
// 3 Левое отжатие мышью
// 4 Двойной левый щелчок мышью
// 5 Правый щелчок мышью
// 6 Правое нажатие мышью
// 7 Правое отжатие мышью
// 8 Двойной правый щелчок мышью
// 9 Шелчок кнопки на клавиатуре
// 10 Нажатие кнопки на клавиатуре
// 11 Отжатие кнопки на клавиатуре
// 12 Кнопка на клавиатуре с модификатором
// 13 Перетаскивание
// 14 Прокрутка колесиком вверх
// 15 Прокрутка колесиком вниз
// 16 Нажатие на колесико
// 17 Пауза

// LeftMouseClick(1),
// LeftMouseDown(2),
// LeftMouseUp(3),
// LeftDoubleMouseClick(4),
// RightMouseClick(5),
// RightMouseDown(6),
// RightMouseUp(7),
// RightDoubleMouseClick(8),
// KeyboardClick(9),
// KeyboardDown(10),
// KeyboardUp(11),
// KeyboardModClick(12),
// Drag(13),
// ScrollUp(14),
// ScrollDown(15),
// WheelClick(16),
// Pause(17);

// export type ISwitchEvent =
//     | IEvent<1, { xleft: number, xright: number, yleft: number, yright: number }>
//     | IEvent<4, { xleft: number, xright: number, yleft: number, yright: number }>
//     | IEvent<5, { xleft: number, xright: number, yleft: number, yright: number }>
//     | IDragEvent
//     | IEvent<9, { key: number }>
//     | IEvent<12, { key: number, modKey: number }>
//     | IEvent<14, { xleft: number, xright: number, yleft: number, yright: number }>//todo: pictures for scroll
//     | IEvent<15, { xleft: number, xright: number, yleft: number, yright: number }>//todo: pictures for scroll
//     | IEvent<17, { duration: number }>

export interface ISwitchEvent {
    uid: string
    actionType: string
    nextFrameId: string
    duration: number
    key: number
    modKey?:number
    pictures: Array<ISwitchPicture>
    ticksCount: number
    xendLeft: number
    xendRight: number
    xLeft: number
    xRight: number
    startXLeft: number
    startYLeft: number
    startXRight: number
    startYRight: number
    finishXLeft: number
    finishYLeft: number
    finishXRight: number
    finishYRight: number
}

export type IEventForCheck =
    | IEvent<'LeftMouseClick', { x: number, y: number }>
    | IEvent<'LeftDoubleMouseClick', { x: number, y: number }>
    | IEvent<'RightMouseClick', { x: number, y: number }>
    | IEvent<'Drag', {
        x: number,
        y: number,
        isStarted: boolean,
        isFinished: boolean,
        dragDelta: number,
        setWasDragInStartArea: () => void
    }>
    | IEvent<'KeyboardClick', { key: number }>
    | IEvent<'KeyboardModClick', { key: number, modKey: number }>
    | IEvent<'ScrollUp', { xleft: number, xright: number, yleft: number, yright: number }>//todo: pictures for scroll
    | IEvent<'ScrollDown', { xleft: number, xright: number, yleft: number, yright: number }>//todo: pictures for scroll
    | IEvent<'Pause', { duration: number }>

export interface ISwitchData {
    uid: string
    actionType: string
    nextFrameId: string | null
    duration: number
    key: number
    modKey?:number
    pictures: Array<ISwitchPicture>
    ticksCount: number
    xLeft: number
    xRight: number
    yLeft: number
    yRight: number
    startXLeft: number
    startYLeft: number
    startXRight: number
    startYRight: number
    finishXLeft: number
    finishYLeft: number
    finishXRight: number
    finishYRight: number
}

export interface ISwitchPicture {
    pictureLink: string
    pictureData?:HTMLImageElement
    pictureNumber: number
    x: number
    y: number
}

export interface ISquareCoords {
    xleft: number
    xright: number
    yleft: number
    yright: number
}

export interface IPointCoords {
    x: number
    y: number
}

export interface ICheckDragResult {
    checkResult: boolean,
    tunnelCheckResult: boolean,
    areaNumber: number
}
