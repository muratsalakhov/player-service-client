import * as m from "mithril";
import { LoginService } from "./service/LoginService";

export class IndexPage implements m.ClassComponent {

    constructor(private readonly loginService: LoginService) {}

    oninit() {
        document.title = "Обучающая система";
    }

    view(): m.Children {
        const blockButtons = {
            children: [m("a.button", { href: "#!/player/" }, "Проигрыватель")]
        };
        if (this.loginService.isAdmin) {
            blockButtons.children.push(m("a.button", { href: "#!/admin/" }, "Панель администратора"));
        }
        if (this.loginService.isEditor) {
            blockButtons.children.push(m("a.button", { href: "#!/editor/" }, "Редактор"));
        }
        return m(".centered",
            m("h1", "Обучающая система"),
            m("br"),
            m("", blockButtons.children)
        );
    }
}
