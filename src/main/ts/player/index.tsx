import React, {useEffect} from 'react';
import IndexPage from './routes/IndexPage';
import PlayerPage from './routes/PlayerPage';
import ResultPage from './routes/ResultPage';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import {createStore} from 'redux';
import allReducers from './reducers';
import { Provider } from 'react-redux';
import ChangeChapterPage from "./routes/ChangeChapterPage";
import SettingsPage from "./routes/SettingsPage";
import "../../resources/static/fonts/roboto/stylesheet.css";//todo: check
import "../../css/player/index.css";
import "../../css/player/app.css";
import "../../css/player/mui_changes.css";
import "../../css/player/range.css";

const store = createStore(allReducers);

export const Index = () => {

    useEffect(() => {
        document.title = 'Проигрыватель'
    }, []);

    return <Provider store={store}>
        <Router>
            <Route exact path="/"               component={IndexPage}   />
            <Route exact path="/settings"       component={SettingsPage}   />
            <Route exact path="/change_chapter" component={ChangeChapterPage}   />
            <Route exact path="/player"         component={PlayerPage}  />
            <Route exact path="/result"         component={ResultPage}  />
        </Router>
    </Provider>;
}