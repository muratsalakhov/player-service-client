import { combineReducers } from 'redux';
import scriptsReducer from './scriptsReducer';
import settingsReducer from './settingsReducer';

const allReducers = combineReducers({
    scriptsReducer,
    settingsReducer
});

export default allReducers;