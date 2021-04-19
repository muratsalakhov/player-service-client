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
    switch (switchData[0].actionType) {
        case 'LeftMouseClick':
        case 'LeftDoubleMouseClick':
        case 'RightMouseClick':
        case 'ScrollUp':
        case 'ScrollDown':
            showHintRect({
                xleft: switchData[0].xLeft,
                yleft: switchData[0].yLeft,
                xright: switchData[0].xRight,
                yright: switchData[0].yRight,
            }, canvas, canvasZoom, setHintPicture);
            break;
        case 'Drag':
            showHintPathCanvas(canvas, canvasZoom, switchData[0], dragDelta, setHintPicture);
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
    dragEvent:ISwitchData,
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
        x: (dragEvent.startXRight - dragEvent.startXLeft) / 2 + dragEvent.startXLeft + 1,
        y: (dragEvent.startYRight - dragEvent.startYLeft) / 2 + dragEvent.startYLeft + 1
    });
    for (i = 0; i < dragEvent.pictures.length; i++) {
        const switchPicture = dragEvent.pictures[i];
        xyCenterArea.push({
            x: switchPicture.x + 1,
            y: switchPicture.y + 1
        });
    }
    xyCenterArea.push({
        x: (dragEvent.finishXRight - dragEvent.finishXLeft) / 2 + dragEvent.finishXLeft + 1,
        y: (dragEvent.finishYRight - dragEvent.finishYLeft) / 2 + dragEvent.finishYLeft + 1
    });

    context.fillRect(dragEvent.startXLeft / canvasZoom, dragEvent.startYLeft / canvasZoom,
        dragEvent.startXRight / canvasZoom - dragEvent.startXLeft / canvasZoom + 1,
        dragEvent.startYRight / canvasZoom - dragEvent.startYLeft / canvasZoom + 1);
    context.fillRect(dragEvent.finishXLeft / canvasZoom, dragEvent.finishYLeft / canvasZoom,
        dragEvent.finishXRight / canvasZoom - dragEvent.finishXLeft / canvasZoom + 1,
        dragEvent.finishYRight / canvasZoom - dragEvent.finishYLeft / canvasZoom + 1);

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
