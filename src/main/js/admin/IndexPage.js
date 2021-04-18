const m = require('mithril');
var adminService = require('./service/AdminService');

module.exports = {

    oninit: function() {
        document.title = 'Панель администратора';
        adminService.loadGroups();
        adminService.loadAccounts();
    },

    view: function() {
        return m('.containerScrolled', [
            m('a.button', { href: '#!/', text: 'На главную' }),
            m("a.button", { href: "#!/bus/" }, "Сервисная шина"),
            m("br"),

            adminService.hideAddGroupForm
                ? m('button[type=button]', {onclick: function () {adminService.hideAddGroupForm = false;}},
                'Создать новую группу')
                : [m('h2', 'Создание новой группы'),
                    m('table.accountList',
                        m('form.selected',
                            m('tr',
                                m('td', 'Название: '),
                                m('td', m('input[name=name][type=text][size=20]'))),
                            m('tr',
                                m('td', 'Режим звука: '),
                                m('td', m('input[name=soundMode][type=checkbox]', {checked: true}))),
                            m('tr',
                                m('td[colspan=2]',
                                    m('button[type=button]', {
                                        onclick: function () {adminService.hideAddGroupForm = true;}},
                                        'Отменить'),
                                    m('button[type=button]', {
                                        onclick: function () {adminService.addGroup(this.form);}},
                                        'Создать')))))],

            adminService.hideAddUserForm
                ? m('button[type=button]', {onclick: function () {adminService.hideAddUserForm = false;}},
                    'Добавить нового пользователя')
                : [m('h2', 'Добавление нового пользователя'),
                    m('table.accountList',
                        m('form.selected',
                            m('tr',
                                m('td', 'Логин: '),
                                m('td',
                                    m('input[name=login][type=text][size=20]'))),
                            m('tr',
                                m('td', 'Имя: '),
                                m('td',
                                    m('input[name=name][type=text][size=20]'))),
                            m('tr',
                                m('td', 'Группа: '),
                                m('td',
                                    m('select[name=groupId][multiple][size=3]',
                                        adminService.groups.map(function (group) {
                                            return m('option', {value: group.id, selected: true}, group.name);})))),
                            m('tr',
                                m('td', 'Пароль: '),
                                m('td',
                                    m('input[name=password][size=16]', {
                                        type: adminService.hidePassword ? 'password' : 'text'}),
                                    m('img', {
                                        src: adminService.hidePassword ? 'img/btnOpen.png' : 'img/btnHide.png',
                                        onclick: function () {
                                            adminService.hidePassword = !adminService.hidePassword;}}))),
                            m('tr',
                                m('td', 'Активен: '),
                                m('td',
                                    m('input[name=active][type=checkbox]', {checked: true}))),
                            m('tr',
                                m('td', 'Редактор: '),
                                m('td',
                                    m('input[name=isEditor][type=checkbox]', {checked: false}))),
                            m('tr',
                                m('td', 'Администратор: '),
                                m('td',
                                    m('input[name=isAdmin][type=checkbox]', {checked: false}))),
                            m('tr',
                                m('td[colspan=2]',
                                    m('button[type=button]', {
                                        onclick: function () {adminService.hideAddUserForm = true;}},
                                        'Отменить'),
                                    m('button[type=button]', {
                                        onclick: function () {adminService.addAccount(this.form);}},
                                        'Добавить')))))],

            m('h2', 'Группы пользователей'),
            m('.block',
                m('ul',
                    m('li',
                        m('a', {onclick: function () {adminService.loadAccounts();}},
                            'Все пользователи')),
                        adminService.groups.map(function(group) {
                            return m('li',
                            m('a', {
                                onclick: function () {
                                    adminService.chooseGroup(group.id, group.name);
                                    adminService.loadAccountsForGroup(group.id);}}, group.name),
                            m('img.btnEdit', {
                                src: 'img/edit.png',
                                onclick: function () {adminService.editingGroupId = group.id;}}),
                            adminService.editingGroupId === group.id
                            ? m('table.accountList',
                                m('form.selected',
                                    m('tr',
                                        m('td', 'Id: '),
                                        m('td',
                                            m('input[name=id][type=text][size=20]', {value: group.id})
                                        ),
                                        m('td[rowspan=3]',
                                            m('button[type=button].mini', {
                                                onclick: function () {adminService.editingGroupId = null;}},
                                                'Отменить'),
                                            m('button[type=button].mini', {
                                                onclick: function () {adminService.editGroup(this.form);}},
                                                'Сохранить'),
                                            m('button[type=button].mini', {
                                                onclick: function () {adminService.deleteGroup(group.id);}},
                                                'Удалить')
                                        )),
                                    m('tr',
                                        m('td', 'Название: '),
                                        m('td',
                                            m('input[name=name][type=text][size=20]', {value: group.name}))),
                                    m('tr',
                                        m('td', 'Режим звука: '),
                                        m('td',
                                            m('input[name=soundMode][type=checkbox]', {checked: group.soundMode})))))
                            : null);}))),

            m('h2', 'Пользователи' + (adminService.currentGroupName
                    ? (' группы ' + adminService.currentGroupName) : '')),
            m('.accountList2', adminService.accounts.map(function(account, index) {
                const selected = account.id === adminService.currentAccountId;
                return [
                    m('form', {id: 'accForm' + index}),
                    m('.block.accountBlock' + (selected ? '.selected' : '') + (!account.active ? '.notActive' : ''),
                        m('input[title=Активность][name=active][type=checkbox]', {
                            checked: account.active,
                            form: 'accForm' + index,
                            disabled: !selected
                        }),
                        selected
                        ? [
                            m('img[title=Отменить][src=img/btnCancel.png]', {
                                onclick: function () {adminService.chooseAccount(null);}
                            }),
                            m('img[title=Сохранить][src=img/btnSave.png]', {
                                onclick: function () {
                                    adminService.updateAccount(document.getElementById('accForm' + index));
                                }
                            }),
                            m('img[title=Удалить][src=img/btnDelete.png]', {
                                onclick: function () {
                                    const accountId = document.getElementById('accForm' + index).id.value;
                                    adminService.deleteAccount(accountId);
                                }
                            }),
                            m('br')
                        ]
                        : m('img.btnEdit[title=Редактировать]', {
                            src: 'img/edit.png',
                            onclick: function () {adminService.chooseAccount(account.id);}
                        }),
                        m('input[title=Логин][name=login][type=text][size=20]', {
                            value: account.login,
                            form: 'accForm' + index,
                            disabled: !selected
                        }),
                        m('input[title=Имя][name=name][type=text][size=20]', {value: account.name,
                            form: 'accForm' + index,
                            disabled: !selected}),
                        m('select[title=Группы][name=groupId][multiple][size=3]', {
                                form: 'accForm' + index,
                                disabled: !selected
                            },
                            adminService.groups.map(function (group) {
                                var inGroup = false;
                                if (account.accountGroupId) {
                                    account.accountGroupId.forEach(function (userGroupId) {
                                        if (userGroupId === group.id) {
                                            inGroup = true;
                                        }
                                    });
                                }
                                return m('option', {
                                    value: group.id,
                                    selected: inGroup
                                }, group.name);
                            })
                        ),
                        selected
                        ? [
                            m('br'),
                            m('input[title=Идентификатор][name=id][type=text][size=20]', {value: account.id,
                                form: 'accForm' + index, disabled: true}),
                            m('input[title=Пароль][name=password][class=passwordInput][size=16]', {
                                type: adminService.hidePassword ? 'password' : 'text',
                                form: 'accForm' + index}),
                            m('img[title=Показать/Скрыть пароль]', {
                                src: adminService.hidePassword ? 'img/btnOpen.png' : 'img/btnHide.png',
                                onclick: function () {adminService.hidePassword = !adminService.hidePassword;}})
                        ]
                        : null,
                        m('.clear',
                            m('input[title=Редактор][name=isEditor][type=checkbox]', {
                                checked: account.editor,
                                form: 'accForm' + index,
                                disabled: !selected
                            }),
                            'Редактор'
                        ),
                        m('.clear',
                            m('input[title=Администратор][name=isAdmin][type=checkbox]', {
                                checked: account.admin,
                                form: 'accForm' + index,
                                disabled: !selected
                            }),
                            'Администратор'
                        )
                    )
                ]
            }))]
        )
    }
};