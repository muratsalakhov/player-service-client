import React, {useEffect, useRef} from 'react';
import {IState} from "../interfaces";
import {connect, ConnectedProps} from "react-redux";

interface ClassicProps {}

const mapState = (state:IState) => {
    const voiceTaskLink = state.scriptsReducer.selectedFrameId
        ? state.scriptsReducer.frames[state.scriptsReducer.selectedFrameId].taskVoice?.link
        : undefined;
    return {
        selectedFrameId: state.scriptsReducer.selectedFrameId,
        voiceTaskEnable: state.settingsReducer.voiceTaskEnable,
        voiceVolume: state.settingsReducer.voiceVolume,
        voiceTaskLink
    }
};

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const Audio = (props: Props) => {
    const ref = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (ref.current)
            ref.current.load();
    }, [ref, props.selectedFrameId]);

    useEffect(() => {
        if (ref.current)
            ref.current.volume = props.voiceVolume;
    }, [props.voiceVolume]);

    return <audio
        ref={ref}
        src={props.voiceTaskLink}
        preload={props.voiceTaskEnable ? 'auto' : 'none'}
        autoPlay={props.voiceTaskEnable}
    />
};

export default connector(Audio);