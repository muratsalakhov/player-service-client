const m = require('mithril');

var ImageService = {
    imageOriginalWidth: 1200,
    imageOriginalHeight: 760,
    imageWidth: 200,
    imageHeight: 200,
    currentImageData: null,
    zoom: null,

    imageResize: function () {
        const imageBlock = document.getElementById('imageBlock');
        const imageBlockWidth = imageBlock.offsetWidth - 20;
        const imageBlockHeight = imageBlock.offsetHeight - 20;
        const aspectRatioImage = ImageService.imageOriginalWidth / ImageService.imageOriginalHeight;
        const aspectRatioImageBlock = imageBlockWidth / imageBlockHeight;

        if (aspectRatioImage >= aspectRatioImageBlock) {
            ImageService.zoom = imageBlockWidth / ImageService.imageOriginalWidth;
            ImageService.imageWidth = imageBlockWidth;
            ImageService.imageHeight = ImageService.imageOriginalHeight * ImageService.zoom;
        }
        else {
            ImageService.zoom = imageBlockHeight / ImageService.imageOriginalHeight;
            ImageService.imageHeight = imageBlockHeight;
            ImageService.imageWidth = ImageService.imageOriginalWidth * ImageService.zoom;

        }
        m.redraw();
    },

    imageRedraw: function () {
        const currentImageData = ImageService.currentImageData;
        const canvas = document.getElementById('imageCanvas');
        const canvasContext = canvas.getContext('2d');

        if (!currentImageData) {
            const transparentImageData = canvasContext.createImageData(ImageService.imageOriginalWidth,
                ImageService.imageOriginalHeight);
            canvasContext.putImageData(transparentImageData, 0, 0);
        }
        else {
            canvasContext.putImageData(currentImageData, 0, 0);
        }
    },

    // Принудительное обновление образа
    imageForcedUpdate: function () {
        const imageBlock = document.getElementById('imageBlock');
        const imageBorder = document.getElementById('imageBorder');
        imageBlock.removeChild(imageBorder);
        m.redraw();
        ImageService.imageResize();
        imageBlock.appendChild(imageBorder);
    }

};

module.exports = ImageService;