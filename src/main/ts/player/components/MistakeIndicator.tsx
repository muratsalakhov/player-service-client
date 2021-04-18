import React, { useEffect, useState } from 'react';
import {IState} from "../interfaces";
import {connect, ConnectedProps} from "react-redux";
import {timers} from "../globals";

interface ClassicProps {}

const mapState = (state:IState) => {
    return {
        mistakeCounter: state.scriptsReducer.mistakeCounter
    }
};

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const MistakeIndicator = ({
    mistakeCounter,
}: Props) => {
    const [mistakeIndicator, setMistakeIndicator] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (mistakeCounter === 0)
            return;
        setMistakeIndicator(true);
        clearTimeout(timers.mistake);
        timers.mistake = window.setTimeout(() => {
            if (!isMounted)
                return;
            setMistakeIndicator(false)
        }, 700);
        return () => {
            isMounted = false;
            setMistakeIndicator(false);
        };
    }, [mistakeCounter]);

    return <div className={'mistakeIndicator' + (mistakeIndicator ? ' error' : '')}/>;
};

export default connector(MistakeIndicator);