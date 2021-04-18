import { ImageComponent } from "./ImageComponent";
import { FrameIconsComponent } from "./FrameIconsComponent";
import { ChapterEditor } from "../service/ChapterEditor";
import { ActionSwitchComponent } from "./action/ActionSwitchComponent";
import { putPictureForFrame } from "../../../js/request";
import * as css from "../../../css/editor.css";
import * as m from "mithril";
import { ActionService } from "../service/ActionService";
import { Dictionary } from "../service/Dictionary";
import { VoiceComponent } from "./VoiceComponent";

export class FramePage implements m.ClassComponent {

    private actionSwitchComponent: ActionSwitchComponent;
    private voiceComponent: VoiceComponent;
    private imageComponent: ImageComponent;
    private frameIconsComponent: FrameIconsComponent;

    constructor(private readonly editor: ChapterEditor,
                private readonly dictionary: Dictionary, private readonly actionService: ActionService) {}

    oninit(vnode: m.CVnode<any>) {
        this.editor.reloadChapter(vnode.attrs.id);
        this.dictionary.reload();
        this.actionService.reload();
        this.frameIconsComponent = new FrameIconsComponent(this.editor);
        this.voiceComponent = new VoiceComponent(this.editor);
        this.actionSwitchComponent = new ActionSwitchComponent(this.editor, this.actionService);
    }

    onremove() {
        this.editor.reset();
        this.dictionary.reset();
        this.actionService.reset();
        this.frameIconsComponent = null;
        this.voiceComponent = null;
        this.actionSwitchComponent = null;
        this.imageComponent = null;
    }

    view(): m.Children {
        if (!this.editor.chapter) return null;
        document.title = this.editor.selectedFrame
            ? `${this.editor.chapter.name}, кадр ${this.editor.selectedFrame.frameNumber}` : this.editor.chapter.name;

        const blockLeftOptions = {
            children: null
        };
        const blockRightOptions = {
            children: null
        };
        const blockImage = {
            children: null
        };
        if (this.editor.selectedFrame) {
            const inputTaskText = {
                attrs: {
                    title: "Текст задачи",
                    placeholder: "Текст задачи",
                    value: this.editor.selectedFrame.taskText,
                    oninput: e => {
                        this.editor.selectedFrame.taskText = e.target.value;
                        this.editor.notifyDataChanged();
                    },
                    onchange: () => this.editor.updateSelectedFrameTaskTextId()
                }
            };
            const listTaskTexts = {
                children: this.dictionary.taskTexts.elements.map(t => m("option", { value: t.text }))
            };
            const inputHintText = {
                attrs: {
                    title: "Текст подсказки",
                    placeholder: "Текст подсказки",
                    value: this.editor.selectedFrame.hintText,
                    oninput: e => {
                        this.editor.selectedFrame.hintText = e.target.value;
                        this.editor.notifyDataChanged();
                    },
                    onchange: () => this.editor.updateSelectedFrameHintTextId()
                }
            };
            const listHintTexts = {
                children: this.dictionary.hintTexts.elements.map(t => m("option", { value: t.text }))
            };
            blockLeftOptions.children = [
                m(".block",
                    m("input[type=text][list=taskTexts][name=taskText].block-content", inputTaskText.attrs),
                    m("datalist#taskTexts", listTaskTexts.children),
                    m(".triangle-topleft-blue"),
                    m(".triangle-bottomright-blue")
                ),
                m(this.actionSwitchComponent)
            ];
            blockRightOptions.children = [
                m(".block",
                    m("input[type=text][list=hintTexts][name=hintText].block-content", inputHintText.attrs),
                    m("datalist#hintTexts", listHintTexts.children),
                    m(".triangle-topleft-red"),
                    m(".triangle-bottomright-red")
                ),
                m(this.voiceComponent)
            ];
            if (this.editor.selectedFrame.pictureLink) {
                if (!this.imageComponent) {
                    this.imageComponent = new ImageComponent(this.editor, this.actionService);
                }
                blockImage.children = m(this.imageComponent);
            } else {
                this.imageComponent = null;
                const inputImage = {
                    attrs: {
                        onchange: e => {
                            this.editor.save().then(() => {
                                const data = new FormData();
                                const chapterId: number = this.editor.selectedFrame.chapterId;
                                data.append("chapterId", chapterId.toString());
                                const frameNumber: number = this.editor.selectedFrame.frameNumber;
                                data.append("frameNumber", frameNumber.toString());
                                data.append("picture", e.target.files[0]);
                                putPictureForFrame(data).then(() => this.editor.reloadFrame(chapterId, frameNumber));
                            });
                        }
                    }
                };
                blockImage.children = [
                    m(".flex.page",
                        m("",
                            m("", m("label[for=picture]", "Загрузка изображения")),
                            m("", m("input[type=file][accept=.png][name=picture]", inputImage.attrs))
                        ),
                    )
                ];
            }
        } else {
            blockImage.children = m(".flex.page", m("h3", "Кадры отсутствуют"));
        }

        return m(`.${css.chapter}`,
            m(`.${css.leftOptions}`, blockLeftOptions.children),
            m(`.${css.rightOptions}`, blockRightOptions.children),
            m(`.${css.content}`, blockImage.children),
            m(this.frameIconsComponent)
        );
    }
}
