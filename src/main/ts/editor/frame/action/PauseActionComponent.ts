import { ChapterEditor } from "../../service/ChapterEditor";
import * as m from "mithril";
import { ActionSwitchPause } from "../../../util";
import { ActionService } from "../../service/ActionService";

export class PauseActionComponent implements m.ClassComponent {

    constructor(private readonly editor: ChapterEditor, private readonly actionService: ActionService) {}

    view(): m.Children {
        const actionSwitch: ActionSwitchPause = this.editor.retrieveActionSwitchPause();
        const inputDuration = {
            attrs: {
                value: actionSwitch.duration,
                onchange: e => this.updatePauseDuration(parseInt(e.target.value)),
                oninput: e => this.updatePauseDuration(parseInt(e.target.value))
            }
        };
        return m("label", "Длительность:", m("input[type=number][min=0][step=100]", inputDuration.attrs), "мс");
    }

    private updatePauseDuration(duration: number) {
        if (isNaN(duration)) {
            duration = null;
        }
        this.editor.selectedFrame.switchData.actionSwitch = new ActionSwitchPause(this.editor.currentActionSwitchId,
            duration, this.actionService.selectedElement.id);
        this.editor.notifyDataChanged();
    }
}
