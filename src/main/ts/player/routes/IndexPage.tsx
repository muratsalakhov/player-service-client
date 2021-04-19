import React, {useEffect, useState, useRef, useCallback} from 'react';
import '../../../css/player/app.css';
import {
    //SELECT_CHAPTER,
    SELECT_FRAME,
    SELECT_SCRIPT,
    //SET_CHAPTERS,
    SET_FRAMES,
    SET_SCRIPTS
} from "../actions/scriptActions";
import {IScript, IScripts, IState} from "../interfaces";
import { connect, ConnectedProps } from "react-redux";
import {Button, CircularProgress} from "@material-ui/core";
import {getScripts} from "../services/requests";
import ScriptButton from "../components/ScriptButton";
import Alert from '@material-ui/lab/Alert';

type ClassicProps = {

};

const mapState = (state:IState) => {return {
    scripts: state.scriptsReducer.scripts
}};

const mapDispatch = {
    setScripts: SET_SCRIPTS,
    //setChapters: SET_CHAPTERS,
    setFrames: SET_FRAMES,
    selectScript: SELECT_SCRIPT,
    //selectChapter: SELECT_CHAPTER,
    selectFrame: SELECT_FRAME
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ClassicProps;

const IndexPage = ({ scripts, setScripts, setFrames, selectScript, selectFrame}:Props) => {
    const [loading, setLoading] = useState(true);
    const _isMounted = useRef(true);

    const scriptsLoader = useCallback(() => {
        selectScript(null);
        selectFrame(null);
        getScripts()
            .then((response: Array<IScript>) => {
                if (!_isMounted.current)
                    return;
                const scripts:IScripts = {};
                response.forEach(script => scripts[script.uid] = script);
                setScripts(scripts);
                setLoading(false)
            })
            .catch(() => alert('Не удалось загрузить список доступных сценариев'));
        return () => {_isMounted.current = false}
    }, [selectScript, setScripts, setFrames]);

    useEffect(scriptsLoader, []);

    return <div className="App"  onContextMenu={e => e.preventDefault()}>
        <header className="App-header">
            <img alt='РТУ МИРЭА ИТ' src='/img/logo_mirea_iit_blue.png' width='200' style={{margin: '1rem 0'}}/>
            {!loading
                ? scripts
                    ? Object.keys(scripts).length > 0
                        ? <>
                            <h1>Выберите обучающую программу</h1>
                            <div style={{textAlign: 'left'}}>
                                {Object.keys(scripts).map((id, i) => {
                                    return <ScriptButton
                                        scriptId={id}
                                        index={i}
                                        key={i}
                                    />
                                })}
                            </div>
                        </>
                        : <Alert severity="info">{'Нет доступных обучающих программ'}</Alert>
                    : <Alert severity="error">{'Не удалось загрузить перечень обучающих программ'}</Alert>
                : <CircularProgress/>
            }
            <Button
                onClick={() => window.location.href = '/#!/'}
                style={{background: '#fafafa'}}
                variant='contained'
            >
                {'< Назад'}
            </Button>
        </header>
    </div>;
};

export default connector(IndexPage);
