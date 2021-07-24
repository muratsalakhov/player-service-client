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
                console.log("no context getImage");
                return;
            }
            console.log("sum prev image");
            console.log(previousImage);
            if (!previousImage) {
                context.drawImage(image, 0, 0);
                const resultImage = new Image();
                resultImage.crossOrigin = "anonymous";
                resultImage.onload = () => resolve(resultImage);
                resultImage.src = canvas.toDataURL("image/png");
                console.log("no prev image");
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
