import { initialState } from '../initialState';
import {ISettingsReducer} from '../interfaces';

type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V

export type ActionType =
    | Action<'SET_SIDEBAR_AUTO_HIDING', { value: boolean }>
    | Action<'SET_EXAM_MODE_ENABLE', { value: boolean }>
    | Action<'SET_VOICE_TASK_ENABLE', { value: boolean }>
    | Action<'SET_VOICE_HINT_ENABLE', { value: boolean }>
    | Action<'SET_VOICE_VOLUME', { value: number }>

export default (
    state:ISettingsReducer = initialState.settingsReducer,
    action:ActionType
):ISettingsReducer => {

    switch (action.type) {
        case 'SET_SIDEBAR_AUTO_HIDING':
            return {...state, sidebarAutoHiding: action.value};

        case 'SET_EXAM_MODE_ENABLE':
            return {...state, examMode: action.value};

        case 'SET_VOICE_TASK_ENABLE':
            return {...state, voiceTaskEnable: action.value};

        case 'SET_VOICE_HINT_ENABLE':
            return {...state, voiceHintEnable: action.value};

        case 'SET_VOICE_VOLUME':
            return {...state, voiceVolume: action.value / 10};

        default:
            return state;
    }

}