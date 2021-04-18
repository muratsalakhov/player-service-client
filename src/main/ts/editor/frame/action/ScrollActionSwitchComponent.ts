import { ChapterEditor } from "../../service/ChapterEditor";
import { ActionSwitchScroll } from "../../../util";
import * as m from "mithril";

export class ScrollActionSwitchComponent implements m.ClassComponent {

    constructor(private readonly editor: ChapterEditor) {}

    view(): m.Children {
        const actionSwitch: ActionSwitchScroll = this.editor.retrieveActionSwitchScroll();
        return m("p", `Количество щелчков колёсиком мыши: ${actionSwitch.ticksCount}`);
    }
}
