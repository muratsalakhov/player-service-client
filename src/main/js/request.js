var m = require('mithril');

module.exports = {

    postLogin: function(data) {
        return m.request('/api/login/', {
            method: 'POST',
            data: data
        });
    },

    getAccounts: function() {
        return m.request('/api/account/', {
            method: 'GET'
        });
    },

    getGroups: function() {
        return m.request('/api/group/', {
            method: 'GET'
        });
    },

    getGroupInfo: function (id) {
        return m.request('/api/group/' + id + '/', {
            method: 'GET'
        });
    },

    editGroup: function (id, name, soundMode) {
        return m.request('/api/group/', {
            method: 'PUT',
            data: { id: id, name: name, soundMode: soundMode }
        });
    },

    deleteGroup: function (id) {
        return m.request('/api/group/' + id + '/', {
            method: 'DELETE'
        });
    },

    addGroup: function (name, soundMode) {
        return m.request('/api/group/', {
            method: 'POST',
            data: { name: name, soundMode: soundMode }
        });
    },

    addAccount: function (login, name, accountGroupId, isActive, isEditor, isAdmin, password) {
        return m.request('/api/account/', {
            method: 'POST',
            data: { login: login, name: name, accountGroupId: accountGroupId, isActive: isActive,
                isEditor: isEditor, isAdmin: isAdmin, password: password }
        });
    },

    updateAccount: function (id, login, name, accountGroupId, isActive, isEditor, isAdmin) {
        return m.request('/api/account/', {
            method: 'PUT',
            data: { id: id, login: login, name: name, accountGroupId: accountGroupId, isActive: isActive,
                isEditor: isEditor, isAdmin: isAdmin }
        });
    },

    updateAccountPassword: function (id, password) {
        return m.request('/api/account/password/', {
            method: 'PUT',
            useBody: false,
            data: { id: id, password: password }
        });
    },

    deleteAccount: function (id) {
        return m.request('/api/account/' + id + '/', {
            method: 'DELETE'
        });
    },

    getScripts: function() {
        return m.request('/api/script/');
    },

    getMongoScripts: function() {
        return m.request('/api/script/mongo');
    },

    getActiveScripts: function() {
        return m.request('/api/script/active/');
    },

    getCurrentAccount: function () {
        return m.request('/api/account/current/');
    },

    getScriptsForAccount: function (accountId) {
        return m.request('/api/account/script/' + accountId + '/');
    },

    addScript: function(script) {
        return m.request('/api/script/mongo', {
            method: 'POST',
            data: script
        });
    },

    updateScript: function(script) {
        return m.request('/api/script/mongo', {
            method: 'PUT',
            data: script
        });
    },

    getScript: function(id) {
        return m.request('/api/script/:id/', {
            data: { id: id }
        });
    },

    deleteScript: function(id) {
        return m.request('/api/script/:id/mongo', {
            method: 'DELETE',
            data: { id: id }
        });
    },

    getChapters: function() {
        return m.request('/api/chapter/');
    },

    addChapter: function(chapter) {
        return m.request('/api/chapter/', {
            method: 'POST',
            data: chapter
        });
    },

    updateChapter: function(chapter) {
        return m.request('/api/chapter/', {
            method: 'PUT',
            data: chapter
        });
    },

    getChapter: function(id) {
        return m.request('/api/chapter/:id/', {
            data: { id: id }
        });
    },

    deleteChapter: function(id) {
        return m.request('/api/chapter/:id/', {
            method: 'DELETE',
            data: { id: id }
        });
    },

    postSession: function(scriptId, chapterId) {
        return m.request('/api/session/', {
            method: 'POST',
            useBody: false,
            data: { scriptId: scriptId, chapterId: chapterId }
        });
    },

    getFrame: function(chapterId, frameNumber) {
        return m.request('/api/frame/', {
            data: { chapterId: chapterId, frameNumber: frameNumber }
        });
    },

    putPictureForFrame: function(formData) {
        return m.request("/api/frame/picture/", {
            method: "PUT",
            data: formData
        });
    },

    putBase64PictureForFrame: function(chapterId, frameNumber, picture) {
        return m.request("/api/frame/base64/", {
            method: "PUT",
            data: { chapterId: chapterId, frameNumber: frameNumber, picture: picture }
        });
    },

    putTaskVoiceForFrame: function(formData) {
        return m.request("/api/frame/task-voice/", {
            method: "PUT",
            data: formData
        });
    },

    putHintVoiceForFrame: function(formData) {
        return m.request("/api/frame/hint-voice/", {
            method: "PUT",
            data: formData
        });
    },

    checkAction: function(action) {
        return m.request('/api/frame/check/', {
            method: 'POST',
            data: action
        });
    },

    getActions: function() {
        return m.request("/api/action/");
    },

    getTaskTexts: function() {
        return m.request("/api/dictionary/task/");
    },

    getHintTexts: function() {
        return m.request("/api/dictionary/hint/");
    },

    getStatus: function() {
        return m.request("/api/bus/status/");
    },

    startBus: function() {
        return m.request("/api/bus/start/", { method: "POST" });
    },

    stopBus: function() {
        return m.request("/api/bus/stop/", { method: "POST" });
    },

    publishUpdate: function(update) {
        return m.request("/api/bus/update/", {
            method: "POST",
            data: update
        });
    }
};
