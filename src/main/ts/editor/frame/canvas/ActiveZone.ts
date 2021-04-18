import { Rectangle } from "../../../util";
import { FrameCanvas } from "./FrameCanvas";
import { fabric } from "fabric";

export class ActiveZone extends fabric.Rect {

    canvas: FrameCanvas;

    constructor(bounds: Rectangle, color: string) {
        super({
            borderColor: "black",
            cornerColor: "black",
            fill: color,
            opacity: 0.6,
            width: bounds.width,
            height: bounds.height,
            left: bounds.x,
            top: bounds.y
        });
        this.setControlsVisibility({ mtr: false });

        this.on("scaled", () => {
            while (this.scaleX > 2) {
                this.scaleX /= 2;
                this.width *= 2;
            }
            while (this.scaleY > 2) {
                this.scaleY /= 2;
                this.height *= 2;
            }
        });
        this.on("moving", () => {
            if (this.left < 0) {
                this.left = 0;
            }
            if (this.left > this.rightBorder) {
                this.left = this.rightBorder;
            }
            if (this.top < 0) {
                this.top = 0;
            }
            if (this.top > this.bottomBorder) {
                this.top = this.bottomBorder;
            }
        });
    }

    get scaledWidth(): number {
        return this["getScaledWidth"]();
    }

    get scaledHeight(): number {
        return this["getScaledHeight"]();
    }

    getBounds(): Rectangle {
        const xLeft: number = this.left / this.canvas.scaleFactor;
        const yLeft: number = this.top / this.canvas.scaleFactor;
        return new Rectangle(xLeft + this.scaledWidth / this.canvas.scaleFactor,
            yLeft + this.scaledHeight / this.canvas.scaleFactor, xLeft, yLeft);
    }

    private get rightBorder(): number {
        return this.canvas.getWidth() - this.scaledWidth;
    }

    private get bottomBorder(): number {
        return this.canvas.getHeight() - this.scaledHeight;
    }
}
