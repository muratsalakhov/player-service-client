import { FrameConverter } from "./service/FrameConverter";
import { ChapterEditor } from "./service/ChapterEditor";
import { Frame } from "../util";
import { putBase64PictureForFrame } from "../../js/request";
import * as m from "mithril";

export class AdvancedSettingsPage implements m.ClassComponent {

    private isWorking = false;
    private framesConverted = 0;
    private currentChapterId = 0;
    private currentConverter: FrameConverter;

    constructor(private readonly editor: ChapterEditor) {}

    onremove() {
        this.reset();
    }

    view(): m.Children {
        if (this.editor.chapter.id != this.currentChapterId) {
            this.reset();
            this.currentChapterId = this.editor.chapter.id;
            this.editor.reloadChapter();
        }

        const inputPictureWidth = {
            attrs: {
                value: this.editor.chapter.pictureWidth,
                onchange: e => this.updatePictureWidth(parseInt(e.target.value)),
                oninput: e => this.updatePictureWidth(parseInt(e.target.value))
            }
        };
        const inputPictureHeight = {
            attrs: {
                value: this.editor.chapter.pictureHeight,
                onchange: e => this.updatePictureHeight(parseInt(e.target.value)),
                oninput: e => this.updatePictureHeight(parseInt(e.target.value))
            }
        };

        const blockConverter = {
            children: null
        };
        if (this.editor.chapter.frames && this.editor.chapter.frames.length > 1) {
            const txtStatus = {
                text: "Ожидание..."
            };
            if (this.isWorking) {
                const framesToConvert: number = this.editor.chapter.frames.length - 1;
                txtStatus.text = `Кадров сжато: ${this.framesConverted} / ${framesToConvert}`;
            }
            const btnConvert = {
                attrs: {
                    disabled: this.isWorking,
                    onclick: () => {
                        this.isWorking = true;
                        const converter = new FrameConverter(this.editor.chapter.frames);
                        this.currentConverter = converter;
                        converter.convertFrames((frame: Frame, data: string) => {
                            putBase64PictureForFrame(frame.chapterId, frame.frameNumber, data.slice(22));
                            if (this.currentConverter == converter) {
                                this.framesConverted++;
                                m.redraw();
                            }
                        });
                    }
                }
            };
            blockConverter.children = [
                m("h3", "Сжатие кадров"),
                m("h4", txtStatus.text),
                m("button[type=button]", btnConvert.attrs, "Сжать кадры")
            ];
        }

        return m("",
            m("label", "Ширина кадра:", m("input[type=number][min=0]", inputPictureWidth.attrs)),
            m("br"),
            m("label", "Высота кадра:", m("input[type=number][min=0]", inputPictureHeight.attrs)),
            m(".centered", blockConverter.children)
        );
    }

    private updatePictureWidth(width: number) {
        if (isNaN(width)) {
            width = null;
        }
        this.editor.chapter.pictureWidth = width;
        this.editor.notifyDataChanged();
    }

    private updatePictureHeight(height: number) {
        if (isNaN(height)) {
            height = null;
        }
        this.editor.chapter.pictureHeight = height;
        this.editor.notifyDataChanged();
    }

    private reset() {
        this.isWorking = false;
        this.framesConverted = 0;
        this.currentChapterId = 0;
        this.currentConverter = null;
    }
}
