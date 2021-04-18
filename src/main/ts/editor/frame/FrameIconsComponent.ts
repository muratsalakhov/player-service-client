import { ChapterEditor } from "../service/ChapterEditor";
import * as css from "../../../css/editor.css";
import * as m from "mithril";

export class FrameIconsComponent implements m.ClassComponent {

    constructor(private readonly editor: ChapterEditor) {}

    view(): m.Children {
        const btnFrameUp = {
            attrs: {
                disabled: this.editor.isSelectedFrameFirst,
                onclick: () => this.editor.swapSelectedFrameWith(this.editor.selectedFrameIndex - 1)
            }
        };
        const btnFrameDown = {
            attrs: {
                disabled: this.editor.isSelectedFrameLast,
                onclick: () => this.editor.swapSelectedFrameWith(this.editor.selectedFrameIndex + 1)
            }
        };
        const btnAddFrame = {
            attrs: {
                onclick: () => this.editor.addEmptyFrame()
            }
        };
        const scrollFrames = {
            children: this.editor.chapter.frames.map((f, i) => {
                const isFrameSelected = this.editor.selectedFrameIndex == i;
                const iconFrame = {
                    attrs: {
                        onclick: isFrameSelected ? null : () => this.editor.selectedFrameIndex = i
                    }
                };
                if (f.pictureLink) {
                    const imgFrame = {
                        attrs: {
                            class: isFrameSelected ? css.iconSelected : `link ${css.iconUnselected}`,
                            src: `/data/${f.pictureLink}`,
                            title: `Кадр ${f.frameNumber}`
                        }
                    };
                    return m("", iconFrame.attrs, m(`img[width=100%][height=100%].${css.icon}`, imgFrame.attrs));
                }
                return m(`.${css.iconEmpty}`, iconFrame.attrs,
                    m("", { class: isFrameSelected ? css.icon : `link ${css.icon}` }, `Кадр ${f.frameNumber}`)
                );
            })
        };

        const blockDeleting = {
            children: null
        };
        if (this.editor.selectedFrame) {
            const btnDelete = {
                attrs: {
                    onclick: () => {
                        if (this.editor.selectedFrame.pictureLink) {
                            this.editor.deleteSelectedFramePicture();
                        } else {
                            this.editor.deleteSelectedFrame();
                        }
                    }
                },
                text: this.editor.selectedFrame.pictureLink ? "Удалить изображение" : "Удалить кадр"
            };
            blockDeleting.children =
                m(`button[type=button].mini.${css.frameNavigationButton}`, btnDelete.attrs, btnDelete.text)
        }
        const btnSave = {
            attrs: {
                disabled: !this.editor.isChanged,
                onclick: () => this.editor.save()
            }
        };
        const btnReset = {
            attrs: {
                disabled: !this.editor.isChanged,
                onclick: () => this.editor.reloadChapter()
            }
        };

        return m(`.flex.flex-column.${css.frames}`,
            m("",
                m(`button[type=button].mini`, btnFrameUp.attrs, "↑"),
                m(`button[type=button].mini`, btnFrameDown.attrs, "↓"),
                m(`button[type=button].mini`, btnAddFrame.attrs, "+")
            ),
            m(`.${css.scrollFrames}`, scrollFrames.children),
            m(`.centered`,
                m("", blockDeleting.children),
                m("button[type=button].mini", btnSave.attrs, this.editor.isSaved ? "Сохранено" : "Сохранить"),
                m("button[type=button].mini", btnReset.attrs, "Отмена"),
                m("a.button.mini", { href: "#!/editor/" }, "Назад")
            )
        );
    }
}
