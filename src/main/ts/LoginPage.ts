import { LoginService } from "./service/LoginService";
import { postLogin } from "../js/request";
import * as m from "mithril";
import { AccountInfo } from "./util";
import { Index } from "./player";

export class LoginPage implements m.ClassComponent {

    private isLoginFailed = false;

    constructor(private readonly loginService: LoginService) {}

    oninit() {
        document.title = 'Авторизация';
    }

    onremove() {
        this.isLoginFailed = false;
    }

    view(): m.Children {
        const formLogin = {
            attrs: {
                onsubmit: (e: Event) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    this.loginService.login({ isActive: true, isAdmin: true, isEditor: true });
                    m.route.set('/');
                    //postLogin(new FormData(form)).then((accountInfo: AccountInfo) => {
                    //    this.loginService.login(accountInfo);
                    //    m.route.set('/');
                    //}).catch(() => this.isLoginFailed = true);
                }
            }
        };
        return m('.containerScrolled.centered',
            m("form.loginForm", formLogin.attrs,
                m('h1', 'Авторизация'),
                m('label', 'Логин:',
                    m('input[type=text][name=login][placeholder=Логин]')
                ),
                m('br'),
                m('label', 'Пароль:',
                    m('input[type=password][name=password][placeholder=Пароль]')
                ),
                m('p', this.isLoginFailed ? "Введены неверные данные для авторизации!" : ""),
                m('input[type=submit][value=Войти]')
            )
        )
    }
}
