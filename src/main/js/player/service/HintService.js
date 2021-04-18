const m = require('mithril');
var PlayerService = require('./PlayerService');
var AudioService = require('./AudioService');
var ScriptDataService = require('./ScriptDataService');
var LayoutService = require('./LayoutService');

var HintService = {
    mistakeCount: 0,
    mistakeDisplay: false,
    isVisible: false,
    isVisibleText: false,
    lastHintTimeoutId: null,
    mistakesInChapterCount: 0,
    coordinates: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    },
    reset: function () {
        HintService.mistakeCount = 0;
        HintService.hideHintCanvas();
        HintService.hideText();
    },
    count: function (answer) {
        HintService.mistakeCount++;
        HintService.mistakesInChapterCount++;
        HintService.mistakeDisplay = true;
        setTimeout(function() {
            HintService.mistakeDisplay = false;
            m.redraw();
        }, 700);
        if (LayoutService.mode === 1) {
            if (HintService.mistakeCount > 4) {
                const eventTypeId = ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionId;
                // Если клик
                if (eventTypeId < 9 || eventTypeId > 13) {
                    const coordinates = {
                        x1: ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionSwitch.x_left,
                        y1: ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionSwitch.y_left,
                        x2: ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionSwitch.x_right,
                        y2: ScriptDataService.frames[ScriptDataService.currentFrameIndex].switchData.actionSwitch.y_right
                    };
                    HintService.showHintCanvas(coordinates);
                    setTimeout(function () {
                        HintService.hideHintCanvas();
                        m.redraw();
                    }, 1200);
                }
                // Если перетаскивание
                else if (eventTypeId === 13) {
                    HintService.showHintPathCanvas();
                    setTimeout(function () {
                        HintService.hideHintCanvas();
                        m.redraw();
                    }, 1200);
                }
            }
            else if (HintService.mistakeCount === 3) {
                HintService.showText();
            }
        }
    },
    showHintPathCanvas: function () {
        var hintCanvas = document.getElementById('hintCanvas'),
            hintCanvasContext = hintCanvas.getContext('2d'),
            i,
            xyCenterArea = [];
        hintCanvasContext.fillStyle = 'rgb(244, 246, 245)';

        const dragAction = ScriptDataService.frames[ScriptDataService.currentFrameIndex],
            actionSwitch = dragAction.switchData.actionSwitch,
            dragPicturesCount = dragAction.switchData.switchPictures.length,
            tunnelWidth = ScriptDataService.dragDelta;

        xyCenterArea.push({
            x: (actionSwitch.start_x_right - actionSwitch.start_x_left) / 2 + actionSwitch.start_x_left + 1,
            y: (actionSwitch.start_y_right - actionSwitch.start_y_left) / 2 + actionSwitch.start_y_left + 1
        });
        for (i = 0; i < dragPicturesCount; i++) {
            const switchPicture = dragAction.switchData.switchPictures[i];
            xyCenterArea.push({
                x: switchPicture.x + 1,
                y: switchPicture.y + 1
            });
        }
        xyCenterArea.push({
            x: (actionSwitch.finish_x_right - actionSwitch.finish_x_left) / 2 + actionSwitch.finish_x_left + 1,
            y: (actionSwitch.finish_y_right - actionSwitch.finish_y_left) / 2 + actionSwitch.finish_y_left + 1
        });

        hintCanvasContext.fillRect(actionSwitch.start_x_left, actionSwitch.start_y_left,
            actionSwitch.start_x_right - actionSwitch.start_x_left + 1,
            actionSwitch.start_y_right - actionSwitch.start_y_left + 1);
        hintCanvasContext.fillRect(actionSwitch.finish_x_left, actionSwitch.finish_y_left,
            actionSwitch.finish_x_right - actionSwitch.finish_x_left + 1,
            actionSwitch.finish_y_right - actionSwitch.finish_y_left + 1);

        const xyCenterAreaLength = xyCenterArea.length;
        for(i = 0; i < xyCenterAreaLength - 1; i++) {
            // Тоннель
            hintCanvasContext.beginPath();
            hintCanvasContext.moveTo(xyCenterArea[i].x, xyCenterArea[i].y);
            hintCanvasContext.lineTo(xyCenterArea[i + 1].x, xyCenterArea[i + 1].y);
            hintCanvasContext.strokeStyle = 'rgb(244, 246, 245)';
            hintCanvasContext.lineWidth = tunnelWidth * 2;
            hintCanvasContext.stroke();

            // Область перегиба
            if (i > 0) {
                hintCanvasContext.beginPath();
                hintCanvasContext.arc(xyCenterArea[i].x, xyCenterArea[i].y, tunnelWidth, 0, 2*Math.PI, false);
                hintCanvasContext.fillStyle = 'rgb(244, 246, 245)';
                hintCanvasContext.strokeStyle = 'rgb(244, 246, 245)';
                hintCanvasContext.fill();
                hintCanvasContext.lineWidth = 1;
                hintCanvasContext.stroke();
            }
        }
        hintCanvas.style.display = 'block';

        // Инвертируем прозрачность
        var imgData = hintCanvasContext.getImageData(0, 0, hintCanvas.width, hintCanvas.height);
        for (i = 0; i < imgData.data.length; i += 4) {
            if (imgData.data[i] === 244 && imgData.data[i + 1] === 246 && imgData.data[i + 2] === 245) {
                imgData.data[i + 3] = 0;
            }
            else {
                imgData.data[i] = 138;
                imgData.data[i + 1] = 202;
                imgData.data[i + 2] = 244;
                imgData.data[i + 3] = 240;
            }
        }
        hintCanvasContext.putImageData(imgData, 0, 0);
    },
    showHintCanvas: function (coordinates) {
        var hintCanvas = document.getElementById('hintCanvas');
        var hintCanvasContext = hintCanvas.getContext('2d');
        hintCanvasContext.fillStyle = 'rgba(138, 202, 244, 0.94)';
        hintCanvasContext.fillRect(0, 0, hintCanvas.width, coordinates.y1);
        hintCanvasContext.fillRect(0, coordinates.y2, hintCanvas.width, hintCanvas.height);
        hintCanvasContext.fillRect(0, coordinates.y1, coordinates.x1, coordinates.y2);
        hintCanvasContext.fillRect(coordinates.x2, coordinates.y1, hintCanvas.width, hintCanvas.height);
        hintCanvas.style.display = 'block';
    },
    hideHintCanvas: function () {
        const hintCanvas = document.getElementById('hintCanvas');
        var hintCanvasContext = hintCanvas.getContext('2d');
        hintCanvasContext.clearRect(0, 0, hintCanvas.width, hintCanvas.height);
        hintCanvas.style.display = 'none';
    },
    showText: function () {
        HintService.isVisibleText = true;
        AudioService.src = ScriptDataService.frames ?
            (ScriptDataService.frames[PlayerService.curIndex] ?
                ScriptDataService.frames[PlayerService.curIndex].hintVoiceLink : null ) : null;

        // Раскрытие боковой панели
        if (LayoutService.layoutType === 2) {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.add('sidebarHidingVisible');
            sidebar.onmousemove = function () {
                sidebar.classList.remove('sidebarHidingVisible');
            };
            m.redraw();
            setTimeout(function () {
                if (sidebar && sidebar.classList.contains('sidebarHidingVisible')) {
                    sidebar.classList.remove('sidebarHidingVisible');
                    sidebar.onmousemove = null;
                }
            }, 3000);
        }
    },
    hideText: function () {
        HintService.isVisibleText = false;
    }
};

module.exports = HintService;