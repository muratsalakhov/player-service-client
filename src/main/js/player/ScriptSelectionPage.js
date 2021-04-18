const m = require('mithril');
var PlayerService = require('./service/PlayerService');
var LayoutService = require('./service/LayoutService');
var ScriptDataService = require('./service/ScriptDataService');
require('../../css/player.css');
const AudioSettingsComponent = require('./frame/audio/AudioSettingsComponent');

var ScriptSelectionPage = {

    oninit: function () {
        document.title = 'Меню обучающих программ';
        document.body.oncontextmenu = function (e) {
            e.preventDefault();
        };
        document.body.onclick = function (e) {
            if (e.which !== 1) e.preventDefault();
        };
        PlayerService.loadActiveScripts();
    },

    view: function () {
        const scriptSelect = {
            children: [
                m('h2', 'Выберите обучающую программу:'),
                ScriptDataService.scripts.length === 0
                    ? 'Этому аккаунту не назначено ни одной обучающей программы'
                    : m('ul',
                    ScriptDataService.scripts.map(function (scriptInfo) {
                        const script = scriptInfo.script || scriptInfo;
                        return m('li.decimal',
                            m('a', {
                                onclick: function () {
                                    PlayerService.playAllScript(script.id)
                                }
                            }, script.name),
                            m('a[title=Запустить все разделы обучающей программы]', {
                                    onclick: function () {
                                        PlayerService.playAllScript(script.id)
                                    }
                                },
                                m('img[src=img/playBtn2.png]')
                            )
                        );
                    })
                )
            ]
        };

        const chapterSelect = {
            children: PlayerService.scriptIsSelected ? [
                m('h2', 'Выберите раздел:'),
                m('ul',
                    ScriptDataService.chapters.map(function (chapter) {
                            return m('li.decimal',
                                m('a', {
                                    onclick: function () {
                                        PlayerService.playChapter(chapter.id);
                                    }
                                }, chapter.name)
                            )
                        }
                    )
                )
            ] : null
        };

        const btnSetLayoutType = {
            create: function (LayoutType) {
                return m('a.button.btnSetLayoutType', {
                        class: LayoutService.layoutType === LayoutType ? 'btnSelected' : null,
                        onclick: function () {
                            LayoutService.layoutType = LayoutService.layoutType === 1 ? 2 : 1;
                        }
                    },
                    LayoutType === 1 ? m('img[src=img/layoutType2.png][title=Скрывать боковую панель]') :
                        m('img[src=img/layoutType1.png][title=Зафиксировать боковую панель]')
                )
            }
        };

        const btnSetMode = {
            create: function (mode) {
                return m('a.button', {
                        class: LayoutService.mode === mode ? 'btnSelected' : null,
                        onclick: function () {
                            LayoutService.mode = LayoutService.mode === 1 ? 2 : 1;
                        }
                    },
                    mode === 1 ? 'Обучение' : 'Экзамен'
                )
            }
        };

        const settings = {
            children: [
                m('h2', 'Настройки:'),
                m('h3', 'Боковая панель:'),
                btnSetLayoutType.create(1),
                btnSetLayoutType.create(2),
                m('h3', 'Режим проигрывания:'),
                btnSetMode.create(1),
                btnSetMode.create(2),
                m('h3', 'Озвучивание текстов:'),
                m(AudioSettingsComponent)
            ]
        };

        return m('.container-fluid.containerScrolled',
            m('.row',
                m('h1.col-12.centered', 'Меню обучающих программ')
            ),
            m('.row',
                m('.col-12.col-md-6',
                    m('.block',
                        m('', scriptSelect.children),
                        m('', chapterSelect.children)
                    )
                ),
                m('.col-12.col-md-6',
                    m('.block',
                        m('', settings.children)
                    )
                )
            ),
            m('.row',
                m('.col-12.centered',
                    m('a.button.centered', {href: '#!/', text: 'На главную'})
                )
            )
        )
    }

};

module.exports = ScriptSelectionPage;