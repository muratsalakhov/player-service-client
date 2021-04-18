import { IState } from './interfaces';

export const initialState:IState = {
    scriptsReducer: {
        scripts: {},
        frames: {},
        selectedScriptId: null,
        selectedFrameId: null,
        dragCurrentPicture: null,
        hintPicture: null,
        canvasZoom: 1,
        mistakeCounter: 0
    },
    settingsReducer: {
        sidebarAutoHiding: true,
        examMode: false,
        voiceTaskEnable: true,
        voiceHintEnable: true,
        voiceVolume: 0.5
    }
};