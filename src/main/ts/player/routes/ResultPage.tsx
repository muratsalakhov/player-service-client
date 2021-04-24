import React from 'react';
import '../../../css/player/app.css';
import {useHistory} from "react-router-dom";
import { IState } from "../interfaces";
import { connect, ConnectedProps } from "react-redux";
import {statistics} from "../globals";
import timeConversion from "../utils/timeConversion";
import {Button} from "@material-ui/core";

const mapState = (state:IState) => {
    return {
        scripts: state.scriptsReducer.scripts,
        selectedScriptId: state.scriptsReducer.selectedScriptId
        //chapters: state.scriptsReducer.chapters
    }
};

const mapDispatch = {

};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {

}

const ResultPage = (props:Props) => {
    const history = useHistory();
    return <div className="App" onContextMenu={e => e.preventDefault()}>
        <header className="App-header">
            <h1>Результаты прохождения обучающей программы:</h1>
            <br/><br/>
            <div style={{textAlign: 'left'}}>
                {Object.keys(statistics).map(scriptId => {
                    //console.log("STATS",statistics);
                    const time = statistics.script.timeFinish - statistics.script.timeStart;
                    return <div style={{marginBottom: '1em'}}>
                        <span style={{textDecoration: 'underline'}}>Сценарий "{props.scripts[props.selectedScriptId].name}":</span>
                        <div style={{paddingLeft: '1em'}}>
                            Время: <b>{timeConversion(time)}</b>
                        </div>
                        <div style={{paddingLeft: '1em'}}>
                            Ошибок: <b>{statistics.script.mistakes}</b>
                        </div>
                    </div>
                })}
            </div>
            <br/><br/>
            <Button onClick={() => history.push('/')} variant='contained'>
                Меню обучающих программ
            </Button>
        </header>
    </div>;
};

export default connector(ResultPage);
