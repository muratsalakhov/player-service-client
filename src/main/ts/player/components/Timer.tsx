import React, {useCallback, useEffect, useState} from 'react';
import {IState} from "../interfaces";
import {connect, ConnectedProps} from "react-redux";
import {statistics} from "../globals";
import timeConversion from "../utils/timeConversion";

interface ClassicProps {}

const mapState = (state:IState) => {return {
    selectedScriptId: state.scriptsReducer.selectedScriptId
    //selectedChapterId: state.scriptsReducer.selectedChapterId
}};

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const Timer = ({selectedScriptId}: Props) => {
    const [time, setTime] = useState<number|null>(null);

    const start = useCallback(() => {
        const interval = setInterval(() => {
            if (!selectedScriptId)
                return;
            const newTime = new Date().getTime() - statistics.script.timeStart;
            setTime(newTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [selectedScriptId]);

    useEffect(start, []);

    if (time === null || !selectedScriptId)
        return null;

    return <b>
        {timeConversion(time)}
    </b>;
};

export default connector(Timer);
