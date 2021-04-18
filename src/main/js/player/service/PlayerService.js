const request = require('../../request');
const m = require('mithril');
var FrameConverter = require('./FrameConverter');
var ImageService = require('./ImageService');
var AudioService = require('./AudioService');
var HintService = require('./HintService');
var ScriptDataService = require('./ScriptDataService');

var PlayerService = {
    scriptIsSelected: false,
    playAllChapters: false,
    currentScriptId: null,
    timePassed: '00:00:00',
    startTime: null,
    timerIntervalId: null,
    curIndex: -1,
    curIndexDrag: -1,

    nextFrame: function () {
        HintService.reset();
        const notLastFrame = PlayerService.curIndex + 1 < ScriptDataService.frames.length;
        if (notLastFrame) {
            PlayerService.goToFrame(PlayerService.curIndex + 1);
        }
        else {
            if (PlayerService.playAllChapters) {
                const currentChapterId = ScriptDataService.currentChapterId;
                const lastChapterId = ScriptDataService.chapters[ScriptDataService.chapters.length - 1].id;
                if (currentChapterId !== lastChapterId)
                    m.route.set('/player/changeChapter/');
                else
                    m.route.set('/player/result/');
            }
            else
                m.route.set('/player/result/');
        }
        AudioService.reload();
    },

    goToFrame: function (frameIndex0) {
        const frameIndex = frameIndex0;
        const chapterId = ScriptDataService.frames[0].chapterId;
        const frameNumber = ScriptDataService.frames[frameIndex].frameNumber;
        request.getFrame(chapterId, frameNumber).then(function (frame) {
            PlayerService.curIndex = frameIndex;
            ScriptDataService.currentFrameIndex = frameIndex;
            FrameConverter.buffering(ScriptDataService.frames, frameIndex);
            FrameConverter.getImageData(ScriptDataService.frames, frameIndex, -1, function (imageData) {
                ImageService.currentImageData = imageData;
                ImageService.imageRedraw();
                ImageService.imageResize(false);
            });
            ScriptDataService.frames[frameIndex].taskText = frame.taskText;
            ScriptDataService.frames[frameIndex].hintText = frame.hintText;
            ScriptDataService.frames[frameIndex].switchData = frame.switchData;
            AudioService.src = frame.taskVoiceLink;
            if (!frame.switchData || frame.switchData.actionId === 17) {
                const pauseDuration = frame.switchData.actionSwitch.DURATION;
                setTimeout(PlayerService.nextFrame, pauseDuration ? pauseDuration : 2000);
            }
            FrameConverter.clearConvertedImageData(frameIndex);
        });
    },
    
    reset: function () {
        PlayerService.curIndex = -1;
        PlayerService.curIndexDrag = -1;
    },


    loadActiveScripts: function () {
        request.getActiveScripts().then(function (scripts) {
            ScriptDataService.scripts = scripts;
        });
        /* TODO: show admin all scripts
        request.getCurrentAccount().then(function (account) {
            if (!account) {
                alert('Не удалось получить данные аккаунта');
                return;
            }
            request.getScriptsForAccount(account.id).then(function(scripts) {
                ScriptDataService.scripts = scripts;
            });
        });
        */
    },

    selectScript: function (id) {
        PlayerService.scriptIsSelected = true;
        PlayerService.playAllChapters = false;
        PlayerService.currentScriptId = id;
        request.getScript(id).then(function (script) {
            ScriptDataService.chapters = script.chapters;
            ScriptDataService.dragDelta = script.dragDelta;
        });
    },

    playAllScript: function (scriptId) {
        request.getScript(scriptId).then(function (script) {
            PlayerService.currentScriptId = script.id;
            ScriptDataService.chapters = script.chapters;
            PlayerService.playAllChapters = true;
            const firstChapterId = script.chapters[0].id;
            ScriptDataService.currentChapterId = firstChapterId;
            request.postSession(PlayerService.currentScriptId, firstChapterId).then(function () {
                console.log('Сессия создана');
                m.route.set('/player/chapter/' + firstChapterId + '/');
            }).catch(function () {
                alert('Сессия не создана. Обратитесь к администратору');
            });
        });
    },

    playChapter: function (chapterId) {
        request.postSession(PlayerService.currentScriptId, chapterId).then(function () {
            console.log('Сессия создана');
            PlayerService.playAllChapters = false;
            ScriptDataService.currentChapterId = chapterId;
            m.route.set('/player/chapter/' + chapterId + '/');
        }).catch(function () {
            alert('Сессия не создана. Обратитесь к администратору');
        });
    }
};

module.exports = PlayerService;