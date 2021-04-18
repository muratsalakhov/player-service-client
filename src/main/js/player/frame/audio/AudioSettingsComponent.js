const m = require('mithril');
var AudioService = require('../../service/AudioService');

var AudioSettingsComponent = {
    view: function() {
        const btnSoundEnable = {
            attrs: {
                class: AudioService.soundOn ? 'selected' : null,
                onclick: function () {
                    AudioService.soundOn = !AudioService.soundOn;
                }
            },
            children: AudioService.soundOn ? 'Включено' : 'Выключено'
        };

        const volumeControl = {
            children: [
                m('p', 'Громкость:'),
                m('input[type=range][min=0][max=10]', {
                    oninput: function () {
                        AudioService.volume = this.value;
                    }
                })
            ]
        };

        return [
            m('a.button', btnSoundEnable.attrs, btnSoundEnable.children),
            AudioService.soundOn ? [m('br'), volumeControl.children, m('br')] : null
        ]
    }
};

module.exports = AudioSettingsComponent;