const m = require('mithril');
const request = require('../request');
var PlayerService = require('./service/PlayerService');
require('../../css/player.css');
var ImageService = require('./service/ImageService');
var HintService = require('./service/HintService');
var KeyboardListener = require("../../js/KeyboardListener");
var CheckActionService = require("./service/CheckActionService");
var ScriptDataService = require('./service/ScriptDataService');
var LayoutService = require('./service/LayoutService');
var FrameConverter = require('./service/FrameConverter');
var AudioPlayerComponent = require('./frame/audio/AudioPlayerComponent');
var HintComponent = require('./frame/HintComponent');

var PlayerPage = {

    oninit: function (vnode) {
        document.title = 'Проигрыватель';
        document.body.oncontextmenu = function (e) {
            e.preventDefault();
        };
        document.body.onclick = function (e) {
            if (e.which !== 1) e.preventDefault();
        };
        window.onresize = function () {
            ImageService.imageResize();
        };
        KeyboardListener.switchOn();
        KeyboardListener.on(KeyboardListener.KEY_UP, CheckActionService.keyUpHandler);
        PlayerService.timePassed = '00:00:00';
        PlayerService.mistakesInChapterCount = 0;
        request.getChapter(vnode.attrs.id).then(function (chapter) {
            PlayerService.reset();
            ScriptDataService.frames = chapter.frames;
            ScriptDataService.frames.forEach(function (frame, i) {
                ScriptDataService.frames[i].pictureLink = '/data/' + frame.pictureLink;
                if (frame.switchData.switchPictures) {
                    frame.switchData.switchPictures.forEach(function (switchPicture, j) {
                        ScriptDataService.frames[i].switchData.switchPictures[j].pictureLink =
                            '/data/' + switchPicture.pictureLink;
                    });
                }
            });
            FrameConverter.reset(ScriptDataService.frames);
            ImageService.imageOriginalWidth = chapter.pictureWidth;
            ImageService.imageOriginalHeight = chapter.pictureHeight;
            HintService.mistakesInChapterCount = 0;
            PlayerService.nextFrame();

            // Секундомер
            PlayerService.startTime = new Date();
            function startTimer() {
                clearInterval(PlayerService.timerIntervalId);
                PlayerService.timerIntervalId = setInterval(function () {
                    const timePassed = new Date() - PlayerService.startTime;
                    var sec = Math.abs(Math.floor(timePassed / 1000) % 60);
                    var min = Math.abs(Math.floor(timePassed / 1000 / 60) % 60);
                    var hours = Math.abs(Math.floor(timePassed / 1000 / 60 / 60) % 24);
                    if (sec.toString().length === 1) sec = '0' + sec;
                    if (min.toString().length === 1) min = '0' + min;
                    if (hours.toString().length === 1) hours = '0' + hours;
                    PlayerService.timePassed = hours + ':' + min + ':' + sec;
                    m.redraw();
                }, 1000);
            }
            startTimer();
        });
    },

    oncreate: function () {
        ImageService.imageResize();
    },

    onremove: function() {
        window.onresize = null;
        KeyboardListener.switchOff();
    },

    view: function () {
        const taskText = {
            children: ScriptDataService.frames && ScriptDataService.frames[PlayerService.curIndex]
                ? ScriptDataService.frames[PlayerService.curIndex].taskText
                : 'Идёт загрузка задания...'
        };

        const notification = {
            attrs: {
                src: 'img/notificationOn.png',
                style: {
                    display: LayoutService.layoutType === 2 && HintService.isVisibleText ? 'block' : 'none'
                }
            }
        };

        const helper = {
            attrs: {
                style: {
                    display: HintService.isVisibleText ? 'block' : 'none'
                }
            },
            children: [
                m('p',
                    ScriptDataService.frames && ScriptDataService.frames[PlayerService.curIndex]
                        ? ScriptDataService.frames[PlayerService.curIndex].hintText
                        : 'Идёт загрузка подсказки...'/*,
                        m(notification)*/
                ),
                m('.triangle-topleft-red'),
                m('.triangle-bottomright-red')
            ]
        };

        const btnSetLayoutType = {
            attrs: {
                'data-columns': LayoutService.layoutType === 1 ? '1' : '2',
                style: {
                    backgroundImage: 'url("' + (LayoutService.layoutType === 1 ?
                        '/img/zoomInGray.png' : '/img/zoomOutGray.png') + '")'

                },
                onclick: function () {
                    LayoutService.layoutType = LayoutService.layoutType === 1 ? 2 : 1;
                    ImageService.imageForcedUpdate();
                }
            },
            children: LayoutService.layoutType === 1 ? "Скрывать боковую панель" : "Зафиксировать боковую панель"
        };

        const tools = {
            children: [
                m('a.btnMenu.button', { href: '/#!/player/' },
                    "Меню обучающих программ"
                ),
                m('a.btnLayoutType.button', btnSetLayoutType.attrs,
                    btnSetLayoutType.children
                ),
                m('a.button', {onclick: function () {m.redraw();}}, 'Обновить кадр'),
                LayoutService.mode === 2 ? m("input[type=text][size=8].block#timerDisplay", {
                    value: PlayerService.timePassed
                }) : null,
                m(AudioPlayerComponent)
            ]
        };

        const imageCanvas = {
            attrs: {
                width: ImageService.imageOriginalWidth,
                height: ImageService.imageOriginalHeight,
                style: {
                    width: ImageService.imageWidth + 'px',
                    height: ImageService.imageHeight + 'px'
                },
                onclick: function(e) {
                    CheckActionService.click(e);
                },
                ondblclick: function(e) {
                    CheckActionService.dblclick(e);
                },
                onmousedown: function (e) {
                    CheckActionService.mousedown(e);
                },
                onmouseup: function (e) {
                    CheckActionService.mouseup(e);
                },
                onmousemove: function (e) {
                    CheckActionService.mousemove(e);
                },
                onmouseout: function (e) {
                    CheckActionService.mouseout(e);
                },
                oncontextmenu: function (e) {
                    CheckActionService.contextmenu(e);
                },
                onwheel: CheckActionService.wheel, // IE9+, FF17+, Ch31+
                onmousewheel: CheckActionService.mousewheel, // Устаревший вариант события
                MozMousePixelScroll: CheckActionService.MozMousePixelScroll // Firefox < 17
            }
        };

        return m('.container-fluid',
            m('.row',
                m('.nopadding', {
                        class: LayoutService.layoutType === 1 ? 'col-12 col-sm-10' : 'col-12 paddingForSidebarHiding'
                    },
                    m('.flexColumn',
                        m('.task#task',
                            m('p', taskText.children),
                            m('.triangle-topleft-blue'),
                            m('.triangle-bottomright-blue')
                        ),
                        m('#imageBlock',
                            m('#imageBorder[name=imageBorder]', {
                                    class: HintService.mistakeDisplay ? 'error' : '',
                                    style: {
                                        width: ImageService.imageWidth + 20 + 'px'
                                    }
                                },
                                m('canvas#imageCanvas', imageCanvas.attrs),
                                m(HintComponent)
                            )
                        )
                    )
                ),
                m('#sidebar.nopadding', {
                        class: LayoutService.layoutType === 1 ? 'col-12 col-sm-2' : 'col-6 sidebarHiding'
                    },
                    m('.flexColumn',
                        m('.helper', helper.attrs,
                            helper.children),
                        m('img.notification', notification.attrs),
                        m('.tools', tools.children)
                    )
                )
            )
        )
    }

};

module.exports = PlayerPage;