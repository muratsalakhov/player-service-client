import { ChapterEditor } from "../service/ChapterEditor";
import { putTaskVoiceForFrame, putHintVoiceForFrame } from "../../../js/request";
import * as m from "mithril";

export class VoiceComponent implements m.ClassComponent {

    private isExpanded = false;

    constructor(private readonly editor: ChapterEditor) {}

    onremove() {
        this.isExpanded = false;
    }

    view(): m.Children {
        const linkExpand = {
            attrs: {
                onclick: () => this.isExpanded = !this.isExpanded
            }
        };
        const blockVoice = {
            children: null
        };
        if (this.isExpanded) {
            const blockTaskVoice = {
                children: null
            };
            if (this.editor.selectedFrame.taskVoiceLink) {
                const btnDeleteTaskVoice = {
                    attrs: {
                        onclick: () => {
                            this.editor.selectedFrame.taskVoiceId = null;
                            this.editor.selectedFrame.taskVoiceLink = null;
                            this.editor.notifyDataChanged();
                        }
                    }
                };
                blockTaskVoice.children = [
                    m("p", "Озвучивание задачи:"),
                    m(".flex.flex-left",
                        m("audio[controls]", { src: `/data/${this.editor.selectedFrame.taskVoiceLink}` }),
                        m("button[type=button]", btnDeleteTaskVoice.attrs, "Удалить аудиофайл")
                    )
                ];
            } else {
                const inputTaskVoice = {
                    attrs: {
                        onchange: e => {
                            this.editor.save().then(() => {
                                const data = new FormData();
                                const chapterId: number = this.editor.selectedFrame.chapterId;
                                data.append("chapterId", chapterId.toString());
                                const frameNumber: number = this.editor.selectedFrame.frameNumber;
                                data.append("frameNumber", frameNumber.toString());
                                data.append("taskVoice", e.target.files[0]);
                                putTaskVoiceForFrame(data).then(() => this.editor.reloadFrame(chapterId, frameNumber));
                            });
                        }
                    }
                };
                blockTaskVoice.children = [
                    m("label[for=taskVoice]", "Озвучивание задачи:"),
                    m("br"),
                    m("input[type=file][name=taskVoice][accept=.mp3]", inputTaskVoice.attrs)
                ];
            }
            const blockHintVoice = {
                children: null
            };
            if (this.editor.selectedFrame.hintVoiceLink) {
                const btnDeleteHintVoice = {
                    attrs: {
                        onclick: () => {
                            this.editor.selectedFrame.hintVoiceId = null;
                            this.editor.selectedFrame.hintVoiceLink = null;
                            this.editor.notifyDataChanged();
                        }
                    }
                };
                blockHintVoice.children = [
                    m("p", "Озвучивание подсказки:"),
                    m(".flex.flex-left",
                        m("audio[controls]", { src: `/data/${this.editor.selectedFrame.hintVoiceLink}` }),
                        m("button[type=button]", btnDeleteHintVoice.attrs, "Удалить аудиофайл")
                    )
                ];
            } else {
                const inputHintVoice = {
                    attrs: {
                        onchange: e => {
                            this.editor.save().then(() => {
                                const data = new FormData();
                                const chapterId: number = this.editor.selectedFrame.chapterId;
                                data.append("chapterId", chapterId.toString());
                                const frameNumber: number = this.editor.selectedFrame.frameNumber;
                                data.append("frameNumber", frameNumber.toString());
                                data.append("hintVoice", e.target.files[0]);
                                putHintVoiceForFrame(data).then(() => this.editor.reloadFrame(chapterId, frameNumber));
                            });
                        }
                    }
                };
                blockHintVoice.children = [
                    m("label[for=hintVoice]", "Озвучивание подсказки:"),
                    m("br"),
                    m("input[type=file][name=hintVoice][accept=.mp3]", inputHintVoice.attrs)
                ];
            }
            blockVoice.children = [
                m("", blockTaskVoice.children),
                m("", blockHintVoice.children)
            ];
        }
        return m("",
            m("label[for=action].link", linkExpand.attrs, "Озвучивание задачи и подсказки"),
            m("", blockVoice.children),
        );
    }
}
