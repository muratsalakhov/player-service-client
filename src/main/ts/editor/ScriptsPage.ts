import { ScriptService } from "./service/ScriptService";
import * as m from "mithril";

export class ScriptsPage implements m.ClassComponent {

    constructor(private readonly scriptService: ScriptService) {}

    oninit() {
        this.scriptService.reload();
    }

    onremove() {
        this.scriptService.reset();
    }

    view(): m.Children {
        const selectScript = {
            attrs: {
                onchange: e => this.scriptService.selectElement(e.target.value)
            },
            children: this.scriptService.elements.map((s, i) =>
                m("option", { selected: this.scriptService.selectedIndex == i, value: i }, s.name))
        };

        const blockScript = {
            children: null
        };
        if (this.scriptService.selectedElement) {
            const checkIsActive = {
                attrs: {
                    checked: this.scriptService.selectedElement.isActive,
                    onclick: e => {
                        this.scriptService.selectedElement.isActive = e.target.checked;
                        this.scriptService.notifySelectedScriptChanged();
                    }
                }
            };
            const inputName = {
                attrs: {
                    value: this.scriptService.selectedElement.name,
                    oninput: e => {
                        this.scriptService.selectedElement.name = e.target.value;
                        this.scriptService.notifySelectedScriptChanged();
                    }
                }
            };
            const btnDelete = {
                attrs: {
                    onclick: () => this.scriptService.deleteSelectedScript()
                }
            };
            blockScript.children = [
                m("",
                    m("input[type=text]", inputName.attrs),
                    m("label", m("input[type=checkbox]", checkIsActive.attrs), " активна")
                ),
                m("button[type=button]", btnDelete.attrs, "Удалить обучающую программу")
            ]
        }

        return m(".centered",
            m("label", "Обучающая программа: ", m("select", selectScript.attrs, selectScript.children)),
            m("a.button.mini", { href: "#!/editor/script/new/" }, "+"),
            m("", blockScript.children)
        );
    }
}
