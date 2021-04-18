const m = require('mithril');
var PlayerService = require('./service/PlayerService');
var HintService = require('./service/HintService');

module.exports = {

    oninit: function() {
        document.title = 'Результаты прохождения раздела';
        // Останавливаем секундомер
        clearInterval(PlayerService.timerIntervalId);
        PlayerService.playAllChapters = false;
    },

    view: function() {
        return m('.container-fluid.containerScrolled',
            m('row',
                m('h1.centered', 'Результаты прохождения раздела'),
                m('.block',
                    m('p', 'Раздел пройден успешно'),
                    m('p', 'Время прохождения раздела: ' + PlayerService.timePassed),
                    m('p', 'Количество совершённых ошибок: ' + HintService.mistakesInChapterCount),
                    m("a.button", { href: '/#!/player/' }, "Меню обучающих программ")
                )
            )
        );
    }
};
