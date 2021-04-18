import * as EventEmitter from "eventemitter3";

export abstract class AbstractList<T> extends EventEmitter {

    static readonly NEW_ELEMENT_SELECTED = "newElementSelected";

    private _selectedIndex = 0;
    readonly elements: T[] = [];

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    get selectedElement(): T {
        return this.selectedIndex == -1 ? null : this.elements[this.selectedIndex];
    }

    selectElement(index: number) {
        if (index == this.selectedIndex) return;
        this._selectedIndex = index;
        if (this.selectedElement) {
            this.emit(AbstractList.NEW_ELEMENT_SELECTED, this.selectedElement);
        }
    }

    selectElementById(id: any) {
        this.selectElement(this.findElementIndexById(id));
    }

    abstract reload();

    reset() {
        this.elements.length = 0;
    }

    private findElementIndexById(id: any): number {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i]["id"] == id) return i;
        }
        return 0;
    }
}
