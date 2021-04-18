var ScriptDataService = require('./ScriptDataService');

var FrameConverter = {
    convertedImageData: [],

    bufferSize: 8,

    buffering: function (frames, frameIndex) {
        if (frameIndex < ScriptDataService.currentFrameIndex + FrameConverter.bufferSize &&
            frameIndex < FrameConverter.convertedImageData.length) {
            FrameConverter.getImageData(frames, frameIndex, -1, function (imageData) {
                FrameConverter.convertedImageData[frameIndex].extendedImageData.forEach(function (a, extIndex) {
                    FrameConverter.getImageData(frames, frameIndex, extIndex, function (imageData0) {});
                });
                FrameConverter.buffering(frames, frameIndex + 1);
            });
        }
    },

    clearConvertedImageData: function (frameIndex) {
        if (frameIndex === undefined) {
            FrameConverter.convertedImageData = null;
            delete FrameConverter.convertedImageData;
        }
        else {
            const frameIndexToDelete = frameIndex - 3;
            if (frameIndexToDelete >= 0) {
                FrameConverter.convertedImageData[frameIndexToDelete] = null;
                delete FrameConverter.convertedImageData[frameIndexToDelete];
            }
        }
        console.log('Converted ImageData cleared');
    },

    getImageData: function (frames, frameIndex, dragIndex, onImageDataReady) {
        if (dragIndex < 0) {
            if (FrameConverter.convertedImageData[frameIndex].ready) {
                onImageDataReady(FrameConverter.convertedImageData[frameIndex].imageData);
            }
            else {
                FrameConverter.prepareImageData(frames, frameIndex, onImageDataReady);
            }
        }
        else {
            if (FrameConverter.convertedImageData[frameIndex].extendedImageData[dragIndex].ready) {
                onImageDataReady(FrameConverter.convertedImageData[frameIndex].extendedImageData[dragIndex].imageData);
            }
            else {
                FrameConverter.prepareExtendedImageData(frames, frameIndex, dragIndex, onImageDataReady);
            }
        }
    },

    imageDataReady: function (frameIndex, dragIndex, imageData) {
        if (dragIndex < 0) {
            FrameConverter.convertedImageData[frameIndex].imageData = imageData;
            FrameConverter.convertedImageData[frameIndex].ready = true;
            console.log('imageData ' + frameIndex + ' ready');
            if (FrameConverter.convertedImageData[0].onImageDataReady)
                FrameConverter.convertedImageData[0].onImageDataReady();
        }
        else {
            FrameConverter.convertedImageData[frameIndex].extendedImageData[dragIndex].imageData = imageData;
            FrameConverter.convertedImageData[frameIndex].extendedImageData[dragIndex].ready = true;
            console.log('imageData ' + frameIndex + ' ' + dragIndex + ' ready');
            if (FrameConverter.convertedImageData[frameIndex].extendedImageData[dragIndex].onImageDataReady)
                FrameConverter.convertedImageData[frameIndex].extendedImageData[dragIndex].onImageDataReady();
        }
    },

    prepareImageData: function (frames, frameIndex, onImageDataReady) {
        if (frameIndex === 0) {
            FrameConverter.loadImageData(frames[0].pictureLink, function (imageData) {
                FrameConverter.imageDataReady(0, -1, imageData);
                //TODO: конвертировать изображения расширенного кадра
                onImageDataReady(imageData);
            });
        }
        else {
            const previousImageData = FrameConverter.convertedImageData[frameIndex - 1];
            if (previousImageData.ready) {
                var previousImageDataCopy = FrameConverter.copyImageData(previousImageData.imageData.data);
                FrameConverter.summarizeImages(previousImageDataCopy,
                    frames[frameIndex].pictureLink,
                    function (imageData) {
                        FrameConverter.imageDataReady(frameIndex, -1, imageData);
                        onImageDataReady(imageData);
                    });
            }
            else {
                FrameConverter.getImageData(frames, frameIndex - 1, -1, function () {
                    FrameConverter.getImageData(frames, frameIndex, -1, function (imageData) {
                        FrameConverter.imageDataReady(frameIndex, -1, imageData);
                        onImageDataReady(imageData);
                    });
                });
            }
        }
    },

    prepareExtendedImageData: function (frames, frameIndex, dragIndex, onImageDataReady) {
        const backImageData = FrameConverter.convertedImageData[frameIndex];
        if (backImageData.ready) {
            const frontImageLink = frames[frameIndex].switchData.switchPictures[dragIndex].pictureLink;
            var backImageDataCopy = FrameConverter.copyImageData(backImageData.imageData.data);

            FrameConverter.summarizeImages(backImageDataCopy,
                frontImageLink,
                function (imageData) {
                    FrameConverter.imageDataReady(frameIndex, dragIndex, imageData);
                    onImageDataReady(imageData);
                });
        }
        else {
            FrameConverter.getImageData(frames, frameIndex, -1, function () {
                FrameConverter.getImageData(frames, frameIndex, dragIndex, function (imageData) {
                    FrameConverter.imageDataReady(frameIndex, dragIndex, imageData);
                    onImageDataReady(imageData);
                });
            });
        }
    },

    loadImageData: function (pictureLink, onImageDataLoaded) {
        const image = new Image();
        image.src = pictureLink;
        image.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
            image.remove();
            onImageDataLoaded(context.getImageData(0, 0, canvas.width, canvas.height));
        };
    },

    summarizeImages: function (imageBackData, imageFrontLink, onImagesSummarized) {
        const image = {
            backPixels: null,
            frontElement: null,
            frontData: null,
            frontPixels: null
        };
        const canvas = {
            element: null,
            context: null
        };

        image.frontElement = document.createElement('img');
        image.frontElement.onload = function () {
            canvas.element = document.createElement('canvas');
            canvas.element.width = image.frontElement.naturalWidth;
            canvas.element.height = image.frontElement.naturalHeight;
            canvas.context = canvas.element.getContext('2d');

            canvas.context.drawImage(image.frontElement, 0, 0);
            image.frontData = canvas.context.getImageData(0, 0, canvas.element.width, canvas.element.height);

            image.backPixels = imageBackData.data;
            image.frontPixels = image.frontData.data;

            for(var x = 0; x < image.backPixels.length; x += 4) {
                if (image.frontPixels[x + 3] > 0) { // Если пиксель не прозрачный
                    const pixelChanged = image.backPixels[x] !== image.frontPixels[x]
                        || image.backPixels[x + 1] !== image.frontPixels[x + 1]
                        || image.backPixels[x + 2] !== image.frontPixels[x + 2];
                    if (pixelChanged) {
                        image.backPixels[x] = image.frontPixels[x];
                        image.backPixels[x + 1] = image.frontPixels[x + 1];
                        image.backPixels[x + 2] = image.frontPixels[x + 2];
                        image.backPixels[x + 3] = image.frontPixels[x + 3];
                    }
                }
            }

            image.frontElement.remove();
            canvas.element.remove();
            delete image.backPixels;
            delete image.frontData;
            delete image.frontPixels;
            delete canvas.context;
            onImagesSummarized(imageBackData);
        };
        image.frontElement.src = imageFrontLink;
        return true;
    },

    reset: function (frames) {
        delete FrameConverter.convertedImageData;
        FrameConverter.convertedImageData = [];
        frames.forEach(function (frame) {
            FrameConverter.convertedImageData.push({
                ready: false,           // Сконвертировано
                imageData: null,
                onImageDataReady: null, // Выполнить после конвертации
                extendedImageData: []   // Изображения расширенных кадров

            });
            if (frame.switchData.switchPictures) {
                frame.switchData.switchPictures.forEach(function () {
                    const currentIndex = FrameConverter.convertedImageData.length - 1;
                    FrameConverter.convertedImageData[currentIndex].extendedImageData.push({
                        ready: false,           // Сконвертировано
                        imageData: null,
                        onImageDataReady: null  // Выполнить после конвертации
                    });
                });
            }
        });
    },

    copyImageData: function (imageData) {
        const canvas = document.getElementById('imageCanvas');
        const canvasContext = canvas.getContext("2d");
        const imageDataCopy = canvasContext.createImageData(canvas.width, canvas.height);
        imageDataCopy.data.set(imageData);
        return imageDataCopy;
    }
};

module.exports = FrameConverter;