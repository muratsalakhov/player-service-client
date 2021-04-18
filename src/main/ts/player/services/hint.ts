import {ISquareCoords, ISwitchData, ISwitchEvent} from "../interfaces";

const color = [247, 224, 29, 240]; // rgba
const fillStyle = `rgb(${color.join(', ')})`;

export const showHint = (
    switchData:Array<ISwitchData>,
    canvas:HTMLCanvasElement,
    canvasZoom: number,
    setHintPicture:(imageData:HTMLImageElement | null) => void,
    dragDelta:number
) => {
    if (!switchData.length)
        return;
    switch (switchData[0].switchEvent.actionId) {
        case 'LeftMouseClick':
        case 'LeftDoubleMouseClick':
        case 'RightMouseClick':
        case 'ScrollUp':
        case 'ScrollDown':
            showHintRect({
                xleft: switchData[0].switchEvent.xleft,
                yleft: switchData[0].switchEvent.yleft,
                xright: switchData[0].switchEvent.xright,
                yright: switchData[0].switchEvent.yright,
            }, canvas, canvasZoom, setHintPicture);
            break;
        case 'Drag':
            showHintPathCanvas(canvas, canvasZoom, switchData[0].switchEvent, dragDelta, setHintPicture);
            break;
    }
};

export const showHintRect = (
    coords:ISquareCoords,
    imageCanvas:HTMLCanvasElement,
    canvasZoom: number,
    setHintPicture:(imageData:HTMLImageElement | null) => void
) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageCanvas.width;
    canvas.height = imageCanvas.height;

    const context = canvas.getContext('2d');
    const contextImage = imageCanvas.getContext('2d');
    if (!context || !contextImage)
        return;

    context.fillStyle = fillStyle;
    context.fillRect(
        coords.xleft / canvasZoom,
        coords.yleft / canvasZoom,
        coords.xright / canvasZoom - coords.xleft / canvasZoom,
        coords.yright / canvasZoom - coords.yleft / canvasZoom);

    const imgData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    // Прозрачность
    const imgDataOriginal = contextImage.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === color[0] && imgData.data[i + 1] === color[1] && imgData.data[i + 2] === color[2]) {
            // imgData.data[i + 3] = 0;
            imgData.data[i] = imgDataOriginal.data[i];
            imgData.data[i + 1] = imgDataOriginal.data[i + 1];
            imgData.data[i + 2] = imgDataOriginal.data[i + 2];
        }
        else {
            imgData.data[i]     = color[0];
            imgData.data[i + 1] = color[1];
            imgData.data[i + 2] = color[2];
            imgData.data[i + 3] = color[3];
        }
    }
    context.putImageData(imgData, 0, 0);

    const resultImage = new Image();
    resultImage.onload = () => setHintPicture(resultImage);
    resultImage.src = canvas.toDataURL("image/png");
};

export const showHintPathCanvas = (
    imageCanvas:HTMLCanvasElement,
    canvasZoom:number,
    dragEvent:ISwitchEvent,
    dragDelta:number,
    setHintPicture:(imageData:HTMLImageElement | null) => void
) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageCanvas.width;
    canvas.height = imageCanvas.height;

    const context = canvas.getContext('2d');
    const contextImage = imageCanvas.getContext('2d');
    if (!context || !contextImage)
        return;

    let i, xyCenterArea = [];
    context.fillStyle = fillStyle;

    xyCenterArea.push({
        x: (dragEvent.xstartRight - dragEvent.xstartLeft) / 2 + dragEvent.xstartLeft + 1,
        y: (dragEvent.ystartRight - dragEvent.ystartLeft) / 2 + dragEvent.ystartLeft + 1
    });
    for (i = 0; i < dragEvent.pictures.length; i++) {
        const switchPicture = dragEvent.pictures[i];
        xyCenterArea.push({
            x: switchPicture.x + 1,
            y: switchPicture.y + 1
        });
    }
    xyCenterArea.push({
        x: (dragEvent.xendRight - dragEvent.xendLeft) / 2 + dragEvent.xendLeft + 1,
        y: (dragEvent.yendRight - dragEvent.yendLeft) / 2 + dragEvent.yendLeft + 1
    });

    context.fillRect(dragEvent.xstartLeft / canvasZoom, dragEvent.ystartLeft / canvasZoom,
        dragEvent.xstartRight / canvasZoom - dragEvent.xstartLeft / canvasZoom + 1,
        dragEvent.ystartRight / canvasZoom - dragEvent.ystartLeft / canvasZoom + 1);
    context.fillRect(dragEvent.xendLeft / canvasZoom, dragEvent.yendLeft / canvasZoom,
        dragEvent.xendRight / canvasZoom - dragEvent.xendLeft / canvasZoom + 1,
        dragEvent.yendRight / canvasZoom - dragEvent.yendLeft / canvasZoom + 1);

    const xyCenterAreaLength = xyCenterArea.length;
    for(i = 0; i < xyCenterAreaLength - 1; i++) {
        // Тоннель
        context.beginPath();
        context.moveTo(xyCenterArea[i].x / canvasZoom, xyCenterArea[i].y / canvasZoom);
        context.lineTo(xyCenterArea[i + 1].x / canvasZoom, xyCenterArea[i + 1].y / canvasZoom);
        context.strokeStyle = fillStyle;
        context.lineWidth = dragDelta / canvasZoom * 2;
        context.stroke();

        // Область перегиба
        if (i > 0) {
            context.beginPath();
            context.arc(xyCenterArea[i].x / canvasZoom, xyCenterArea[i].y / canvasZoom, dragDelta / canvasZoom, 0, 2*Math.PI, false);
            context.fillStyle = fillStyle;
            context.strokeStyle = fillStyle;
            context.fill();
            context.lineWidth = 1;
            context.stroke();
        }
    }

    const imgData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);

    // Инвертируем прозрачность
    const imgDataOriginal = contextImage.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    for (i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === color[0] && imgData.data[i + 1] === color[1] && imgData.data[i + 2] === color[2]) {
            // imgData.data[i + 3] = 0;
            imgData.data[i] = imgDataOriginal.data[i];
            imgData.data[i + 1] = imgDataOriginal.data[i + 1];
            imgData.data[i + 2] = imgDataOriginal.data[i + 2];
        }
        else {
            imgData.data[i]     = color[0];
            imgData.data[i + 1] = color[1];
            imgData.data[i + 2] = color[2];
            imgData.data[i + 3] = color[3];
        }
    }

    context.putImageData(imgData, 0, 0);
    const resultImage = new Image();
    resultImage.onload = () => setHintPicture(resultImage);
    resultImage.src = canvas.toDataURL("image/png");
};