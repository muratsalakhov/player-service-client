import { ChapterEditor } from "./service/ChapterEditor";
import { ChapterService } from "./service/ChapterService";
import * as m from "mithril";

export class ChaptersLayout implements m.ClassComponent {

    constructor(private readonly chapterService: ChapterService, private readonly editor: ChapterEditor) {}

    oninit() {
        document.title = "Редактор";
        this.chapterService.reload();
    }

    onremove() {
        this.chapterService.reset();
    }

    view(vnode: m.CVnode<any>): m.Children {
        const selectChapter = {
            attrs: {
                onchange: e => this.chapterService.selectElement(e.target.value)
            },
            children: this.chapterService.elements.map((c, i) =>
                m("option", { selected: this.chapterService.selectedIndex == i, value: i }, c.name))
        };

        const btnChapterInfo = {
            attrs: {
                disabled: vnode.attrs.location == "chapterInfo",
                onclick: () => m.route.set("/editor/")
            }
        };
        const btnAdvancedSettings = {
            attrs: {
                disabled: vnode.attrs.location == "chapterAdvanced",
                onclick: () => m.route.set("/editor/advanced/")
            }
        };
        const btnScripts = {
            attrs: {
                disabled: vnode.attrs.location == "script",
                onclick: () => m.route.set("/editor/script/")
            }
        };
        const blockNavigation = {
            children: this.editor.chapter ? [
                m("hr"),
                m("button[type=button]", btnChapterInfo.attrs, "Информация о разделе"),
                m("button[type=button]", btnAdvancedSettings.attrs, "Дополнительные параметры"),
                m("button[type=button]", btnScripts.attrs, "Обучающие программы")
            ] : []
        };

        const btnFrames = {
            attrs: {
                disabled: !this.editor.chapter,
                onclick: () => m.route.set(`/editor/chapter/${this.editor.chapter.id}/`)
            }
        };
        const btnSave = {
            attrs: {
                disabled: !this.editor.isChanged,
                onclick: () => this.editor.save()
            }
        };
        const btnReset = {
            attrs: {
                disabled: !this.editor.isChanged,
                onclick: () => this.editor.reloadChapter()
            }
        };
        const btnDelete = {
            attrs: {
                disabled: !this.editor.chapter,
                onclick: () => this.chapterService.deleteSelectedChapter()
            }
        };

        return m(".container",
            m("h2.centered", "Редактор"),
            m(".flex",
                m("",
                    m("", m("label[for=chapter]", "Раздел")),
                    m("",
                        m("select[name=chapter]", selectChapter.attrs, selectChapter.children), " ",
                        m("a.button.mini", { href: "#!/editor/chapter/new/" }, "+")
                    ),
                )
            ),
            m(".centered", blockNavigation.children),
            m("", this.editor.chapter ? vnode.children : null),
            m("hr"),
            m("button[type=button]", btnFrames.attrs, "Редактор кадров"),
            m("br"),
            m("button[type=button]", btnSave.attrs, this.editor.isSaved ? "Сохранено" : "Сохранить"),
            m("button[type=button]", btnReset.attrs, "Отмена"),
            m("button[type=button]", btnDelete.attrs, "Удалить раздел"),
            m("br"),
            m("a.button", { href: "#!/" }, "Назад")
        );
    }
}
