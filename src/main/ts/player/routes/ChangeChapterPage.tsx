import React, {useCallback, useEffect, useRef} from 'react';
import '../../../css/player/app.css';
import {IState} from "../interfaces";
import { connect, ConnectedProps } from "react-redux";
import {LinearProgress, Button} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {timers} from "../globals";

type ClassicProps = {};

const mapState = (state:IState) => {return {
    scripts: state.scriptsReducer.scripts,
    chapters: state.scriptsReducer.chapters,
    frames: state.scriptsReducer.frames,
    selectedScript: state.scriptsReducer.selectedScriptId,
    selectedChapter: state.scriptsReducer.selectedChapterId,
    selectedFrame: state.scriptsReducer.selectedFrameId,
}};

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const ChangeChapterPage = ({ scripts, chapters, frames,
    selectedScript, selectedChapter, selectedFrame}:Props) => {
    let history = useHistory();
    const [progress, setProgress] = React.useState(0);
    const _isMounted = useRef(true);

    const startProgressUpdater = useCallback(() => {
        const timeToRead = selectedChapter ? (chapters[selectedChapter].name.length * 70 / 10) : 0;
        timers.changeChapter = window.setInterval(() => {
            setProgress(oldProgress => {
                if (!_isMounted.current || oldProgress > 100) {
                    clearInterval(timers.changeChapter);
                    return 100;
                }
                return oldProgress + 10;
            });
        }, 250 + timeToRead);
        return () => {
            _isMounted.current = false;
            clearInterval(timers.changeChapter);
            setProgress(0);
        }
    }, [chapters, selectedChapter]);

    useEffect(startProgressUpdater, []);

    const goToPlayer = useCallback(() => {
        if (progress > 100)
            history.push('/player');
    }, [progress, history]);

    useEffect(goToPlayer, [progress]);

    if (!selectedScript ||
        !selectedChapter ||
        !selectedFrame ||
        !scripts[selectedScript] ||
        !chapters[selectedChapter] ||
        !frames[selectedFrame]) {
        history.push('/');
        return <></>;
    }

    return <div className="App" onContextMenu={e => e.preventDefault()}>
        <header className="App-header">
            <div style={{margin: '1em'}}>
                {'Выбран раздел '}<b>"{chapters[selectedChapter].name}"</b>

                <br/><br/>

                <LinearProgress variant="determinate" value={progress} style={{width: '100%'}}/>

                <br/><br/>

                <Button onClick={() => history.push('/player')} variant='contained'
                        style={{background: '#4791d3', color: 'white', fontWeight: 'bold'}}>
                    Начать
                </Button>
            </div>
        </header>
    </div>;
};

export default connector(ChangeChapterPage);