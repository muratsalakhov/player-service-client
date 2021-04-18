import * as m from "mithril";
import { ScriptCreationService } from "../service/ScriptCreationService";
import { ChapterService } from "../service/ChapterService";
import { NewScriptStartComponent } from "./NewScriptStartComponent";
import { NewScriptChaptersComponent } from "./NewScriptChaptersComponent";
import { BranchingComponent } from "./BranchingComponent";

export class NewScriptPage implements m.ClassComponent {

    private startComponent: NewScriptStartComponent;
    private chaptersComponent: NewScriptChaptersComponent;
    private branchingComponent: BranchingComponent;

    constructor(
        private readonly chapterService: ChapterService,
        private readonly scriptCreationService: ScriptCreationService
    ) {}

    oninit() {
        document.title = "Новая обучающая программа";
        this.scriptCreationService.init();
        this.chapterService.reload();
        this.startComponent = new NewScriptStartComponent(this.chapterService, this.scriptCreationService);
        this.chaptersComponent = new NewScriptChaptersComponent(this.scriptCreationService);
        this.branchingComponent = new BranchingComponent(this.chapterService, this.scriptCreationService);
    }

    onremove() {
        this.scriptCreationService.reset();
        this.startComponent = null;
        this.chaptersComponent = null;
        this.branchingComponent = null;
    }

    view(): m.Children {
        switch (this.scriptCreationService.step) {
            case ScriptCreationService.STEP_START: return m(this.startComponent);
            case ScriptCreationService.STEP_CHAPTERS: return m(this.chaptersComponent);
            case ScriptCreationService.STEP_BRANCHING: return m(this.branchingComponent);
            default: {
                return m(".flex.page",
                    m(".centered",
                        m("h3", "Обучающая программа успешно добавлена!"),
                        m("a.button", { href: "#!/editor/script/" }, "Вернуться в редактор")
                    )
                );
            }
        }
    }
}
