import * as m from "mithril";
import { ScriptCreationService } from "../service/ScriptCreationService";

export class NewScriptChaptersComponent implements m.ClassComponent {

    constructor(private readonly scriptCreationService: ScriptCreationService) {}

    view(): m.Children {
        const blockChapters = {
            children: this.scriptCreationService.chapters.map((c, i) => {
                const btnFrameUp = {
                    attrs: {
                        disabled: i == 0,
                        onclick: () => this.scriptCreationService.swapChapters(i - 1, i)
                    }
                };
                const btnFrameDown = {
                    attrs: {
                        disabled: i == this.scriptCreationService.chapters.length - 1,
                        onclick: () => this.scriptCreationService.swapChapters(i, i + 1)
                    }
                };
                return m(".flex.flex-left",
                    m("", `${i + 1}. ${c.chapterName}`),
                    m(`button[type=button].mini`, btnFrameUp.attrs, "↑"),
                    m(`button[type=button].mini`, btnFrameDown.attrs, "↓")
                )
            })
        };
        const btnNext = {
            attrs: {
                onclick: () => this.scriptCreationService.nextStep()
            }
        };

        return m(".container.overflow",
            m("h3.centered", this.scriptCreationService.script.name),
            m("hr"),
            m("h3", "Порядок разделов:"),
            m("", blockChapters.children),
            m("hr"),
            m("button[type=button]", btnNext.attrs, "Далее"),
            m("a.button", { href: "#!/editor/script/" }, "Отмена")
        );
    }
}
