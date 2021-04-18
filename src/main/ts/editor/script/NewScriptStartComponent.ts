import * as m from "mithril";
import { ChapterService } from "../service/ChapterService";
import { ScriptCreationService } from "../service/ScriptCreationService";

export class NewScriptStartComponent implements m.ClassComponent {

    constructor(private readonly chapterService: ChapterService, private readonly scriptCreationService: ScriptCreationService) {}

    view(): m.Children {
        const checkIsActive = {
            attrs: {
                checked: this.scriptCreationService.script.isActive,
                onclick: e => {
                    this.scriptCreationService.script.isActive = e.target.checked;
                }
            }
        };
        const inputName = {
            attrs: {
                value: this.scriptCreationService.script.name,
                oninput: e => {
                    this.scriptCreationService.script.name = e.target.value;
                }
            }
        };
        const blockChapters = {
            children: this.chapterService.elements.map(c => {
                const checkIsChosen = {
                    attrs: {
                        onclick: e => {
                            if (e.target.checked) {
                                this.scriptCreationService.addChapter(c)
                            } else {
                                this.scriptCreationService.removeChapter(c.id)
                            }
                        }
                    }
                }
                return m("",
                    m("br"),
                    m("label", m("input[type=checkbox]", checkIsChosen.attrs), c.name)
                )
            })
        };
        const btnNext = {
            attrs: {
                disabled: !this.scriptCreationService.script.name ||
                    this.scriptCreationService.script.name.length == 0 ||
                    this.scriptCreationService.chapters.length == 0,
                onclick: () => this.scriptCreationService.nextStep()
            }
        };

        return m(".container.overflow",
            m(".centered",
                m("h2", "Новая обучающая программа"),
                m("input[type=text][placeholder=Введите название]", inputName.attrs),
                m("label", m("input[type=checkbox]", checkIsActive.attrs), " по умолчанию активна")
            ),
            m("hr"),
            m("h3", "Включает разделы:"),
            m("", blockChapters.children),
            m("hr"),
            m("button[type=button]", btnNext.attrs, "Далее"),
            m("a.button", { href: "#!/editor/script/" }, "Отмена")
        );
    }
}
