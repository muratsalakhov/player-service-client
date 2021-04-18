const request = require('../request');
const m = require('mithril');
var PlayerService = require('./service/PlayerService');
var ScriptDataService = require('./service/ScriptDataService');

const ChangeChapterPage = {

    oninit: function() {
        document.title = 'Смена раздела';
        setTimeout(ChangeChapterPage.openNextChapter, 3000);
    },

    view: function() {
        const currentChapterId = ScriptDataService.currentChapterId;
        const nextChapterIndex = ScriptDataService.chapters.findIndex(function (chapter) {
            return chapter.id === currentChapterId;
        }) + 1;
        const currentChapterName = ScriptDataService.chapters[nextChapterIndex - 1].name;
        const nextChapterName = ScriptDataService.chapters[nextChapterIndex].name;
        return m('.container-fluid.containerScrolled',
            m('row',
                m('h1.centered', 'Переход к следующему разделу'),
                m('.block',
                    m('h2#changeChapterCurrent', nextChapterIndex + '. ' + currentChapterName),
                    m('h2#changeChapterNext', nextChapterIndex + 1 + '. ' + nextChapterName),
                    m('.loadingLine', m('div'))
                )
            )
        );
    },

    openNextChapter: function () {
        const currentChapterId = ScriptDataService.currentChapterId;
        const nextChapterIndex = ScriptDataService.chapters.findIndex(function (chapter) {
            return chapter.id === currentChapterId;
        }) + 1;
        const nextChapterId = ScriptDataService.chapters[nextChapterIndex].id;
        request.postSession(PlayerService.currentScriptId, nextChapterId).then(function() {
            console.log('Сессия создана');
            ScriptDataService.currentChapterId = nextChapterId;
            m.route.set('/player/chapter/' + nextChapterId + '/');
        }).catch(function() {
            alert('Сессия при смене раздела не создана. Обратитесь к администратору');
        });
    }
};

module.exports = ChangeChapterPage;
