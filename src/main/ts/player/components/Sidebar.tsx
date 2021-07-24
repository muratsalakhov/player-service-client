import React, {useCallback, useEffect, useState} from 'react';
import {IFrame, IState} from "../interfaces";
import {connect, ConnectedProps} from "react-redux";
import {Button} from "@material-ui/core";
import Timer from "./Timer";

interface ClassicProps {}

const mapState = (state:IState) => {
    const r = state.scriptsReducer;
    const selectedFrame:IFrame | null = r.selectedFrameId ? r.frames[r.selectedFrameId] : null;
    return {
        selectedFrameId: selectedFrame?.uid,
        hintText: selectedFrame?.hintText,
        mistakeCounter: state.scriptsReducer.mistakeCounter,
        sidebarAutoHiding: state.settingsReducer.sidebarAutoHiding,
        examMode: state.settingsReducer.examMode
    }
};

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const Sidebar = ({
    selectedFrameId,
    hintText,
    mistakeCounter,
    sidebarAutoHiding,
    examMode
}: Props) => {
    const [showTextHint, setShowTextHint] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(null);

    useEffect(() => {
        setShowTextHint(false);
        setSidebarOpen(null);
    }, [selectedFrameId]);

    const sidebarOpener = useCallback(() => {
        if (sidebarOpen)
            return;
        if (mistakeCounter < 3 || examMode)
            return;
        if (sidebarOpen !== null)
            return;
        setSidebarOpen(true);
    }, [mistakeCounter, sidebarOpen, examMode]);

    useEffect(sidebarOpener, [mistakeCounter]);

    return <div
        className={'sidebarContainer' + (!sidebarAutoHiding || sidebarOpen ? ' hover' : '')}
        onMouseMove={() => {if (sidebarOpen) setSidebarOpen(false)}}
    >
        <div className='sidebar'>
            {examMode
                ? <Timer/>
                : (mistakeCounter > 2 || showTextHint)
                    ? hintText
                    : <Button onClick={() => setShowTextHint(true)} variant='contained'
                              style={{background: '#fafafa'}}>
                        Показать  подсказку
                    </Button>
            }
        </div>
    </div>;
};

export default connector(Sidebar);
