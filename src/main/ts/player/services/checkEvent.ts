import {
    ICheckDragResult,
    ISwitchEvent,
    IEventForCheck,
    ISquareCoords,
    ISwitchData
} from "../interfaces";

export const chClick = (e:IEventForCheck, switchData:Array<ISwitchData>):string | null => {
    if (e.actionId !== 'LeftMouseClick' &&
        e.actionId !== 'LeftDoubleMouseClick' &&
        e.actionId !== 'RightMouseClick')
        return null;

    const suitableSwitchData = switchData.find(data => {
        if (data.switchEvent.actionId !== e.actionId)
            return false;

        const coords:ISquareCoords = {
            xleft: data.switchEvent.xleft,
            xright: data.switchEvent.xright,
            yleft: data.switchEvent.yleft,
            yright: data.switchEvent.yright
        };

        return e.x >= coords.xleft && e.x <= coords.xright && e.y >= coords.yleft && e.y <= coords.yright;
    });

    if (suitableSwitchData)
        return suitableSwitchData.nextFrameId;
    return null;
};

export const chDrag = (e:IEventForCheck, switchData:Array<ISwitchData>):{
    checkDragResult: ICheckDragResult | null,
    switchData: ISwitchData | undefined
} | null => {
    if (e.actionId !== 'Drag')
        return null;

    let checkDragResult = null;
    const suitableSwitchData = switchData.find(data => {
        if (data.switchEvent.actionId !== 'Drag')
            return false;
        const checkTrajectoryResult = checkDragTrajectory(e, data.switchEvent);
        if (!checkTrajectoryResult || !checkTrajectoryResult.tunnelCheckResult)
            return false;

        checkDragResult = checkTrajectoryResult;
        return true;
    });

    if (!suitableSwitchData)
        return null;

    return {
        checkDragResult: checkDragResult,
        switchData: suitableSwitchData
    };
};

export const checkDragTrajectory = (e: IEventForCheck, dragEvent:ISwitchEvent):ICheckDragResult | null => {
    if (e.actionId !== 'Drag')
        return null;

    const start = {
            xleft: dragEvent.xstartLeft,
            yleft: dragEvent.ystartLeft,
            xright: dragEvent.xstartRight,
            yright: dragEvent.ystartRight
        },
        finish = {
            xleft: dragEvent.xendLeft,
            yleft: dragEvent.yendLeft,
            xright: dragEvent.xendRight,
            yright: dragEvent.yendRight
        },
        pictures = dragEvent.pictures;

    const isInStartArea = e.x >= start.xleft && e.x <= start.xright
        && e.y >= start.yleft && e.y <= start.yright;
    const isInFinishArea = e.x >= finish.xleft && e.x <= finish.xright
        && e.y >= finish.yleft && e.y <= finish.yright;
    if (isInStartArea)
        e.setWasDragInStartArea();
    const dragPicturesCount = pictures.length;
    if (isInStartArea || isInFinishArea)
        return {
            checkResult: isInFinishArea && e.isFinished,
            tunnelCheckResult: true,
            areaNumber: isInStartArea ? 1 : dragPicturesCount
        };

    const centerArea = [];
    centerArea.push({
        x: (start.xright - start.xleft) / 2 + start.xleft,
        y: (start.yright - start.yleft) / 2 + start.yleft
    });
    for (let j = 0; j < dragPicturesCount; j++)
        centerArea.push({
            x: pictures[j].x,
            y: pictures[j].y
        });
    centerArea.push({
        x: (finish.xright - finish.xleft) / 2 + finish.xleft,
        y: (finish.yright - finish.yleft) / 2 + finish.yleft
    });

    let tunnelCheckResult = false,
        areaNumber = 0,
        i = 0;
    // (!areaNumber || i <= areaNumber + 1) - для проверки, не входит ли точка в область перегиба
    // после подходящего тоннеля
    while (i <= dragPicturesCount && (!areaNumber || i <= areaNumber + 1)) {
        const mathLinearFactors = {
            A: centerArea[i].y - centerArea[i + 1].y,
            B: centerArea[i + 1].x - centerArea[i].x,
            C: centerArea[i].x * centerArea[i + 1].y - centerArea[i + 1].x * centerArea[i].y
        };

        const tunnelWidthFactor = e.dragDelta * Math.sqrt(Math.pow(mathLinearFactors.A, 2) +
            Math.pow(mathLinearFactors.B, 2));

        const mathLinearFactorCBegin = mathLinearFactors.B * centerArea[i].x - mathLinearFactors.A * centerArea[i].y;

        const mathLinearFactorCEnd = mathLinearFactors.B * centerArea[i + 1].x -
            mathLinearFactors.A * centerArea[i + 1].y;

        let scopeTunnel;
        let scopeArea;

        if (mathLinearFactors.B !== 0) {
            scopeTunnel = (((e.y <= (-(mathLinearFactors.A * e.x +
                mathLinearFactors.C + tunnelWidthFactor) / mathLinearFactors.B)) &&
                (e.y >= (-(mathLinearFactors.A * e.x +
                    mathLinearFactors.C - tunnelWidthFactor) / mathLinearFactors.B))) ||
                ((e.y >= (-(mathLinearFactors.A * e.x +
                    mathLinearFactors.C + tunnelWidthFactor) / mathLinearFactors.B)) &&
                    (e.y <= (-(mathLinearFactors.A * e.x +
                        mathLinearFactors.C - tunnelWidthFactor) / mathLinearFactors.B))));

            scopeArea = (((e.x <= (mathLinearFactors.A * e.y + mathLinearFactorCBegin) /
                mathLinearFactors.B) &&
                (e.x >= (mathLinearFactors.A * e.y + mathLinearFactorCEnd) /
                    mathLinearFactors.B)) ||
                ((e.x >= (mathLinearFactors.A * e.y + mathLinearFactorCBegin) /
                    mathLinearFactors.B) &&
                    (e.x <= (mathLinearFactors.A * e.y + mathLinearFactorCEnd) /
                        mathLinearFactors.B)));
        } else {
            scopeTunnel = (((e.x <= (-(mathLinearFactors.B * e.y +
                mathLinearFactors.C + tunnelWidthFactor) / mathLinearFactors.A)) &&
                (e.x >= (-(mathLinearFactors.B * e.y +
                    mathLinearFactors.C - tunnelWidthFactor) / mathLinearFactors.A))) ||
                ((e.x >= (-(mathLinearFactors.B * e.y +
                    mathLinearFactors.C + tunnelWidthFactor) / mathLinearFactors.A)) &&
                    (e.x <= (-(mathLinearFactors.B * e.y +
                        mathLinearFactors.C - tunnelWidthFactor) / mathLinearFactors.A))));

            scopeArea = (((e.y <= ((mathLinearFactors.B * e.x - mathLinearFactorCBegin) /
                mathLinearFactors.A)) &&
                (e.y >= ((mathLinearFactors.B * e.x - mathLinearFactorCEnd) /
                    mathLinearFactors.A))) ||
                ((e.y >= ((mathLinearFactors.B * e.x - mathLinearFactorCBegin) /
                    mathLinearFactors.A)) &&
                    (e.y <= ((mathLinearFactors.B * e.x - mathLinearFactorCEnd) /
                        mathLinearFactors.A))));
        }

        if (scopeTunnel)
            areaNumber = i;

        if (scopeTunnel && scopeArea)
            tunnelCheckResult = true;
        i++;
    }
    if (!tunnelCheckResult)
        for (i = 1; i <= dragPicturesCount; i++)
            if ((Math.pow(e.x - centerArea[i].x, 2) +
                Math.pow(e.y - centerArea[i].y, 2)) <= Math.pow(e.dragDelta, 2)) {
                tunnelCheckResult = true;
                break;
            }


    if (tunnelCheckResult && areaNumber === 0)
        areaNumber = 1;

    return {
        checkResult: false,
        tunnelCheckResult: tunnelCheckResult && !e.isStarted,
        areaNumber: areaNumber
    };
};

export const checkDuration = (switchData:Array<ISwitchData>):{
    duration:number | null
    nextFrameId:string | null
} => {
    let duration:number | null = null;
    let nextFrameId:string | null = null;

    switchData.forEach(data => {
        if (data.switchEvent.actionId !== 'Pause')
            return;
        duration = data.switchEvent.duration;
        nextFrameId = data.nextFrameId;
    });

    return {
        duration,
        nextFrameId
    };
};