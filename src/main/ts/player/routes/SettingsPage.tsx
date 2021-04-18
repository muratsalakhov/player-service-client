import React from 'react';
import '../../../css/player/app.css';
import {IState} from "../interfaces";
import { connect, ConnectedProps } from "react-redux";
import { Button } from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {
    SET_EXAM_MODE_ENABLE,
    SET_SIDEBAR_AUTO_HIDING,
    SET_VOICE_HINT_ENABLE,
    SET_VOICE_TASK_ENABLE, SET_VOICE_VOLUME
} from "../actions/settingsActions";

type ClassicProps = {};

const mapState = (state:IState) => {return {
    scripts: state.scriptsReducer.scripts,
    chapters: state.scriptsReducer.chapters,
    frames: state.scriptsReducer.frames,
    selectedScript: state.scriptsReducer.selectedScriptId,
    selectedChapter: state.scriptsReducer.selectedChapterId,
    selectedFrame: state.scriptsReducer.selectedFrameId,
    sidebarAutoHiding: state.settingsReducer.sidebarAutoHiding,
    examMode: state.settingsReducer.examMode,
    voiceTaskEnable: state.settingsReducer.voiceTaskEnable,
    voiceHintEnable: state.settingsReducer.voiceHintEnable,
    voiceVolume: state.settingsReducer.voiceVolume
}};

const mapDispatch = {
    setSidebarAutoHiding: SET_SIDEBAR_AUTO_HIDING,
    setExamMode: SET_EXAM_MODE_ENABLE,
    setVoiceTaskEnable: SET_VOICE_TASK_ENABLE,
    setVoiceHintEnable: SET_VOICE_HINT_ENABLE,
    setVoiceVolume: SET_VOICE_VOLUME
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const SettingsPage = ({ scripts, chapters, frames, sidebarAutoHiding, setSidebarAutoHiding,
    selectedScript, selectedChapter, selectedFrame, examMode, setExamMode, voiceTaskEnable, setVoiceTaskEnable,
    voiceHintEnable, setVoiceHintEnable, setVoiceVolume, voiceVolume}:Props) => {
    let history = useHistory();

    if (!selectedScript ||
        !selectedChapter ||
        !selectedFrame ||
        !scripts[selectedScript] ||
        !chapters[selectedChapter] ||
        !frames[selectedFrame]) {
        history.push('/');
        return <></>;
    }

    const OnOffButton = ({state, onClick}:{state:boolean, onClick:() => any}) => (
        <Button
            onClick={onClick}
            title='Изменить'
            variant='contained'
            style={{background: '#fafafa', marginBottom: '0.5em'}}
        >
            {state
                ? <span style={{color: '#2cb800'}}>
                    ✔ включено
                </span>
                : <span>
                    ✘ выключено
                </span>
            }
        </Button>
    );

    return <div className="App" onContextMenu={e => e.preventDefault()}>
        <header className="App-header">
            <div style={{margin: '1em'}}>
                <h1>Настройки:</h1>

                <div style={{textAlign: 'left', marginBottom: '1em'}}>
                    <div>
                        {'Автоскрытие боковой панели: '}
                        <OnOffButton
                            state={sidebarAutoHiding}
                            onClick={() => setSidebarAutoHiding(!sidebarAutoHiding)}
                        />
                    </div>

                    <div>
                        {'Режим экзамена: '}
                        <OnOffButton
                            state={examMode}
                            onClick={() => setExamMode(!examMode)}
                        />
                    </div>

                    <div>
                        {'Озвучивать задания, если доступно: '}
                        <OnOffButton
                            state={voiceTaskEnable}
                            onClick={() => setVoiceTaskEnable(!voiceTaskEnable)}
                        />
                    </div>

                    <div>
                        {'Озвучивать подсказки, если доступно: '}
                        <OnOffButton
                            state={voiceHintEnable}
                            onClick={() => setVoiceHintEnable(!voiceHintEnable)}
                        />
                    </div>

                    <div>
                        {'Громкость: '}
                        <input
                            type='range'
                            min={0}
                            max={10}
                            defaultValue={voiceVolume * 10}
                            onChange={e => setVoiceVolume(parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <Button onClick={() => history.push('/change_chapter')} variant='contained'
                        style={{background: '#4791d3', color: 'white', fontWeight: 'bold'}}>
                    Начать
                </Button>

                <br/><br/>

                <Button onClick={() => history.push('/')} variant='contained' style={{margin: '1em 0.5em',
                    background: '#fafafa'}}>
                    {'< Назад'}
                </Button>
            </div>
        </header>
    </div>;
};

export default connector(SettingsPage);