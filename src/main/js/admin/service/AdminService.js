const request = require('../../request');

var adminService = {
    groups: [],
    editingGroupId: null,
    currentGroupId: null,
    currentGroupName: null,
    accounts: [],
    currentAccountId: null,
    hidePassword: false,
    hideAddUserForm: true,
    hideAddGroupForm: true,

    loadGroups: function () {
        request.getGroups().then(function (groups) {
            adminService.groups = groups;
        });
    },

    chooseGroup: function (id, name) {
        this.currentGroupId = id;
        this.currentGroupName = name;
        this.currentAccountId = null;
    },

    addGroup: function (form) {
        request.addGroup(form.name.value, form.soundMode.checked).then(function () {
            adminService.loadGroups();
            adminService.hideAddGroupForm = true;
            alert('Группа создана');
        }).catch(function () {
            alert('Группа не была создана');
        })
    },

    editGroup: function (form) {
        request.editGroup(form.id.value, form.name.value, form.soundMode.checked).then(function () {
            adminService.loadGroups();
            alert('Изменения сохранены');
        }).catch(function () {
            alert('Изменения не были сохранены');
        })
    },

    deleteGroup: function (id) {
        request.deleteGroup(id).then(function () {
            adminService.loadGroups();
            alert('Группа удалена');
        }).catch(function (reason) {
            alert('Группа не была удалена');
        })
    },

    chooseAccount: function (id) {
        this.currentAccountId = id;
    },

    loadAccounts: function () {
        this.accounts = [];
        this.currentAccountId = null;
        this.currentGroupId = null;
        this.currentGroupName = null;
        request.getAccounts().then(function (accounts) {
            adminService.accounts = accounts;
        })
    },

    loadAccountsForGroup: function (groupId) {
        adminService.accounts = [];
        adminService.currentAccountId = null;
        request.getGroupInfo(adminService.currentGroupId).then(function (groupInfo) {
            adminService.accounts = groupInfo.accounts;
        })
    },

    addAccount: function (form) {
        const password = form.password.value;
        if (password.length < 5) {
            alert('Пароль не соответствует требованиям');
        }
        else {
            const login = form.login.value;
            const name = form.name.value;
            var accountGroupIds = [];
            Object.keys(form.groupId.options).forEach(function(key) {
                if (form.groupId.options[key].selected) {
                    accountGroupIds.push(form.groupId.options[key].value);
                }
            });
            const optionsLength = form.groupId.options.length;
            if (optionsLength > 0 && !form.groupId.options[0].selected) {
                accountGroupIds = [];
                for (var i = 0; i < optionsLength; i++) {
                    if (form.groupId.options[i].selected) {
                        accountGroupIds[accountGroupIds.length] = form.groupId.options[i].value;
                    }
                }
            }
            const isActive = form.active.checked;
            const isEditor = form.isEditor.checked;
            const isAdmin = form.isAdmin.checked;
            request.addAccount(login, name, accountGroupIds, isActive, isEditor, isAdmin, password).then(function () {
                if (adminService.currentGroupId) {
                    adminService.loadAccountsForGroup(adminService.currentGroupId);
                } else {
                    adminService.loadAccounts();
                }
                adminService.hideAddUserForm = true;
                alert('Пользователь добавлен');
            }).catch(function (reason) {
                alert('Пользователь не был добавлен');
            })
        }
    },

    updateAccount: function (form) {
        const password = form.password.value;
        if (password.length > 0 && password.length < 5) {
            alert('Пароль не соответствует требованиям');
        }
        else {
            const id = form.id.value;
            const login = form.login.value;
            const name = form.name.value;
            var accountGroupIds = [];
            Object.keys(form.groupId.options).forEach(function(key) {
                if (form.groupId.options[key].selected) {
                    accountGroupIds.push(form.groupId.options[key].value);
                }
            });
            const optionsLength = form.groupId.options.length;
            if (optionsLength > 0 && !form.groupId.options[0].selected) {
                accountGroupIds = [];
                for (var i = 0; i < optionsLength; i++) {
                    if (form.groupId.options[i].selected) {
                        accountGroupIds[accountGroupIds.length] = form.groupId.options[i].value;
                    }
                }
            }
            const isActive = form.active.checked;
            const isEditor = form.isEditor.checked;
            const isAdmin = form.isAdmin.checked;
            request.updateAccount(id, login, name, accountGroupIds, isActive, isEditor, isAdmin).then(function () {
                if (adminService.currentGroupId) {
                    adminService.loadAccountsForGroup(adminService.currentGroupId);
                } else {
                    adminService.loadAccounts();
                }
                if (password.length > 0) {
                    request.updateAccountPassword(id, password).catch(function (reason) {
                        alert('Пароль не был сохранён');
                    })
                }
            }).catch(function (reason) {
                alert('Изменения не были сохранены');
            })
        }
    },

    deleteAccount: function (id) {
        if (confirm('Удалить пользователя с id ' + id + '?')) {
            request.deleteAccount(id).then(function () {
                if (adminService.currentGroupId) {
                    adminService.loadAccountsForGroup(adminService.currentGroupId);
                } else {
                    adminService.loadAccounts();
                }
            });
        }
    }
};

module.exports = adminService;