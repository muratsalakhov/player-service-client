export default (
    imageBack:HTMLImageElement,
    imageFront:HTMLImageElement,
    onImageReady:(image:HTMLImageElement) => any
) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageFront.naturalWidth;
    canvas.height = imageFront.naturalHeight;
    const context = canvas.getContext('2d');
    
    if (!context) {
        console.error('no context');
        return imageFront;
    }

    context.drawImage(imageBack, 0, 0);
    const backPixels:Uint8ClampedArray = context.getImageData(0, 0, canvas.width, canvas.height).data;

    context.drawImage(imageFront, 0, 0);
    const frontPixels:Uint8ClampedArray = context.getImageData(0, 0, canvas.width, canvas.height).data;

    for(let x = 0; x < backPixels.length; x += 4) {
        if (frontPixels[x + 3] > 0) { // Если пиксель не прозрачный
            const pixelChanged = backPixels[x] !== frontPixels[x]
                || backPixels[x + 1] !== frontPixels[x + 1]
                || backPixels[x + 2] !== frontPixels[x + 2];
            if (pixelChanged) {
                backPixels[x] = frontPixels[x];
                backPixels[x + 1] = frontPixels[x + 1];
                backPixels[x + 2] = frontPixels[x + 2];
                backPixels[x + 3] = frontPixels[x + 3];
            }
        }
    }

    const image = new Image();
    image.onload = () => onImageReady(image);
    image.src = canvas.toDataURL("image/png");

    canvas.remove();
};