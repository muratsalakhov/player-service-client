import summarizeImages from "./summarizeImages";

export default (pictureLink:string, previousImage:HTMLImageElement | undefined) => {
    const canvas = document.createElement("canvas");
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = pictureLink;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            if (!context) {
                image.remove();
                reject();
                return;
            }
            if (!previousImage) {
                context.drawImage(image, 0, 0);
                const resultImage = new Image();
                resultImage.crossOrigin = "anonymous";
                resultImage.onload = () => resolve(resultImage);
                resultImage.src = canvas.toDataURL("image/png");
                return;
            }
            summarizeImages(
                previousImage,
                image,
                (resultImage:HTMLImageElement) => resolve(resultImage)
            );

        };
    });
};