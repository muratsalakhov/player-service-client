import { Chapter } from "../../util";
import { deleteChapter, getChapter, getChapters } from "../../../js/request";
import { AbstractList } from "./AbstractList";

export class ChapterService extends AbstractList<Chapter> {

    private isNewChapterAdded = true;

    constructor() {
        super();
        this.on(ChapterService.NEW_ELEMENT_SELECTED, () => this.isNewChapterAdded = false);
    }

    findChapterById(id: number): Chapter {
        return this.elements.filter(c => c.id == id)[0];
    }

    notifyNewChapterAdded() {
        this.selectElement(-1);
        this.isNewChapterAdded = true;
    }

    loadFullChapter(id: number) {
        getChapter(id).then(c => this.updateChapter(c, false));
    }

    updateChapter(chapter: Chapter, isSelected: boolean) {
        if (isSelected) {
            this.elements[this.selectedIndex] = chapter;
        } else {
            const chapterIndex: number = this.elements.indexOf(this.findChapterById(chapter.id));
            if (chapterIndex == -1) {
                this.elements.push(chapter);
            } else {
                this.elements[chapterIndex] = chapter;
            }
        }
    }

    deleteSelectedChapter() {
        deleteChapter(this.selectedElement.id).then(() => {
            this.elements.splice(this.selectedIndex, 1);
            if (this.selectedIndex == this.elements.length) {
                this.selectElement(this.elements.length - 1);
            }
        });
    }

    reload() {
        getChapters().then((chapters: Chapter[]) => {
            this.reset();
            this.elements.push(...chapters);
            if (this.selectedIndex >= chapters.length) {
                this.selectElement(-1);
            }
            if (this.selectedIndex == -1 && chapters.length > 0) {
                this.selectElement(this.isNewChapterAdded ? this.elements.length - 1 : 0);
            }
        });
    }
}
