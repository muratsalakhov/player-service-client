import { FrameCanvas } from "./canvas/FrameCanvas";
import { ChapterEditor } from "../service/ChapterEditor";
import * as m from "mithril";
import { ActionService } from "../service/ActionService";

export class ImageComponent implements m.ClassComponent {

    private static readonly ROOT_ID = "frameContainer";
    private static readonly CANVAS_ID = "frame";

    private frameCanvas: FrameCanvas;

    constructor(private readonly chapterEditor: ChapterEditor, private readonly actionService: ActionService) {}

    oncreate() {
        this.frameCanvas = new FrameCanvas(ImageComponent.ROOT_ID,
            ImageComponent.CANVAS_ID, this.chapterEditor, this.actionService);
        window.onresize = () => this.frameCanvas.resizeCanvas();
    }

    onupdate() {
        if (this.frameCanvas.currentPictureLink == this.chapterEditor.selectedFrame.pictureLink) {
            this.frameCanvas.resizeCanvas();
        } else {
            this.frameCanvas.reloadImage();
        }
    }

    onremove() {
        this.frameCanvas.dispose();
        this.frameCanvas = null;
        window.onresize = null;
    }

    view(): m.Children {
        return m(`.flex.page#${ImageComponent.ROOT_ID}`, m(`canvas#${ImageComponent.CANVAS_ID}`));
    }
}
