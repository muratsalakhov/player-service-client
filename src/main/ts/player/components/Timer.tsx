import React, {useCallback, useEffect, useState} from 'react';
import {IState} from "../interfaces";
import {connect, ConnectedProps} from "react-redux";
import {statistics} from "../globals";
import timeConversion from "../utils/timeConversion";

interface ClassicProps {}

const mapState = (state:IState) => {return {
    selectedChapterId: state.scriptsReducer.selectedChapterId
}};

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const Timer = ({selectedChapterId}: Props) => {
    const [time, setTime] = useState<number|null>(null);

    const start = useCallback(() => {
        const interval = setInterval(() => {
            if (!selectedChapterId || !statistics.chapters[selectedChapterId])
                return;
            const newTime = new Date().getTime() - statistics.chapters[selectedChapterId].timeStart;
            setTime(newTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [selectedChapterId]);

    useEffect(start, []);

    if (time === null || !selectedChapterId || !statistics.chapters[selectedChapterId])
        return null;

    return <b>
        {timeConversion(time)}
    </b>;
};

export default connector(Timer);