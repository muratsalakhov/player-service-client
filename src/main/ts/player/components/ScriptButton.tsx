import React, {useCallback, useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import '../../../css/player/app.css';
import {IChapter, IChapters, IChapterWithFullFrames, IFrames, IState} from "../interfaces";
import {
    SELECT_CHAPTER,
    SELECT_FRAME,
    SELECT_SCRIPT,
    SET_CHAPTERS,
    SET_FRAMES,
    SET_SCRIPTS
} from "../actions/scriptActions";
import { connect, ConnectedProps } from "react-redux";
import {Button} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import {statistics} from "../globals";
import {getChapter, getChapters} from "../services/requests";

type ClassicProps = {
    scriptId: string,
    index: number
};

const mapState = (state:IState, props:ClassicProps) => {return {
    scripts: state.scriptsReducer.scripts,
    chapters: state.scriptsReducer.chapters,
    frames: state.scriptsReducer.frames,
    selectedScript: state.scriptsReducer.selectedScriptId,
    selectedChapter: state.scriptsReducer.selectedChapterId,
    selectedFrame: state.scriptsReducer.selectedFrameId
}};

const mapDispatch = {
    selectScript: SELECT_SCRIPT,
    selectChapter: SELECT_CHAPTER,
    selectFrame: SELECT_FRAME,
    setScripts: SET_SCRIPTS,
    setChapters: SET_CHAPTERS,
    setFrames: SET_FRAMES
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const ScriptButton = ({ scriptId, index, scripts, chapters, frames,
                          selectedScript, selectedChapter, selectedFrame,
                          selectScript, selectChapter, selectFrame,
                          setScripts, setChapters, setFrames}:Props) => {
    let history = useHistory();
    const [scriptError, setScriptError] = useState<string | null>(null);

    const clickHandler = () => {
        selectScript(scriptId);
        statistics.chapters = {};
        getChapters()
            .then((chaptersResponse: Array<IChapter>) => {
                const chaptersOfScript = chaptersResponse.filter(chapter => chapter.scriptId === scriptId);
                const firstChapter:IChapter | undefined = chaptersOfScript.find(
                    (chapter:IChapter) => chapter.scriptId === scriptId && chapter.chapterNumber === 1
                );
                if (!firstChapter)
                    return setScriptError('Не удалось найти первый раздел обучающей программы');
                const chapters:IChapters = {};
                chaptersOfScript.forEach(chapter => chapters[chapter.id] = chapter);
                selectChapter(firstChapter.id);

                getChapter(firstChapter.id)
                    .then((response:IChapterWithFullFrames) => {
                        if (response.frames.length === 0)
                            return setScriptError('Не удалось загрузить информацию о кадрах');
                        const frames:IFrames = {};
                        response.frames.forEach(frame => frames[frame.frameId] = {
                            ...frame,
                            pictureLink: '/data/' + frame.pictureLink
                        });
                        setFrames(frames);
                        selectFrame(response.frames[0].frameId);

                        setChapters({
                            ...chapters,
                            [firstChapter.id]: {
                                ...firstChapter,
                                frames: response.frames.map(frame => frame.frameId)
                            }
                        });

                        setScripts({
                            ...scripts,
                            [scriptId]: {
                                ...scripts[scriptId],
                                chapters: chaptersOfScript
                                    .sort((a:IChapter, b:IChapter) => {
                                        return a.chapterNumber - b.chapterNumber;
                                    })
                                    .map(chapter => chapter.id)
                            }
                        });
                    })
                    .catch(() => setScriptError('Не удалось загрузить информацию о разделе'));
            })
            .catch(() => setScriptError('Не удалось загрузить список доступных разделов'));
    };

    const goToSettings = useCallback(() => {
        if (selectedScript && selectedChapter && selectedFrame
            && Object.keys(scripts).length && Object.keys(chapters) && Object.keys(frames)
            && scripts[selectedScript].chapters)
            history.push("/settings");
    }, [selectedScript, selectedChapter, selectedFrame, scripts, chapters, frames, history]);

    useEffect(goToSettings, [selectedScript, selectedChapter, selectedFrame, scripts, chapters, frames]);

    return (
        <div style={{textAlign: 'left'}}>
            <Button
                onClick={clickHandler}
                style={{display: 'block', width: '100%', textAlign: 'left', margin: '1em 0', background: '#fafafa'}}
                variant='contained'
            >
                <span style={{fontWeight: 'bold'}}>
                    {`${index + 1}. ${scripts[scriptId].name}`}
                </span>
                <br/>
                {/*todo: list of chapter names in script button*/}
                {/*<span style={{color: '#999', paddingLeft: '1em'}}>{'Разделы: '}</span>*/}
                {/*{scripts[scriptId].chapters.map(chapterId => chapters[chapterId].name).join(', ')}*/}
                {scriptError && <><br/><Alert severity="error">{scriptError}</Alert></>}
            </Button>
        </div>
    );
};

export default connector(ScriptButton);