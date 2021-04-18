import { Script } from "../../util";
import { deleteScript, getMongoScripts, updateScript } from "../../../js/request";
import { AbstractList } from "./AbstractList";

export class ScriptService extends AbstractList<Script> {

    private isSelectedScriptChanged = false;

    addScript(script: Script) {
        this.elements.push(script);
        this.selectElement(this.elements.length - 1);
    }

    selectElement(index: number) {
        if (this.isSelectedScriptChanged) {
            this.saveSelectedScript();
        }
        super.selectElement(index);
    }

    notifySelectedScriptChanged() {
        this.isSelectedScriptChanged = true;
    }

    deleteSelectedScript() {
        deleteScript(this.selectedElement.id).then(() => {
            this.elements.splice(this.selectedIndex, 1);
            if (this.selectedIndex >= this.elements.length) {
                this.selectElement(this.elements.length - 1);
            }
        });
    }

    reload() {
        getMongoScripts().then((scripts: Script[]) => {
            this.reset();
            this.elements.push(...scripts);
            if (this.selectedIndex == -1 && scripts.length > 0) {
                this.selectElement(0);
            }
        });
    }

    reset() {
        if (this.isSelectedScriptChanged) {
            this.saveSelectedScript();
        }
        super.reset();
        this.selectElement(-1);
    }

    private saveSelectedScript() {
        this.isSelectedScriptChanged = false;
        updateScript(this.selectedElement);
    }
}
