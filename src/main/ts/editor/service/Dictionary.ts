import { AbstractList } from "./AbstractList";
import { Text } from "../../util";
import { getHintTexts, getTaskTexts } from "../../../js/request";

export class Dictionary {

    readonly taskTexts = new TaskTexts();
    readonly hintTexts = new HintTexts();

    reload() {
        this.taskTexts.reload();
        this.hintTexts.reload();
    }

    reset() {
        this.taskTexts.reset();
        this.hintTexts.reset();
    }
}

abstract class AbstractTextDictionary extends AbstractList<Text> {

    findTextId(text: string): string {
        for (const element of this.elements) {
            if (element.text == text) return element.id;
        }
        return null;
    }
}

class TaskTexts extends AbstractTextDictionary {

    reload() {
        getTaskTexts().then((t: Text[]) => {
            this.reset();
            this.elements.push(...t);
        });
    }
}

class HintTexts extends AbstractTextDictionary {

    reload() {
        getHintTexts().then((t: Text[]) => {
            this.reset();
            this.elements.push(...t);
        });
    }
}
