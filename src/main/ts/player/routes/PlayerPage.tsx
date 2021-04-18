import React, {useCallback, useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import '../../../css/player/app.css';
import {IFrame, IState} from "../interfaces";
import { connect, ConnectedProps } from "react-redux";
import Canvas from "../components/Canvas";
import getImageData from "../utils/getImageData";
import {
    MISTAKE_COUNT,
    NEXT_FRAME,
    SELECT_CHAPTER, SELECT_FRAME,
    SET_DRAG_PICTURE_DATA,
    SET_PICTURE_DATA
} from "../actions/scriptActions";
import keyboardListener, {keyboardListenerSwitchOn, keyboardListenerSwitchOff} from '../services/keyboardListener';
import {CircularProgress, Button} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Dehaze';
import MistakeIndicator from "../components/MistakeIndicator";
import Sidebar from "../components/Sidebar";
import {checkDuration} from "../services/checkEvent";
import {statistics, timers} from "../globals";
import Audio from "../components/Audio";

type ClassicProps = {};

const mapState = (state:IState) => {
    const r = state.scriptsReducer;
    const selectedScript = r.selectedScriptId ? r.scripts[r.selectedScriptId] : null;
    const selectedFrame:IFrame | null = r.selectedFrameId ? r.frames[r.selectedFrameId] : null;
    const selectedChapterIndex = selectedScript
        ? selectedScript.chapters.findIndex(id => id === r.selectedChapterId)
        : null;
    const nextChapterId = (selectedScript && selectedChapterIndex !== null)
        ? selectedScript.chapters[selectedChapterIndex + 1]
        : null;
    const nextChapter = nextChapterId ? r.chapters[nextChapterId] : null;
    return {
        frames: state.scriptsReducer.frames,
        selectedScript,
        selectedChapterId: r.selectedChapterId,
        selectedFrame,
        selectedFrameId: selectedFrame?.frameId,
        nextChapter,
    }
};

const mapDispatch = {
    setPictureData: SET_PICTURE_DATA,
    setDragPictureData: SET_DRAG_PICTURE_DATA,
    nextFrame: NEXT_FRAME,
    mistakeCount: MISTAKE_COUNT,
    selectChapter: SELECT_CHAPTER,
    selectFrame: SELECT_FRAME
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const PlayerPage = ({ frames, selectedScript, selectedChapterId, selectedFrame, selectedFrameId, nextChapter,
    setPictureData, setDragPictureData, nextFrame, mistakeCount, selectChapter, selectFrame}: Props) => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const framesWait = useCallback(() => {
        if (!frames[selectedFrameId!])
            return;
        if (!frames[selectedFrameId!].pictureData)
            return setLoading(true);
        setLoading(false);
    }, [frames, selectedFrameId]);

    useEffect(framesWait, [frames[selectedFrameId!]]);

    const bufferUpdate = useCallback(() => {
        if (!selectedChapterId || !selectedFrameId || !selectedFrame)
            return;
        statistics.chapters = {
            ...statistics.chapters,
            [selectedChapterId]: {
                ...statistics.chapters[selectedChapterId],
                timeStart: new Date().getTime(),
                mistakes: 0
            }
        };

        // buffering images
        // setLoading(true);
        const bufferingNextFrames = (frame:IFrame, previousImage:HTMLImageElement | undefined) => {
            const nextFrameIds = frame.switchData.map(sw => sw.nextFrameId);
            nextFrameIds.forEach(nextFrameId => {
                if (nextFrameId && frames[nextFrameId] && !frames[nextFrameId].pictureData)
                    bufferingFrame(frames[nextFrameId], previousImage);
            });
        };

        const bufferingFrame = (frame:IFrame, previousImage:HTMLImageElement | undefined) => {
            new Promise<void>(resolve => {
                if (frame.pictureData)
                    return resolve();

                getImageData(frame.pictureLink, previousImage)
                    .then(imageData => {
                        setPictureData(frame.frameId, imageData);

                        let switchDataPromises: Array<Promise<void>> = [];

                        // get pictures
                        frame.switchData.forEach(data => {
                            if (data.switchEvent.actionId !== 'Drag')
                                return;

                            switchDataPromises = [...switchDataPromises,
                                ...data.switchEvent.pictures.map(switchPicture => {
                                    return getImageData(switchPicture.pictureLink, imageData)
                                        .then(imageData => {
                                            setDragPictureData(
                                                frame.frameId,
                                                data.id,
                                                switchPicture.pictureNumber,
                                                imageData
                                            );
                                        })
                                })
                            ];
                        });

                        Promise.all(switchDataPromises).then(() => {
                            resolve();
                            bufferingNextFrames(frame, previousImage);
                        })
                    });
            });
        };

        bufferingFrame(selectedFrame, undefined);
    }, [frames, selectedChapterId, selectedFrame, selectedFrameId, setDragPictureData, setPictureData]);

    useEffect(bufferUpdate, [selectedChapterId]);

    const clearStatistic = useCallback(() => {
        if (!selectedScript || !selectedScript.chapters[0])
            return;
        if (selectedChapterId !== selectedScript.chapters[0])
            return;
        // Если загружен первый раздел сценария
        statistics.script = {...statistics.script, timeStart: new Date().getTime()};
    }, [selectedScript, selectedChapterId]);

    useEffect(clearStatistic, [selectedScript]);

    const framePrepare = useCallback(() => {
        const keyUpHandler = (key:number, modKey:number | null) => {
            if (!selectedFrame || !selectedScript)
                return;

            const suitableSwitchData = selectedFrame.switchData.find(data => {
                if (data.switchEvent.actionId === 'KeyboardClick')
                    return key === data.switchEvent.key && !modKey;
                if (data.switchEvent.actionId === 'KeyboardModClick')
                    return key === data.switchEvent.key && modKey === data.switchEvent.modKey;
                return false;
            });

            if (suitableSwitchData)
                return nextFrame(suitableSwitchData.nextFrameId);

            mistakeCount();
        };

        keyboardListenerSwitchOn();
        keyboardListener.on('keyup', keyUpHandler);

        if (!selectedFrame || !selectedFrameId) {
            //history.push("/");
            return;
        }

        // Если есть тип сыбытия "Пауза"
        const durationActionResult:{
            duration:number | null
            nextFrameId:string | null
        } = checkDuration(selectedFrame.switchData);
        if (durationActionResult.duration !== null) {
            timers.actionDuration = window.setTimeout(() => {
                nextFrame(durationActionResult.nextFrameId);
            }, durationActionResult.duration);
            return;
        }

        return () => {
            keyboardListenerSwitchOff();
            clearTimeout(timers.actionDuration);
        }
    }, [nextFrame, selectedFrame, selectedFrameId, mistakeCount, selectedScript]);

    useEffect(framePrepare, [selectedFrameId]);

    if (!selectedFrame) {
        if (selectedChapterId)
            statistics.chapters = {
                ...statistics.chapters,
                [selectedChapterId]: {
                    ...statistics.chapters[selectedChapterId],
                    timeFinish: new Date().getTime()
                }
            };
        if (!nextChapter) {
            if (selectedChapterId)
                statistics.script = {...statistics.script, timeFinish: new Date().getTime()};
            history.push('/result');
            return null;
        }
        selectChapter(nextChapter.id);
        selectFrame(nextChapter.frames[0]);
        history.push("/change_chapter");
        return null;
    }

    return <div className="playerContainer" onContextMenu={e => e.preventDefault()}>
        <div className="header">
            <div className="task">
                {selectedFrame.taskText.text}
            </div>
            <Button
                className='buttonMenu'
                onClick={() => history.push('/')}
                title='Меню обучающих программ'
                style={{color: 'white'}}
            >
                <MenuIcon/>
            </Button>
        </div>
        <div className="playerContainerRow">
            <div className="canvasContainer" id="canvasContainer">
                {loading
                    ? <CircularProgress/>
                    : <Canvas/>
                }
            </div>

            <Sidebar/>

            <Audio/>

            <MistakeIndicator/>
        </div>
    </div>;
};

export default connector(PlayerPage);