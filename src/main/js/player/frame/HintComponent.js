const m = require('mithril');
var ImageService = require('../service/ImageService');
var HintService = require('../service/HintService');
var ScriptDataService = require('../service/ScriptDataService');

var HintComponent = {
    view: function() {
        if (ScriptDataService.frames) {
            var x1 = HintService.coordinates.x1 / ImageService.zoom;
            var y1 = HintService.coordinates.y1 / ImageService.zoom;
            var x2 = HintService.coordinates.x2 / ImageService.zoom;
            var y2 = HintService.coordinates.y2 / ImageService.zoom;
            function cancelEvent (e) {
                e.preventDefault();
                return false;
            }
            return [
                m('canvas#hintCanvas', {
                        width: ImageService.imageOriginalWidth,
                        height: ImageService.imageOriginalHeight,
                        style: {
                            width: ImageService.imageWidth + 'px',
                            height: ImageService.imageHeight + 'px'
                        }
                    }
                )
            ]
        }
        else {
            return false;
        }
    }
};

module.exports = HintComponent;