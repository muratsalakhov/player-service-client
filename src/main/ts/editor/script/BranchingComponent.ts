import * as m from "mithril";
import { ChapterService } from "../service/ChapterService";
import { ScriptCreationService } from "../service/ScriptCreationService";
import { Chapter } from "../../util";

export class BranchingComponent implements m.ClassComponent {

    constructor(
        private readonly chapterService: ChapterService,
        private readonly scriptCreationService: ScriptCreationService
    ) {}

    oninit() {
        this.chapterService.loadFullChapter(this.scriptCreationService.currentChapter.chapterId);
    }

    view(): m.Children {
        const branchPoints = {
            children: this.scriptCreationService.currentChapter.branchPoints.map((p, i) => {
                if (p.rightChapterId == null) {
                    p.rightChapterId = this.chapterService.elements[0].id
                    this.chapterService.loadFullChapter(p.rightChapterId);
                }
                const leftChapter: Chapter = this.chapterService.findChapterById(this.scriptCreationService.currentChapter.chapterId);
                const rightChapter: Chapter = this.chapterService.findChapterById(p.rightChapterId);

                const selectLeftFrameStart = {
                    attrs: {
                        onchange: e => p.leftFrameNumberStart = e.target.value
                    },
                    children: leftChapter && leftChapter.frames ? leftChapter.frames.map(f =>
                        m("option",
                            { selected: p.leftFrameNumberStart == f.frameNumber, value: f.frameNumber },
                            `Кадр ${f.frameNumber}: ${f.hintText}`)
                    ) : null
                };
                const selectLeftFrameFinish = {
                    attrs: {
                        onchange: e => p.leftFrameNumberFinish = e.target.value
                    },
                    children: leftChapter && leftChapter.frames ? leftChapter.frames.map(f =>
                        m("option",
                            { selected: p.leftFrameNumberFinish == f.frameNumber, value: f.frameNumber },
                            `Кадр ${f.frameNumber}: ${f.hintText}`)
                    ) : null
                };

                const selectRightChapter = {
                    attrs: {
                        onchange: e => {
                            p.rightChapterId = e.target.value;
                            this.chapterService.loadFullChapter(p.rightChapterId);
                        }
                    },
                    children: this.chapterService.elements.map(c =>
                        m("option", { selected: p.rightChapterId == c.id, value: c.id }, c.name))
                };
                const selectRightFrameStart = {
                    attrs: {
                        onchange: e => p.rightFrameNumberStart = e.target.value
                    },
                    children: rightChapter && rightChapter.frames ? rightChapter.frames.slice(1, rightChapter.frames.length - 1)
                        .map(f =>
                            m("option",
                                { selected: p.rightFrameNumberStart == f.frameNumber, value: f.frameNumber },
                                `Кадр ${f.frameNumber}: ${f.hintText}`
                            )
                    ) : null
                };
                const selectRightFrameFinish = {
                    attrs: {
                        onchange: e => p.rightFrameNumberFinish = e.target.value
                    },
                    children: rightChapter && rightChapter.frames ? rightChapter.frames.slice(1, rightChapter.frames.length - 1)
                        .map(f =>
                            m("option",
                                { selected: p.rightFrameNumberFinish == f.frameNumber, value: f.frameNumber },
                                `Кадр ${f.frameNumber}: ${f.hintText}`
                            )
                    ) : null
                };

                const btnDeleteBranchPoint = {
                    attrs: {
                        onclick: () => this.scriptCreationService.currentChapter.branchPoints.splice(i, 1)
                    }
                };

                return m("",
                    m("h4.centered", `Точка ветвления ${i + 1}`),
                    m(".flex.flex-space",
                        m("",
                            m(".flex.flex-left",
                                m("",
                                    m("", m("label[for=start]", "Начало ветвления")),
                                    m("",
                                        m("select[name=start]",
                                            selectLeftFrameStart.attrs, selectLeftFrameStart.children),
                                    ),
                                )
                            ),
                            m(".flex.flex-left",
                                m("",
                                    m("", m("label[for=end]", "Окончание ветвления")),
                                    m("",
                                        m("select[name=end]",
                                            selectLeftFrameFinish.attrs, selectLeftFrameFinish.children),
                                    ),
                                )
                            )
                        ),
                        m("",
                            m(".flex.flex-left",
                                m("",
                                    m("", m("label[for=chapter]", "Присоединённый раздел")),
                                    m("",
                                        m("select[name=chapter]",
                                            selectRightChapter.attrs, selectRightChapter.children),
                                        m(".flex.flex-left",
                                            m("",
                                                m("", m("label[for=join-start]", "Первый присоединённый кадр")),
                                                m("",
                                                    m("select[name=join-start]",
                                                        selectRightFrameStart.attrs, selectRightFrameStart.children),
                                                ),
                                            )
                                        ),
                                        m(".flex.flex-left",
                                            m("",
                                                m("", m("label[for=join-end]", "Последний присоединённый кадр")),
                                                m("",
                                                    m("select[name=join-end]",
                                                        selectRightFrameFinish.attrs, selectRightFrameFinish.children),
                                                ),
                                            )
                                        )
                                    ),
                                )
                            )
                        )
                    ),
                    m(".centered",
                        m("button[type=button]", btnDeleteBranchPoint.attrs, "Удалить точку ветвления")
                    ),
                    m("hr")
                )
            })
        };
        const btnAddBranchPoint = {
            attrs: {
                onclick: () => this.scriptCreationService.addBranchPoint()
            }
        };

        const btnNext = {
            attrs: {
                disabled: this.scriptCreationService.isSaving,
                onclick: () => this.scriptCreationService.nextStep()
            }
        };

        return m(".container.overflow",
            m("h2.centered", "Редактирование ветвлений"),
            m("h3.centered", this.scriptCreationService.currentChapter.chapterName),
            m("hr"),
            m("", branchPoints.children),
            m("button[type=button]", btnAddBranchPoint.attrs, "Добавить точку ветвления"),
            m("br"),
            m("button[type=button]", btnNext.attrs, "Далее"),
            m("a.button", { href: "#!/editor/script/" }, "Назад")
        );
    }
}
