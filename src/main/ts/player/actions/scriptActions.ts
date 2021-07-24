import {IScripts, IFrames} from "../interfaces";

export const SET_SCRIPTS = (scripts: IScripts) => {
    return {
        type: 'SET_SCRIPTS',
        scripts
    }
};

/*export const SET_CHAPTERS = (chapters: IChapters) => {
    return {
        type: 'SET_CHAPTERS',
        chapters
    }
};*/

export const SET_FRAMES = (frames: IFrames) => {
    return {
        type: 'SET_FRAMES',
        frames
    }
};

export const SELECT_SCRIPT = (id: string | null) => {
    return {
        type: 'SELECT_SCRIPT',
        id
    }
};

/*export const SELECT_CHAPTER = (chapterId: string | null) => {
    return {
        type: 'SELECT_CHAPTER',
        chapterId
    }
};*/

export const SELECT_FRAME = (frameId: string | null) => {
    return {
        type: 'SELECT_FRAME',
        frameId
    }
};

export const SET_PICTURE_DATA = (frameId:string, pictureData:HTMLImageElement) => {
    return {
        type: 'SET_PICTURE_DATA',
        frameId,
        pictureData
    }
};

export const SET_DRAG_PICTURE_DATA = (
    frameId: string,
    switchDataId: string,
    pictureNumber: number,
    pictureData:HTMLImageElement
) => {
    return {
        type: 'SET_DRAG_PICTURE_DATA',
        frameId,
        switchDataId,
        pictureNumber,
        pictureData
    }
};

export const SET_DRAG_CURRENT_PICTURE = (pictureData:HTMLImageElement | null) => {
    return {
        type: 'SET_DRAG_CURRENT_PICTURE',
        pictureData
    }
};

export const SET_HINT_PICTURE = (pictureData:HTMLImageElement | null) => {
    return {
        type: 'SET_HINT_PICTURE',
        pictureData
    }
};

export const NEXT_FRAME = (nextFrameId:string | null) => {
    return {
        type: 'NEXT_FRAME',
        nextFrameId
    }
};

export const SET_ZOOM = (zoom:number) => {
    return {
        type: 'SET_ZOOM',
        zoom
    }
};

export const MISTAKE_COUNT = (count:number | undefined = undefined) => {
    return {
        type: 'MISTAKE_COUNT',
        count
    }
};
