import { Chapter, ChapterBranchingData, NewMongoScript, Script } from "../../util";
import { addScript } from "../../../js/request.js";

export class ScriptCreationService {

    static readonly STEP_START = 0;
    static readonly STEP_CHAPTERS = 1;
    static readonly STEP_BRANCHING = 2;
    static readonly STEP_FINISH = 3;

    private _isSaving = false;

    private _step: number = ScriptCreationService.STEP_START;
    private currentChapterIndex = 0;

    private newScript: NewMongoScript = null;

    get isSaving(): boolean {
        return this._isSaving;
    }

    get step(): number {
        return this._step;
    }

    get script(): Script {
        return this.newScript.script;
    }

    get currentChapter(): ChapterBranchingData {
        return this.chapters[this.currentChapterIndex];
    }

    get chapters(): ChapterBranchingData[] {
        return this.newScript.chapters;
    }

    init() {
        this.reset();
        this.newScript = {
            script: {
                isActive: false,
                dragDelta: 100,
                dragTimeFactor: 1,
                scrollMoveFactor: 1
            },
            chapters: []
        };
    }

    addChapter(chapter: Chapter) {
        this.chapters.push({ chapterId: chapter.id, chapterName: chapter.name, branchPoints: [] })
    }

    removeChapter(chapterId: number) {
        this.chapters.forEach((c, i) => {
            if (c.chapterId == chapterId) {
                this.chapters.splice(i, 1);
            }
        })
    }

    swapChapters(firstChapterIndex: number, secondChapterIndex: number) {
        const chapter: ChapterBranchingData = this.chapters[firstChapterIndex];
        this.chapters[firstChapterIndex] = this.chapters[secondChapterIndex];
        this.chapters[secondChapterIndex] = chapter;
    }

    addBranchPoint() {
        this.currentChapter.branchPoints.push({
            leftFrameNumberStart: 1,
            leftFrameNumberFinish: 1,
            rightFrameNumberStart: 1,
            rightFrameNumberFinish: 1
        });
    }

    nextStep() {
        if (this.step < ScriptCreationService.STEP_BRANCHING) {
            this._step++;
        } else if (this.currentChapterIndex < this.newScript.chapters.length - 1) {
            this.currentChapterIndex++;
        } else {
            this._isSaving = true;
            addScript(this.newScript).then(() => {
                this._isSaving = false;
                this._step = ScriptCreationService.STEP_FINISH;
            });

        }
    }

    reset() {
        this._step = ScriptCreationService.STEP_START;
        this.currentChapterIndex = 0;
        this.newScript = null;
    }
}
