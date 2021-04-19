export const mouse = {
    downAndMoved: false,
    isDragStart: true,
    wasDragInStartArea: false,
    isDragCorrect: true,
    down: false,
    clickNotMove: true,
    keyDownPos: {x: -1, y: -1},
    lastMovePos: {x: -1, y: -1},
    waitSecondClickInDoubleClick: false,
    waitSecondClickInDoubleClickButMistakeCounted: false, //todo: too long
    keyDownPosReset: () => mouse.keyDownPos = {x: -1, y: -1}
};

export const timers:{
    mistake: number
    changeChapter: number
    actionDuration: number
} = {
    mistake: 0,
    changeChapter: 0,
    actionDuration: 0,
};

export const statistics: {
    script: {
        timeStart: number,
        timeFinish: number,
        mistakes: number
    }/*,
    chapters: {
        [key: string]: {
            id: string,
            timeStart: number,
            timeFinish: number,
            mistakes: number
        }
    }*/
}= {
    script:{
        timeStart: 0,
        timeFinish: 0,
        mistakes: 0
    }/*,
    chapters: {}*/
};
