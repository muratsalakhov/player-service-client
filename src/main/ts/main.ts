import { ChapterService } from "./editor/service/ChapterService";
import { ChapterEditor } from "./editor/service/ChapterEditor";
import { ChaptersLayout } from "./editor/ChaptersLayout";
import { AdvancedSettingsPage } from "./editor/AdvancedSettingsPage";
import { ChapterInfoPage } from "./editor/ChapterInfoPage";
import { FramePage } from "./editor/frame/FramePage";
import { BusPage } from "./BusPage";
import { IndexPage } from "./IndexPage";
import { NewChapterPage } from "./editor/NewChapterPage";
import { ScriptsPage } from "./editor/ScriptsPage";
import { ScriptService } from "./editor/service/ScriptService";
import { LoginService } from "./service/LoginService";
import { LoginPage } from "./LoginPage";
import { AdminResolver, EditorResolver, TutorResolver } from "./resolver";
import { ActionService } from "./editor/service/ActionService";
import { Dictionary } from "./editor/service/Dictionary";
import "bootstrap-4-grid/css/grid.min.css";
import "../css/global.css";
import * as PlayerScriptSelectionPage from "../js/player/ScriptSelectionPage";
import * as PlayerPage from "../js/player/PlayerPage";
import * as PlayerResultPage from "../js/player/ResultPage";
import * as PlayerChangeChapterPage from "../js/player/ChangeChapterPage";
import * as AdminPage from "../js/admin/IndexPage";
import * as m from "mithril";
import { BranchingComponent } from "./editor/script/BranchingComponent";
import { ScriptCreationService } from "./editor/service/ScriptCreationService";
import { NewScriptPage } from "./editor/script/NewScriptPage";
import React from 'react';
import ReactDOM from 'react-dom';
import {Index} from "./player";

export function mithrilify(Comp, wrapper) {
    function update({attrs, dom}) {
        // Drop the key to not confuse React
        const {key, ...rest} = attrs
        ReactDOM.render(
            React.createElement(Comp, rest),
            dom
        )
    }
    return {
        view: () => wrapper(),
        oncreate: update,
        onupdate: update
    }
}

const loginService = new LoginService();
const chapterService = new ChapterService();
const dictionary = new Dictionary();
const chapterEditor = new ChapterEditor(dictionary, chapterService);
const actionService = new ActionService(chapterEditor);

const chaptersLayout = new ChaptersLayout(chapterService, chapterEditor);
const advancedSettingsPage = new AdvancedSettingsPage(chapterEditor);
const scriptsPage = new ScriptsPage(new ScriptService());
m.route(document.body, "/", {
    "/": new TutorResolver(loginService, new IndexPage(loginService)),
    "/admin/": new AdminResolver(loginService, AdminPage),
    "/bus/": new AdminResolver(loginService, new BusPage()),
    "/login/": new LoginPage(loginService),

    "/editor/": new EditorResolver(loginService, new ChapterInfoPage(chapterEditor), chaptersLayout, "chapterInfo"),
    "/editor/advanced/": new EditorResolver(loginService, advancedSettingsPage, chaptersLayout, "chapterAdvanced"),
    "/editor/script/": new EditorResolver(loginService, scriptsPage, chaptersLayout, "script"),
    "/editor/script/new": new EditorResolver(loginService, new NewScriptPage(chapterService, new ScriptCreationService())),
    "/editor/chapter/new/": new EditorResolver(loginService, new NewChapterPage(chapterService)),
    "/editor/chapter/:id/": new EditorResolver(loginService, new FramePage(chapterEditor, dictionary, actionService)),

    "/player/": new TutorResolver(loginService, mithrilify(Index, () => m('.body'))),
    // "/player/chapter/:id/": new TutorResolver(loginService, PlayerPage),
    // "/player/result/": new TutorResolver(loginService, PlayerResultPage),
    // "/player/changeChapter/": new TutorResolver(loginService, PlayerChangeChapterPage)

    // "/player/": new TutorResolver(loginService, PlayerScriptSelectionPage),
    // "/player/chapter/:id/": new TutorResolver(loginService, PlayerPage),
    // "/player/result/": new TutorResolver(loginService, PlayerResultPage),
    // "/player/changeChapter/": new TutorResolver(loginService, PlayerChangeChapterPage)
});
