import React, {useCallback, useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import '../../../css/player/app.css';
import {IFrame, IState, ISwitchData} from "../interfaces";
import { connect, ConnectedProps } from "react-redux";
import Canvas from "../components/Canvas";
import getImageData from "../utils/getImageData";
import {
    MISTAKE_COUNT,
    NEXT_FRAME,
    //SELECT_CHAPTER,
    SELECT_FRAME,
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
    /*const selectedChapterIndex = selectedScript
        ? selectedScript.chapters.findIndex(id => id === r.selectedChapterId)
        : null;*/
    /*const nextChapterId = (selectedScript && selectedChapterIndex !== null)
        ? selectedScript.chapters[selectedChapterIndex + 1]
        : null;
    const nextChapter = nextChapterId ? r.chapters[nextChapterId] : null;*/
    return {
        frames: state.scriptsReducer.frames,
        selectedScript,
        //selectedChapterId: r.selectedChapterId,
        selectedFrame,
        selectedFrameId: selectedFrame?.uid,
        //nextChapter,
    }
};

const mapDispatch = {
    setPictureData: SET_PICTURE_DATA,
    setDragPictureData: SET_DRAG_PICTURE_DATA,
    nextFrame: NEXT_FRAME,
    mistakeCount: MISTAKE_COUNT,
    //selectChapter: SELECT_CHAPTER,
    selectFrame: SELECT_FRAME
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const PlayerPage = ({ frames, selectedScript, /*selectedChapterId,*/ selectedFrame, selectedFrameId, /*nextChapter,*/
    setPictureData, setDragPictureData, nextFrame, mistakeCount, /*selectChapter,*/ selectFrame}: Props) => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const framesWait = useCallback(() => {
        console.log("framesWait");
        if (!frames[selectedFrameId!])
            return;
        if (!frames[selectedFrameId!].pictureData)
            return setLoading(true);
        setLoading(false);
    }, [frames, selectedFrameId]);

    useEffect(framesWait, [frames[selectedFrameId!]]);

    const bufferUpdate = useCallback(() => {
        console.log("bufferUpdate");
        if (!selectedFrameId || !selectedFrame)
            return;
        statistics.script = {
            ...statistics.script,
            timeStart: new Date().getTime(),
            mistakes: 0
        };

        // buffering images
        // setLoading(true);
        const bufferingNextFrames = (frame:IFrame, previousImage:HTMLImageElement | undefined) => {
            console.log("bufferingNextFrames");
            const nextFrameIds = frame.actions.map(sw => sw.nextFrame.uid);
            nextFrameIds.forEach(nextFrameId => {
                console.log("bufferingNextFrames-foreach");
                if (nextFrameId && frames[nextFrameId] && !frames[nextFrameId].pictureData)
                    console.log("FRAME");
                    console.log(frame)
                    bufferingFrame(frames[nextFrameId], frame.pictureData);
            });
        };

        const bufferingFrame = (frame:IFrame, previousImage:HTMLImageElement | undefined) => {

            console.log("bufferingFrame");
            new Promise<void>(resolve => {
                if (frame.pictureData)
                    return resolve();

                getImageData(frame.pictureLink, previousImage)
                    .then(imageData => {
                        console.log("getImageData");
                        setPictureData(frame.uid, imageData);
                        //frame.pictureData = imageData;

                        let switchDataPromises: Array<Promise<void>> = [];

                        // get pictures
                        frame.actions.forEach(data => {
                            if (data.actionType !== 13)
                                return;

                            switchDataPromises = [...switchDataPromises,
                                ...data.pictures.map(switchPicture => {
                                    return getImageData(switchPicture.pictureLink, imageData)
                                        .then(imageData => {
                                            setDragPictureData(
                                                frame.uid,
                                                data.uid,
                                                switchPicture.pictureNumber,
                                                imageData
                                            );
                                        })
                                })
                            ];
                        });

                        Promise.all(switchDataPromises).then(() => {
                            resolve();
                            bufferingNextFrames(frame, frame.pictureData);
                        })
                    });
            });
        };

        bufferingFrame(selectedFrame, undefined);
    }, [frames, selectedFrame, selectedFrameId, setDragPictureData, setPictureData]);

    useEffect(bufferUpdate, [selectedScript]);

    const clearStatistic = useCallback(() => {
        console.log("clearStatistic");

        if (!selectedScript)
            return;
        // Если загружен первый раздел сценария
        statistics.script = {...statistics.script, timeStart: new Date().getTime()};
    }, [selectedScript]);

    useEffect(clearStatistic, [selectedScript]);

    const framePrepare = useCallback(() => {
        //console.log("frame statistic start");
        //console.log("framePrepare");

        /*statistics.frames = {
            ...statistics.frames,
            [selectedFrameId]: {
                ...statistics.frames[selectedFrameId],
                mistakes: 0,
                timeStart: new Date().getTime()
            }
        };*/
        const keyUpHandler = (key:number, modKey:number | null) => {

            console.log("keyUpHandler");
            if (!selectedFrame || !selectedScript)
                return;

            const suitableSwitchData = selectedFrame.actions.find(data => {
                console.log("suitableSwitchData");
                console.log(data);
                if (data.actionType === 9)
                    return key === data.key && !modKey;
                if (data.actionType === 12)
                    return key === data.key && modKey === data.modKey;
                return false;
            });

            if (suitableSwitchData)
                return nextFrame(suitableSwitchData.nextFrame.uid);

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
        } = checkDuration(selectedFrame.actions);
        if (durationActionResult.duration !== null) {
            timers.actionDuration = window.setTimeout(() => {
                nextFrame(durationActionResult.nextFrameId);
            }, durationActionResult.duration);
            return;
        }

        console.log("frame statistic finsih");

        return () => {
            keyboardListenerSwitchOff();
            clearTimeout(timers.actionDuration);
        }
    }, [nextFrame, selectedFrame, selectedFrameId, mistakeCount, selectedScript]);

    useEffect(framePrepare, [selectedFrameId]);

    console.log("SELECTED SCRIPT", selectedFrame);
    if (!selectedFrame) {
        statistics.script = {
            ...statistics.script,
            timeFinish: new Date().getTime(),
            totalTime: statistics.script.timeFinish - statistics.script.timeStart
        };
        history.push('/result');
        return null;
    }

    return <div className="playerContainer" onContextMenu={e => e.preventDefault()}>
        <div className="header">
            <div className="task">
                {selectedFrame.taskText}
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
