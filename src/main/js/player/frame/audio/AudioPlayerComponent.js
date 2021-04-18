const m = require('mithril');
var AudioService = require('../../service/AudioService');

var AudioPlayerComponent = {
    view: function() {
        if (!AudioService.soundOn) return null;
        return m('audio#audioPlayer', {
            src: 'data/' + AudioService.src,
            preload: 'auto',
            volume: AudioService.volume / 10,
            autoplay: AudioService.soundOn ? 'autoplay' : null
        });
    }
};

module.exports = AudioPlayerComponent;