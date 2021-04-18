const m = require('mithril');
const request = require('../../../js/request');
var PlayerService = require('../service/PlayerService');
var ImageService = require('../service/ImageService');
var HintService = require('../service/HintService');
var FrameConverter = require('../service/FrameConverter');
var ScriptDataService = require('../service/ScriptDataService');

var mouse = {
    downAndMoved: false,
    isDragStart: true,
    isDragCorrect: true,
    down: false,
    clickNotMove: true,
    keyDownPos: {x: -1, y: -1},
    lastMovePos: {x: -1, y: -1},
    clickIdTimeout: null,
    keyDownPosReset: function () {
        this.keyDownPos = {x: -1, y: -1}
    }
};

var CheckActionService = {
    keyUpHandler: function(key, modKey) {
        const currentFrameIndex = PlayerService.curIndex;
        const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
        serverLogKey(key, modKey, currentFrameIndex);
        if (trueEventTypeId === (modKey ? 12 : 9)) {
            checkKey(key, modKey);
        }
        else {
            HintService.count({eventTypeId: trueEventTypeId});
        }
    },
    click: function (e) {
        if (mouse.downAndMoved) {
            e.preventDefault();
        }
        else {
            var actionId = ScriptDataService.frames[PlayerService.curIndex].switchData.actionId;
            const check = function () {
                const rollbackFrameIndex = PlayerService.curIndex;
                const coordinates = mouseCoordinatesOnImage(e);
                coordinates.x /= ImageService.zoom;
                coordinates.y /= ImageService.zoom;
                serverLogClick(coordinates, rollbackFrameIndex);
                const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
                if (trueEventTypeId === 1) {
                    checkClick(coordinates);
                }
                else {
                    HintService.count({eventTypeId: trueEventTypeId});
                }
            };
            if (actionId === 4) {
                mouse.clickIdTimeout = setTimeout(check, 500);
            }
            else {
                check();
            }
        }
    },
    dblclick: function (e) {
        clearTimeout(mouse.clickIdTimeout);
        clearTimeout(mouse.clickIdTimeout - 1);
        const rollbackFrameIndex = PlayerService.curIndex;
        const coordinates = mouseCoordinatesOnImage(e);
        coordinates.x /= ImageService.zoom;
        coordinates.y /= ImageService.zoom;
        serverLogDblclick(coordinates, rollbackFrameIndex);
        const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
        if (trueEventTypeId === 4) {
            checkDblclick(coordinates);
        }
        else {
            HintService.count({eventTypeId: trueEventTypeId});
        }
    },
    mousedown: function (e) {
        if (e.which === 1) {
            const mousePos = mouseCoordinatesOnImage(e);
            mouse.down = true;
            mouse.downAndMoved = false;
            mouse.keyDownPos = mousePos;
            mouse.lastMovePos = mousePos;
            mouse.isDragStart = true;
            mouse.isDragCorrect = true;
            mouse.clickNotMove = true;
            e.preventDefault();
        }
    },
    mouseup: function (e) {
        if (e.which === 1) {
            if (mouse.downAndMoved) {
                const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
                if (mouse.clickNotMove) {
                    mouse.clickNotMove = true;
                    const rollbackFrameIndex = PlayerService.curIndex;
                    const coordinates = mouseCoordinatesOnImage(e);
                    coordinates.x /= ImageService.zoom;
                    coordinates.y /= ImageService.zoom;
                    serverLogClick(coordinates, rollbackFrameIndex);
                    if (trueEventTypeId === 1) {
                        checkClick(coordinates);
                    }
                    else {
                        HintService.count({eventTypeId: trueEventTypeId});
                    }
                }
                else {
                    if (trueEventTypeId === 13) {
                        dragUpdate(e, false, true);
                    }
                    else {
                        HintService.count({eventTypeId: trueEventTypeId});
                    }
                }
            }
            mouse.down = false;
            PlayerService.curIndexDrag = -1;
            mouse.keyDownPosReset();
        }
    },
    mousemove: function (e) {
        if (e.which === 1) {
            const mousePos = mouseCoordinatesOnImage(e);
            if (mouse.down) {
                const isDrag = mousePos.x !== mouse.keyDownPos.x || mousePos.y !== mouse.keyDownPos.y;
                if (isDrag) {
                    const radiusInSquare = Math.pow(mousePos.x - mouse.lastMovePos.x, 2) +
                        Math.pow(mousePos.y - mouse.lastMovePos.y, 2);
                    if (radiusInSquare > 4)
                        mouse.clickNotMove = false;
                    if (radiusInSquare > 100) {
                        mouse.lastMovePos = mousePos;
                        const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
                        if (trueEventTypeId === 13) {
                            dragUpdate(e, mouse.isDragStart, false);
                        }
                        else {
                            HintService.count({eventTypeId: trueEventTypeId});
                            const coordinates = mouseCoordinatesOnImage(e);
                            const dragEvent = {
                                isStarted: mouse.isDragStart,
                                isFinished: false,
                                chapterId: ScriptDataService.frames[PlayerService.curIndex].chapterId,
                                actionId: 13,
                                x: coordinates.x / ImageService.zoom,
                                y: coordinates.y / ImageService.zoom
                            };

                            request.checkAction(dragEvent).then(function () {});
                        }
                        mouse.isDragStart = false;
                    }
                    mouse.downAndMoved = true;
                }
                else {
                    e.preventDefault();
                }
            }
        }
    },
    mouseout: function (e) {
        if (mouse.downAndMoved && mouse.isDragCorrect) {
            HintService.count(checkDragResult);
        }
        mouse.isDragCorrect = false;
    },
    contextmenu: function (e) {
        const rollbackFrameIndex = PlayerService.curIndex;
        const coordinates = mouseCoordinatesOnImage(e);
        coordinates.x /= ImageService.zoom;
        coordinates.y /= ImageService.zoom;
        serverLogContextMenu(coordinates, rollbackFrameIndex);
        const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
        if (trueEventTypeId === 5) {
            checkContextMenu(coordinates);
        }
        else {
            HintService.count({eventTypeId: trueEventTypeId});
        }
        e.preventDefault();
    },
    wheel: function (e) {
        const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
        if (trueEventTypeId === 14 || trueEventTypeId === 15) {
            'onwheel' in document ? checkWheelScrolling(e) : null
        }
        else {
            HintService.count({eventTypeId: trueEventTypeId});
        }
    },
    mousewheel: function (e) {
        const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
        if (trueEventTypeId === 14 || trueEventTypeId === 15) {
            'onmousewheel' in document ? checkWheelScrolling(e) : null
        }
        else {
            HintService.count({eventTypeId: trueEventTypeId});
        }
    },
    MozMousePixelScroll: function (e) {
        const trueEventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
        if (trueEventTypeId === 14 || trueEventTypeId === 15) {
            'MozMousePixelScroll' in document ? checkWheelScrolling(e) : null
        }
        else {
            HintService.count({eventTypeId: trueEventTypeId});
        }
    }
};

var mouseCoordinatesOnImage = function (e) {
    var image = document.getElementById('imageCanvas');
    var rect = image.getBoundingClientRect();
    var win = image.ownerDocument.defaultView;
    var offsetTop = rect.top + win.pageYOffset;
    var offsetLeft = rect.left + win.pageXOffset;
    return {x: parseInt(e.pageX - offsetLeft), y: parseInt(e.pageY - offsetTop)};
};

var checkKey = function (key, modKey) {
    const trueKey = ScriptDataService.frames[PlayerService.curIndex].switchData.actionSwitch.key;
    const trueModKey = ScriptDataService.frames[PlayerService.curIndex].switchData.actionSwitch.mod_key;
    if (key === trueKey && modKey === trueModKey) {
        PlayerService.nextFrame();
    }
    else {
        HintService.count({eventTypeId: modKey ? 12 : 9});
    }
};

var serverLogKey = function(key, modKey, rollbackFrameIndex) {
    const toSend = {
        frameNumber: ScriptDataService.frames[PlayerService.curIndex].frameNumber,
        chapterId: ScriptDataService.frames[PlayerService.curIndex].chapterId,
        actionId: modKey ? 12 : 9,
        key: key,
        modKey: modKey
    };
    request.checkAction(toSend).then(function (answer) {
        /*if (!answer.checkResult && PlayerService.curIndex !== rollbackFrameIndex) {
            HintService.count(answer);
            PlayerService.goToFrame(rollbackFrameIndex);
        }*/
    });
};

var dragUpdate = function(e, isDragStart, isDragFinish) {
    if (!mouse.isDragCorrect) {
        return;
    }
    const curFrame = ScriptDataService.frames[PlayerService.curIndex];
    const coordinates = mouseCoordinatesOnImage(e);
    const dragEvent = {
        isStarted: isDragStart,
        isFinished: isDragFinish,
        chapterId: curFrame.chapterId,
        actionId: 13,
        x: coordinates.x / ImageService.zoom,
        y: coordinates.y / ImageService.zoom
    };

    const checkDragResult = checkDragEvent(dragEvent);

    if (isDragFinish) {
        if (checkDragResult.checkResult) {
            PlayerService.nextFrame();
        }
        else {
            console.log('Перетаскивание некорректно');
            if (mouse.isDragCorrect) {
                HintService.count(checkDragResult);
            }
            mouse.isDragCorrect = false;
            PlayerService.curIndexDrag = -1;
            FrameConverter.getImageData(ScriptDataService.frames, PlayerService.curIndex,
                PlayerService.curIndexDrag, function (imageData) {
                ImageService.currentImageData = imageData;
                ImageService.imageRedraw();
                ImageService.imageResize(false);
            });
        }
    }
    else {
        if (checkDragResult.tunnelCheckResult) {
            const dragPicturesCount = curFrame.switchData.switchPictures.length;
            // Защита от несовпадения количества областей и изображений для них
            if (checkDragResult.areaNumber <= dragPicturesCount) {
                PlayerService.curIndexDrag = checkDragResult.areaNumber - 1;
                FrameConverter.getImageData(ScriptDataService.frames, PlayerService.curIndex,
                    PlayerService.curIndexDrag, function (imageData) {
                    ImageService.currentImageData = imageData;
                    ImageService.imageRedraw();
                    ImageService.imageResize(false);
                });
            }
        }
        else {
            console.log('Перетаскивание вышло за границы');
            if (mouse.isDragCorrect) {
                HintService.count(checkDragResult);
            }
            mouse.isDragCorrect = false;
            PlayerService.curIndexDrag = -1;
            FrameConverter.getImageData(ScriptDataService.frames, PlayerService.curIndex,
                PlayerService.curIndexDrag, function (imageData) {
                ImageService.currentImageData = imageData;
                ImageService.imageRedraw();
                ImageService.imageResize(false);
            });
        }
    }
};

var checkDragEvent = function(event) {
    var result = {
        checkResult: null,
        tunnelCheckResult: null,
        areaNumber: null
    };
    var dragAction = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionSwitch;
    var isInStartArea = event.x >= dragAction.start_x_left
        && event.x <= dragAction.start_x_right
        && event.y >= dragAction.start_y_left && event.y <= dragAction.start_y_right;
    var isInFinishArea = event.x >= dragAction.finish_x_left
        && event.x <= dragAction.finish_x_right
        && event.y >= dragAction.finish_y_left && event.y <= dragAction.finish_y_right;
    var dragPicturesCount = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.switchPictures.length;
    if (isInStartArea || isInFinishArea) {
        var isDragFinished = isInFinishArea && event.isFinished;
        result.checkResult = isDragFinished;
        result.tunnelCheckResult = true;
        result.areaNumber = isInStartArea ? 1 : dragPicturesCount;
        return result;
    }

    var xyCenterArea = [];
    xyCenterArea.push({
        x: (dragAction.start_x_right - dragAction.start_x_left) / 2 + dragAction.start_x_left,
        y: (dragAction.start_y_right - dragAction.start_y_left) / 2 + dragAction.start_y_left
    });
    for (var j = 0; j < dragPicturesCount; j++) {
        var switchPicture = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.switchPictures[j];
        xyCenterArea.push({
            x: switchPicture.x,
            y: switchPicture.y
        });
    }
    xyCenterArea.push({
        x: (dragAction.finish_x_right - dragAction.finish_x_left) / 2 + dragAction.finish_x_left,
        y: (dragAction.finish_y_right - dragAction.finish_y_left) / 2 + dragAction.finish_y_left
    });

    var tunnelWidth = ScriptDataService.dragDelta;
    var tunnelCheckResult = false;
    var areaNumber = 0;
    var i = 0;
    while (areaNumber === 0 && !tunnelCheckResult && i <= dragPicturesCount) {
        var mathLinearFactors = {
            A: null,
            B: null,
            C: null
        };
        mathLinearFactors.A = xyCenterArea[i].y - xyCenterArea[i + 1].y;
        mathLinearFactors.B = xyCenterArea[i + 1].x - xyCenterArea[i].x;
        mathLinearFactors.C = xyCenterArea[i].x * xyCenterArea[i + 1].y - xyCenterArea[i + 1].x * xyCenterArea[i].y;

        var tunnelWidthFactor = tunnelWidth * Math.sqrt(Math.pow(mathLinearFactors.A, 2) +
            Math.pow(mathLinearFactors.B, 2));

        var mathLinearFactorCBegin = mathLinearFactors.B * xyCenterArea[i].x - mathLinearFactors.A * xyCenterArea[i].y;

        var mathLinearFactorCEnd = mathLinearFactors.B * xyCenterArea[i + 1].x -
            mathLinearFactors.A * xyCenterArea[i + 1].y;

        var scopeTunnel;
        var scopeArea;

        if (mathLinearFactors.B !== 0) {
            scopeTunnel = (((event.y <= (-(mathLinearFactors.A * event.x +
                mathLinearFactors.C + tunnelWidthFactor) / mathLinearFactors.B)) &&
                (event.y >= (-(mathLinearFactors.A * event.x +
                    mathLinearFactors.C - tunnelWidthFactor) / mathLinearFactors.B))) ||
                ((event.y >= (-(mathLinearFactors.A * event.x +
                    mathLinearFactors.C + tunnelWidthFactor) / mathLinearFactors.B)) &&
                    (event.y <= (-(mathLinearFactors.A * event.x +
                        mathLinearFactors.C - tunnelWidthFactor) / mathLinearFactors.B))));

            scopeArea = (((event.x <= (mathLinearFactors.A * event.y + mathLinearFactorCBegin) /
                mathLinearFactors.B) &&
                (event.x >= (mathLinearFactors.A * event.y + mathLinearFactorCEnd) /
                    mathLinearFactors.B)) ||
                ((event.x >= (mathLinearFactors.A * event.y + mathLinearFactorCBegin) /
                    mathLinearFactors.B) &&
                    (event.x <= (mathLinearFactors.A * event.y + mathLinearFactorCEnd) /
                        mathLinearFactors.B)));
        } else {
            scopeTunnel = (((event.x <= (-(mathLinearFactors.B * event.y +
                mathLinearFactors.C + tunnelWidthFactor) / mathLinearFactors.A)) &&
                (event.x >= (-(mathLinearFactors.B * event.y +
                    mathLinearFactors.C - tunnelWidthFactor) / mathLinearFactors.A))) ||
                ((event.x >= (-(mathLinearFactors.B * event.y +
                    mathLinearFactors.C + tunnelWidthFactor) / mathLinearFactors.A)) &&
                    (event.x <= (-(mathLinearFactors.B * event.y +
                        mathLinearFactors.C - tunnelWidthFactor) / mathLinearFactors.A))));

            scopeArea = (((event.y <= ((mathLinearFactors.B * event.x - mathLinearFactorCBegin) /
                mathLinearFactors.A)) &&
                (event.y >= ((mathLinearFactors.B * event.x - mathLinearFactorCEnd) /
                    mathLinearFactors.A))) ||
                ((event.y >= ((mathLinearFactors.B * event.x - mathLinearFactorCBegin) /
                    mathLinearFactors.A)) &&
                    (event.y <= ((mathLinearFactors.B * event.x - mathLinearFactorCEnd) /
                        mathLinearFactors.A))));
        }

        if (scopeTunnel && scopeArea) {
            tunnelCheckResult = true;
            areaNumber = i;
        }
        i++;
    }
    if (!tunnelCheckResult) {
        for (i = 1; i <= dragPicturesCount; i++) {
            if ((Math.pow(event.x - xyCenterArea[i].x, 2) +
                    Math.pow(event.y - xyCenterArea[i].y, 2)) <= Math.pow(tunnelWidth, 2)) {
                tunnelCheckResult = true;
                break;
            }
        }
    }
    if (tunnelCheckResult && areaNumber === 0) {
        areaNumber = 1;
    }

    result.checkResult = false;
    result.tunnelCheckResult = tunnelCheckResult && !event.isStarted;
    result.areaNumber = areaNumber;
    return result;
};

var checkClick = function(coordinates) {
    const trueActionSwitch = ScriptDataService.frames[PlayerService.curIndex].switchData.actionSwitch;
    const trueCoordinates = {
        xLeft: trueActionSwitch.x_left,
        xRight: trueActionSwitch.x_right,
        yLeft: trueActionSwitch.y_left,
        yRight: trueActionSwitch.y_right
    };
    if (coordinates.x >= trueCoordinates.xLeft && coordinates.x <= trueCoordinates.xRight &&
        coordinates.y >= trueCoordinates.yLeft && coordinates.y <= trueCoordinates.yRight) {
        PlayerService.nextFrame();
    }
    else {
        HintService.count({
            eventTypeId: 1,
            trueX1: trueActionSwitch.x_left,
            trueX2: trueActionSwitch.x_right,
            trueY1: trueActionSwitch.y_left,
            trueY2: trueActionSwitch.y_right
        });
    }
};

var serverLogClick = function (coordinates, rollbackFrameIndex) {
    const toSend = {
        chapterId: ScriptDataService.frames[PlayerService.curIndex].chapterId,
        actionId: 1,
        x: coordinates.x,
        y: coordinates.y
    };
    request.checkAction(toSend).then(function (answer) {
        /*if (!answer.checkResult && PlayerService.curIndex !== rollbackFrameIndex) {
            HintService.count(answer);
            PlayerService.goToFrame(rollbackFrameIndex);
        }*/
    });
};

var checkDblclick = function(coordinates) {
    const trueActionSwitch = ScriptDataService.frames[PlayerService.curIndex].switchData.actionSwitch;
    const trueCoordinates = {
        xLeft: trueActionSwitch.x_left,
        xRight: trueActionSwitch.x_right,
        yLeft: trueActionSwitch.y_left,
        yRight: trueActionSwitch.y_right
    };
    if (coordinates.x >= trueCoordinates.xLeft && coordinates.x <= trueCoordinates.xRight &&
        coordinates.y >= trueCoordinates.yLeft && coordinates.y <= trueCoordinates.yRight) {
        PlayerService.nextFrame();
    }
    else {
        HintService.count({
            eventTypeId: 4,
            trueX1: trueActionSwitch.x_left,
            trueX2: trueActionSwitch.x_right,
            trueY1: trueActionSwitch.y_left,
            trueY2: trueActionSwitch.y_right
        });
    }
};

var serverLogDblclick = function (coordinates, rollbackFrameIndex) {
    const toSend = {
        chapterId: ScriptDataService.frames[PlayerService.curIndex].chapterId,
        actionId: 4,
        x: coordinates.x,
        y: coordinates.y
    };
    request.checkAction(toSend).then(function (answer) {
        /*if (!answer.checkResult && PlayerService.curIndex !== rollbackFrameIndex) {
            HintService.count(answer);
            PlayerService.goToFrame(rollbackFrameIndex);
        }*/
    });
};

var checkContextMenu = function(coordinates) {
    const trueActionSwitch = ScriptDataService.frames[PlayerService.curIndex].switchData.actionSwitch;
    const trueCoordinates = {
        xLeft: trueActionSwitch.x_left,
        xRight: trueActionSwitch.x_right,
        yLeft: trueActionSwitch.y_left,
        yRight: trueActionSwitch.y_right
    };
    if (coordinates.x >= trueCoordinates.xLeft && coordinates.x <= trueCoordinates.xRight &&
        coordinates.y >= trueCoordinates.yLeft && coordinates.y <= trueCoordinates.yRight) {
        PlayerService.nextFrame();
    }
    else {
        HintService.count({
            eventTypeId: 5,
            trueX1: trueActionSwitch.x_left,
            trueX2: trueActionSwitch.x_right,
            trueY1: trueActionSwitch.y_left,
            trueY2: trueActionSwitch.y_right
        });
    }
};

var serverLogContextMenu = function (coordinates, rollbackFrameIndex) {
    const toSend = {
        chapterId: ScriptDataService.frames[PlayerService.curIndex].chapterId,
        actionId: 5,
        x: coordinates.x,
        y: coordinates.y
    };
    request.checkAction(toSend).then(function (answer) {
        /*if (!answer.checkResult && PlayerService.curIndex !== rollbackFrameIndex) {
            HintService.count(answer);
            PlayerService.goToFrame(rollbackFrameIndex);
        }*/
    });
};

function checkWheelScrolling(e) {
    e = e || window.event;
    // wheelDelta не дает возможность узнать количество пикселей
    const delta = e.deltaY || e.detail || e.wheelDelta;
    const actionId = delta < 0 ? 14 : 15;
    const coordinates = mouseCoordinatesOnImage(e);
    const toSend = {
        chapterId: ScriptDataService.frames[PlayerService.curIndex].chapterId,
        actionId: actionId,
        x: coordinates.x / ImageService.zoom,
        y: coordinates.y / ImageService.zoom
    };
    request.checkAction(toSend).then(function (answer) {
        if (answer.checkResult) {
            PlayerService.nextFrame();
        }
        else {
            HintService.count(answer);
        }
    }).catch(function () {
    });
    e.preventDefault();
}

module.exports = CheckActionService;