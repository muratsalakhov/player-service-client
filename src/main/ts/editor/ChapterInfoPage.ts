import { ChapterEditor } from "./service/ChapterEditor";
import * as m from "mithril";

export class ChapterInfoPage implements m.ClassComponent {

    constructor(private readonly editor: ChapterEditor) {}

    view(): m.Children {
        const inputName = {
            attrs: {
                value: this.editor.chapter.name,
                oninput: e => {
                    this.editor.chapter.name = e.target.value;
                    this.editor.notifyDataChanged();
                }
            }
        };
        return m("",
            m("label[for=name]", "Название"),
            m("input[type=text][name=name].full-width", inputName.attrs)
        );
    }
}
