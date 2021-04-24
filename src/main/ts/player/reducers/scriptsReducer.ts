import { initialState } from '../initialState';
import {IScriptsReducer, IScripts, IFrames, IScript} from '../interfaces';
import {statistics} from "../globals";

type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V

export type ActionType =
    | Action<'SET_SCRIPTS', { scripts: IScripts }>
    | Action<'SET_FRAMES', { frames: IFrames }>
    | Action<'SELECT_SCRIPT', { id: string }>
    | Action<'SELECT_FRAME', { frameId: string | null }>
    | Action<'SET_PICTURE_DATA', { frameId: string, pictureData:HTMLImageElement}>
    | Action<'SET_DRAG_PICTURE_DATA', {
        frameId: string,
        switchDataId: string,
        pictureNumber: number,
        pictureData:HTMLImageElement
    }>
    | Action<'SET_DRAG_CURRENT_PICTURE', { pictureData:HTMLImageElement | null }>
    | Action<'SET_HINT_PICTURE', { pictureData:HTMLImageElement | null }>
    | Action<'NEXT_FRAME', { nextFrameId:string | null }>
    | Action<'SET_ZOOM', { zoom:number }>
    | Action<'MISTAKE_COUNT', { count:number | undefined }>

export default (
    state:IScriptsReducer = initialState.scriptsReducer,
    action:ActionType
):IScriptsReducer => {

    switch (action.type) {
        case 'SET_SCRIPTS':
            return {...state, scripts: action.scripts};

        case 'SET_FRAMES':
            return {...state, frames: action.frames};

        case 'SELECT_SCRIPT':
            return {...state, selectedScriptId: action.id, mistakeCounter: 0};

        case 'SELECT_FRAME':
            /*if (action.frameId) {
                statistics.frames[action.frameId].mistakes = 0;
                statistics.frames[action.frameId].timeStart = new Date().getTime();
            }*/
            return {...state, selectedFrameId: action.frameId, mistakeCounter: 0};

        case 'SET_PICTURE_DATA':
            return {
                ...state,
                frames: {
                    ...state.frames,
                    [action.frameId]: {
                        ...state.frames[action.frameId],
                        pictureData: action.pictureData
                    }
                }
            };

        case 'SET_DRAG_PICTURE_DATA':
            return {
                ...state,
                frames: {
                    ...state.frames,
                    [action.frameId]: {
                        ...state.frames[action.frameId],
                        switchData: state.frames[action.frameId].actions.map(data => {
                            if (data.uid !== action.switchDataId)
                                return data;
                            if (data.actionType !== 'Drag')
                                return data;
                            return {
                                ...data,
                                switchEvent: {
                                    ...data,
                                    pictures: data.pictures.map(switchPicture => {
                                        if (switchPicture.pictureNumber !== action.pictureNumber)
                                            return switchPicture;
                                        return {...switchPicture, pictureData: action.pictureData}
                                    })
                                }
                            };
                        })
                    }
                }
            } as IScriptsReducer;

        case 'SET_DRAG_CURRENT_PICTURE':
            return {...state, dragCurrentPicture: action.pictureData};

        case 'SET_HINT_PICTURE':
            return {...state, hintPicture: action.pictureData};

        case 'NEXT_FRAME':
            return {...state, selectedFrameId: action.nextFrameId, mistakeCounter: 0, hintPicture: null};

        case 'SET_ZOOM':
            return {...state, canvasZoom: action.zoom};

        case 'MISTAKE_COUNT':
            if (state.selectedScriptId) {
                statistics.script.mistakes++;
            }
            /*if (state.selectedFrameId) {
                statistics.frames[state.selectedFrameId].mistakes++;
            }*/
            return {...state, mistakeCounter: action.count !== undefined ? action.count : state.mistakeCounter + 1};

        default:
            return state;
    }

}
