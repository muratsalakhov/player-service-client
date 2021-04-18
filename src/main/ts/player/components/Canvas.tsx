import React, {useRef, useEffect, useState, useCallback} from 'react';
import {IFrame, IPointCoords, IState} from "../interfaces";
import {
    MISTAKE_COUNT,
    NEXT_FRAME,
    SET_DRAG_CURRENT_PICTURE,
    SET_HINT_PICTURE,
    SET_ZOOM
} from "../actions/scriptActions";
import {connect, ConnectedProps} from "react-redux";
import {mouse} from "../globals";
import getMouseCoords from "../utils/getMouseCoords";
import {chClick, chDrag} from "../services/checkEvent";
import {showHint} from "../services/hint";

const hintTimeOut = 2500;

interface ClassicProps {}

const mapState = (state:IState) => {
    const r = state.scriptsReducer;
    const selectedFrame:IFrame | null = r.selectedFrameId ? r.frames[r.selectedFrameId] : null;

    return {
        selectedScript: r.selectedScriptId ? r.scripts[r.selectedScriptId] : null,
        selectedFrame,
        canvasZoom: state.scriptsReducer.canvasZoom,
        pictureData: r.hintPicture || r.dragCurrentPicture || selectedFrame?.pictureData,
        width: r.selectedChapterId ? r.chapters[r.selectedChapterId].pictureWidth : 0,
        height: r.selectedChapterId ? r.chapters[r.selectedChapterId].pictureHeight : 0,
        mistakeCounter: r.mistakeCounter,
        examMode: state.settingsReducer.examMode
    }
};

const mapDispatch = {
    setDragCurrentPicture: SET_DRAG_CURRENT_PICTURE,
    setHintPicture: SET_HINT_PICTURE,
    nextFrame: NEXT_FRAME,
    setZoom: SET_ZOOM,
    mistakeCount: MISTAKE_COUNT
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const Canvas = ({
    width,
    height,
    pictureData,
    setZoom,
    selectedScript,
    selectedFrame,
    canvasZoom,
    mistakeCounter,
    mistakeCount,
    setDragCurrentPicture,
    setHintPicture,
    nextFrame,
    examMode
}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [w, setW] = useState(width);
    const [h, setH] = useState(height);

    const startResizeHandler = useCallback(() => {
        const resizeHandler = () => {
            const canvasContainer = document.getElementById('canvasContainer');
            if (!canvasContainer)
                return;
            const canvasRatioWider = width / height > canvasContainer.offsetWidth / canvasContainer.offsetHeight;
            const newW = canvasRatioWider
                ? canvasContainer.offsetWidth
                : Math.round(width * canvasContainer.offsetHeight / height);
            const newH = canvasRatioWider
                ? Math.round(height * canvasContainer.offsetWidth / width)
                : canvasContainer.offsetHeight;
            setW(newW);
            setH(newH);
            setZoom(width / newW);
        };
        window.addEventListener('resize' , resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, [height, setZoom, width]);

    useEffect(startResizeHandler, []);

    const clear = useCallback(() => {
        // Clear
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                const transparentImageData = context.createImageData(width, height);
                context.putImageData(transparentImageData, 0, 0);
            }
        }
        if (!pictureData)
            return;
        const context = canvasRef.current!.getContext('2d');
        context!.drawImage(pictureData, 0, 0, w, h);
    }, [pictureData, w, h, width, height]);

    useEffect(clear, [pictureData, w, h]);

    const hintUpdate = useCallback(() => {
        if (!selectedScript || !selectedFrame || !canvasRef.current)
            return;
        if (mistakeCounter < 5 || examMode)
            return;
        showHint(selectedFrame.switchData, canvasRef.current, canvasZoom, setHintPicture, selectedScript.dragDelta);
        window.setTimeout(() => {
            setHintPicture(null);
        }, hintTimeOut);
    }, [canvasZoom, examMode, mistakeCounter, selectedFrame, selectedScript, setHintPicture]);

    useEffect(hintUpdate, [mistakeCounter]);

    if (!selectedScript || !selectedFrame)
        return <></>;

    const clickHandler = (e:React.MouseEvent<HTMLElement>, canvas:HTMLCanvasElement) => {
        if (e.button !== 0)
            return;

        const mouseEvent = e;
        mouseEvent.persist();

        // Если это второй клик двойного клика, но уже известно, что ошибочный, и ошибка зафиксирована
        if (mouse.waitSecondClickInDoubleClickButMistakeCounted) {
            mouse.waitSecondClickInDoubleClickButMistakeCounted = false;
            return; // Не воспринимаем клик всерьёз
        }

        // Если это второй клик двойного клика
        if (mouse.waitSecondClickInDoubleClick) {
            mouse.waitSecondClickInDoubleClick = false;

            // Проверим, есть ли именно такой двойной клик среди верных действий
            const {x, y}:IPointCoords = getMouseCoords(e, canvas, canvasZoom);
            const nextFrameId:string | null = chClick(
                {actionId: 'LeftDoubleMouseClick', x, y},
                selectedFrame.switchData
            );

            // Если нет, клик не верный
            if (!nextFrameId)
                return mistakeCount();

            // Если есть, следующий кадр
            return nextFrame(nextFrameId);
        }

        if (mouse.downAndMoved)
            return e.preventDefault();

        // Проверим, есть ли именно такой клик среди верных действий
        const {x, y}:IPointCoords = getMouseCoords(e, canvas, canvasZoom);
        let nextFrameId:string | null = chClick(
            {actionId: 'LeftMouseClick', x, y},
            selectedFrame.switchData
        );

        // Если есть, следующий кадр
        if (nextFrameId)
            return nextFrame(nextFrameId);

        // Если нет, проверим, есть ли именно такой двойной клик среди верных действий
        nextFrameId = chClick(
            {actionId: 'LeftDoubleMouseClick', x, y},
            selectedFrame.switchData
        );

        // Если нет, клик не верный
        if (!nextFrameId) {
            // Если последует двойной клик - не будем фиксировать его как ошибку, зафиксируем сейчас
            mouse.waitSecondClickInDoubleClickButMistakeCounted = true;
            window.setTimeout(() => {
                mouse.waitSecondClickInDoubleClickButMistakeCounted = false;
            }, 500, mouseEvent, canvas, canvasZoom);
            return mistakeCount();
        }


        // Если есть, ждём второго клика
        mouse.waitSecondClickInDoubleClick = true;
        window.setTimeout(() => {
            if (!mouse.waitSecondClickInDoubleClick)
                return;
            mouse.waitSecondClickInDoubleClick = false;
            mistakeCount();
        }, 500, mouseEvent, canvas, canvasZoom);
    };

    const contextMenuHandler = (e:React.MouseEvent<HTMLElement>, canvas:HTMLCanvasElement) => {
        e.preventDefault();

        // Проверим, есть ли именно такой правый клик среди верных действий
        const {x, y}:IPointCoords = getMouseCoords(e, canvas, canvasZoom);
        const nextFrameId:string | null = chClick(
            {actionId: 'RightMouseClick', x, y},
            selectedFrame.switchData
        );

        // Если нет, клик не верный
        if (!nextFrameId)
            return mistakeCount();

        // Если есть, следующий кадр
        nextFrame(nextFrameId);
    };

    const mouseDownHandler = (e:React.MouseEvent<HTMLElement>, canvas:HTMLCanvasElement | null) => {
        if (e.button !== 0)
            return;

        const mousePos:IPointCoords = getMouseCoords(e, canvas, canvasZoom);
        mouse.down = true;
        mouse.downAndMoved = false;
        mouse.keyDownPos = mousePos;
        mouse.lastMovePos = mousePos;
        mouse.isDragStart = true;
        mouse.wasDragInStartArea = false;
        mouse.isDragCorrect = true;
        mouse.clickNotMove = true;
        e.preventDefault();
    };

    const mouseUpHandler = (e:React.MouseEvent<HTMLElement>, canvas:HTMLCanvasElement) => {
        setDragCurrentPicture(null);

        if (e.button !== 0)
            return;

        mouse.down = false;
        mouse.keyDownPosReset();

        if (!mouse.downAndMoved)
            return;

        const {x, y}:IPointCoords = getMouseCoords(e, canvas, canvasZoom);

        if (mouse.clickNotMove) {
            const nextFrameId = chClick(
                {actionId: 'LeftMouseClick', x, y},
                selectedFrame.switchData
            );

            if (!nextFrameId)
                return mistakeCount();

            return nextFrame(nextFrameId);
        }

        const check = chDrag(
            {
                actionId: 'Drag',
                x, y,
                isStarted: false,
                isFinished: true,
                dragDelta: selectedScript.dragDelta,
                setWasDragInStartArea: () => mouse.wasDragInStartArea = true
            },
            selectedFrame.switchData
        );

        if (!check)
            return;

        if (!check.checkDragResult) {
            if (mouse.isDragCorrect)
                mistakeCount();
            mouse.isDragCorrect = false;
            return;
        }

        if (!check.checkDragResult.checkResult) {
            if (mouse.isDragCorrect)
                mistakeCount();
            mouse.isDragCorrect = false;
            return;
        }

        if (mouse.wasDragInStartArea)
            nextFrame(check.switchData ? check.switchData.nextFrameId : null);

        setDragCurrentPicture(null);
        mouse.isDragCorrect = false;
    };

    const mouseMoveHandler = (e:React.MouseEvent<HTMLElement>, canvas:HTMLCanvasElement) => {
        if (!mouse.down)
            return;

        if (!mouse.isDragCorrect)
            return;

        const mousePos = getMouseCoords(e, canvas, canvasZoom);

        const radiusInSquare = Math.pow(mousePos.x - mouse.lastMovePos.x, 2) +
            Math.pow(mousePos.y - mouse.lastMovePos.y, 2);

        if (radiusInSquare > 81)
            mouse.clickNotMove = false;

        if (radiusInSquare <= 81) // Уменьшаем частоту проверок
            return;

        mouse.downAndMoved = true;

        mouse.lastMovePos = mousePos;

        const check = chDrag(
            {
                actionId: 'Drag',
                x: mousePos.x,
                y: mousePos.y,
                isStarted: mouse.isDragStart,
                isFinished: false,
                dragDelta: selectedScript.dragDelta,
                setWasDragInStartArea: () => mouse.wasDragInStartArea = true
            },
            selectedFrame.switchData
        );

        mouse.isDragStart = false;

        if (!check || check.switchData!.switchEvent.actionId !== 'Drag') {
            if (mouse.isDragCorrect)
                mistakeCount();
            mouse.isDragCorrect = false;
            setDragCurrentPicture(null);
            return;
        }

        if (!check.checkDragResult!.tunnelCheckResult) {
            if (mouse.isDragCorrect)
                mistakeCount();
            mouse.isDragCorrect = false;
            return;
        }

        if (check.checkDragResult!.tunnelCheckResult && mouse.wasDragInStartArea) {
            setDragCurrentPicture(check.switchData!.switchEvent.pictures[
            check.checkDragResult!.areaNumber - 1
                ].pictureData || null);
            return;
        }

        console.log('Перетаскивание вышло за границы');
        if (mouse.isDragCorrect)
            mistakeCount();
        mouse.isDragCorrect = false;
        setDragCurrentPicture(null);
    };

    const mouseOutHandler = (e:React.MouseEvent<HTMLElement>, canvas:HTMLCanvasElement) => {
        setDragCurrentPicture(null);
        mouse.down = false;
        mouse.keyDownPosReset();
        if (mouse.downAndMoved && mouse.isDragCorrect)
            mistakeCount();
        mouse.isDragCorrect = false;
    };

    const mouseWheelHandler = (e:React.WheelEvent<HTMLElement>, canvas:HTMLCanvasElement) => {
        const suitableSwitchData = selectedFrame.switchData.find(data => {
            if (data.switchEvent.actionId !== 'ScrollUp' && data.switchEvent.actionId !== 'ScrollDown')
                return false;
            const actionId = e.deltaY < 0 ? 'ScrollUp' : 'ScrollDown';
            if (actionId !== data.switchEvent.actionId)
                return false;
            const coords = getMouseCoords(e, canvas, canvasZoom);
            return coords.x >= data.switchEvent.xleft && coords.x <= data.switchEvent.xright &&
                coords.y >= data.switchEvent.yleft && coords.y <= data.switchEvent.yright;
        });

        if (suitableSwitchData)
            return nextFrame(suitableSwitchData.nextFrameId);

        mistakeCount();
    };

    return <canvas
        ref={canvasRef}
        id='canvas'
        height={h}
        width={w}
        onClick={e => clickHandler(e, canvasRef.current!)}
        onMouseDown={e => mouseDownHandler(e, canvasRef.current!)}
        onMouseUp={e => mouseUpHandler(e, canvasRef.current!)}
        onMouseMove={e => mouseMoveHandler(e, canvasRef.current!)}
        onMouseOut={e => mouseOutHandler(e, canvasRef.current!)}
        onContextMenu={e => contextMenuHandler(e, canvasRef.current!)}
        onWheel={e => mouseWheelHandler(e, canvasRef.current!)} // IE9+, FF17+, Ch31+
    />;
};

export default connector(Canvas);