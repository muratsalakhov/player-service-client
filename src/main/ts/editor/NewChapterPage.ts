import { ChapterService } from "./service/ChapterService";
import { addChapter } from "../../js/request";
import * as m from "mithril";

export class NewChapterPage implements m.ClassComponent {

    private state: State;
    private chapterName = "";

    constructor(private readonly chapterService: ChapterService) {}

    oninit() {
        this.chapterService.reload();
    }

    onremove() {
        this.state = State.Idle;
        this.chapterName = "";
        this.chapterService.reset();
    }

    view(): m.Children {
        const formChapter = {
            attrs: {
                onsubmit: (e: Event) => {
                    e.preventDefault();
                    this.state = State.Processing;
                    addChapter(new FormData(e.target as HTMLFormElement)).then(() => {
                        this.chapterService.notifyNewChapterAdded();
                        m.route.set("/editor/");
                    }).catch(() => this.state = State.Error);
                }
            }
        };
        const inputName = {
            attrs: {
                value: this.chapterName,
                oninput: e => this.chapterName = e.target.value
            }
        };

        const blockState = {
            children: null
        };
        if (this.state == State.Processing) {
            blockState.children = m("b", "Пожалуйста, подождите...");
        } else if (this.state == State.Error) {
            blockState.children = m("b", "Ошибка при загрузке данных!");
        }

        const btnSubmit = {
            attrs: {
                disabled: this.state == State.Processing || this.chapterName.length == 0
            }
        };

        return m(".flex.flex-column.page",
            m("h2", "Новый раздел"),
            m("form", formChapter.attrs,
                m("", m("b", m("label[for=name]", "Название"))),
                m("", m("input[type=text][name=name]", inputName.attrs)),
                m("br"),
                m("", m("label[for=hookData]", "Данные перехватчика")),
                m("", m("input[type=file][accept=.zip][name=hookData]")),
                m("br"),
                m("", blockState.children),
                m("input[type=submit][value=Создать]", btnSubmit.attrs),
                m("a.button", { href: "#!/editor/" }, "Назад")
            )
        );
    }
}

const enum State {
    Idle, Processing, Error
}
