import { getStatus, startBus, stopBus, publishUpdate } from "../js/request";
import * as m from "mithril";

export class BusPage implements m.ClassComponent {

    private isRunning = false;
    private address: string = null;

    oninit() {
        getStatus().then((status: { isRunning: boolean, address: string }) => {
            this.isRunning = status.isRunning;
            this.address = status.address;
        });
    }

    onremove() {
        this.address = null;
    }

    view(): m.Children {
        if (this.address == null) return;
        const txtStatus = {
            attrs: {
                class: this.isRunning ? "green" : "orange"
            },
            text: this.isRunning ? "связь установлена" : "связь отсутствует"
        };
        const btnChangeStatus = {
            attrs: {
                onclick: () => {
                    if (this.isRunning) {
                        stopBus().then(() => this.isRunning = false);
                    } else {
                        startBus().then(() => this.isRunning = true);
                    }
                }
            },
            text: this.isRunning ? "Отключиться от шины" : "Подключиться к шине"
        };
        const formUpdate = {
            attrs: {
                onsubmit: (e: Event) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    publishUpdate(new FormData(form));
                    form.reset();
                }
            }
        };
        return m(".container",
            m(".centered",
                m("h2", "Сервисная шина"),
                m("p",
                    m("b", "Адрес сервиса: "), this.address,
                    m("br"),
                    m("b", "Статус: "), m("span", txtStatus.attrs, txtStatus.text)
                ),
                m("button", btnChangeStatus.attrs, btnChangeStatus.text)
            ),
            m("hr"),
            m("h3", "Публикация обновлений"),
            m("form", formUpdate.attrs,
                m("",
                    m("label[for=address]", "E-mail адрес сервиса: "),
                    m("input[type=text][name=address]")
                ),
                m("",
                    m("label[for=mainUpdate]", "Основное обновление: "),
                    m("input[type=file][accept=.jar][name=mainUpdate]")
                ),
                m("",
                    m("label[for=updaterUpdate]", "Обновление системы обновления: "),
                    m("input[type=file][accept=.jar][name=updaterUpdate]")
                ),
                m("input[type=submit][value=Отправить]")
            ),
            m("hr"),
            m("a.button", { href: "#!/admin/" }, "Назад")
        );
    }
}
