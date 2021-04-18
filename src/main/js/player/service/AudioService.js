const m = require('mithril');

var AudioService = {
    soundOn: true,
    volume: 5,
    src: null,

    reload: function() {
        var audioPlayer = document.getElementById('audioPlayer'); // TODO
        if (audioPlayer) {
            audioPlayer.load();
        }
    }
};

module.exports = AudioService;