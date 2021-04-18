import { Frame } from "../../util";

export class FrameConverter {

    private currentFrameIndex = 1;
    private previousImageData: ImageData;
    private currentImageData: ImageData;

    constructor(private readonly frames: Frame[]) {}

    convertFrames(onFrameConvert: (frame: Frame, data: string) => void) {
        if (this.frames && this.frames.length > 1) {
            this.prepareNextImageData(onFrameConvert);
        }
    }

    private prepareNextImageData(onFrameConverted: (frame: Frame, data: string) => void) {
        if (this.currentImageData) {
            this.previousImageData = this.currentImageData;
            this.currentImageData = null;
        } else {
            this.previousImageData = null;
            this.loadImageData(this.frames[this.currentFrameIndex - 1].pictureLink, d => {
                this.previousImageData = d;
                if (this.currentImageData) {
                    this.convertCurrentFrame(onFrameConverted);
                }
            });
        }
        this.loadImageData(this.frames[this.currentFrameIndex].pictureLink, d => {
            this.currentImageData = d;
            if (this.previousImageData) {
                this.convertCurrentFrame(onFrameConverted);
            }
        });
    }

    private loadImageData(pictureLink: string, onImageDataLoad: (imageData: ImageData) => void) {
        const image = new Image();
        image.src = `/data/${pictureLink}`;
        image.onload = () => {
            const canvas: HTMLCanvasElement = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context: CanvasRenderingContext2D = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
            onImageDataLoad(context.getImageData(0, 0, canvas.width, canvas.height));
        };
    }

    private convertCurrentFrame(onFrameConvert: (frame: Frame, data: string) => void) {
        const frame: Frame = this.frames[this.currentFrameIndex];
        frame.isUnderlying = true;

        const prevPixData: Uint8ClampedArray = this.previousImageData.data;
        const currentPixData: Uint8ClampedArray = this.currentImageData.data;
        const pixData: Uint8ClampedArray = new Uint8ClampedArray(prevPixData.length);
        for (let i = 0; i < currentPixData.length; i += 4) {
            if (prevPixData[i] == currentPixData[i] && prevPixData[i + 1] == currentPixData[i + 1]
                && prevPixData[i + 2] == currentPixData[i + 2] && prevPixData[i + 3] == currentPixData[i + 3]) {
                pixData[i] = 0;
                pixData[i + 1] = 0;
                pixData[i + 2] = 0;
                pixData[i + 3] = 0;
            } else {
                pixData[i] = currentPixData[i];
                pixData[i + 1] = currentPixData[i + 1];
                pixData[i + 2] = currentPixData[i + 2];
                pixData[i + 3] = currentPixData[i + 3];
            }
        }
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = this.currentImageData.width;
        canvas.height = this.currentImageData.height;
        const context: CanvasRenderingContext2D = canvas.getContext("2d");
        context.putImageData(new ImageData(pixData, this.currentImageData.width, this.currentImageData.height), 0, 0);

        onFrameConvert(frame, canvas.toDataURL("png"));
        this.currentFrameIndex++;
        if (this.currentFrameIndex < this.frames.length) {
            this.prepareNextImageData(onFrameConvert);
        }
    }
}
