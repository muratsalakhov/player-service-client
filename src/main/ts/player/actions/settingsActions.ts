export const SET_SIDEBAR_AUTO_HIDING = (value: boolean) => {
    return {
        type: 'SET_SIDEBAR_AUTO_HIDING',
        value
    }
};

export const SET_EXAM_MODE_ENABLE = (value: boolean) => {
    return {
        type: 'SET_EXAM_MODE_ENABLE',
        value
    }
};

export const SET_VOICE_TASK_ENABLE = (value: boolean) => {
    return {
        type: 'SET_VOICE_TASK_ENABLE',
        value
    }
};

export const SET_VOICE_HINT_ENABLE = (value: boolean) => {
    return {
        type: 'SET_VOICE_HINT_ENABLE',
        value
    }
};

export const SET_VOICE_VOLUME = (value: number) => {
    return {
        type: 'SET_VOICE_VOLUME',
        value
    }
};