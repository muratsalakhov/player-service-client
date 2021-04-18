import { LoginService } from "./service/LoginService";
import * as m from "mithril";

export class TutorResolver implements m.RouteResolver {

    constructor(protected readonly loginService: LoginService, protected readonly page: m.ClassComponent,
                private readonly layout?: m.ClassComponent, private readonly location?: string) {}

    onmatch(args: any, path: string): void | m.ClassComponent {
        if (this.loginService.isUserLoggedIn) return this.page;
        m.route.set("/login/");
    }

    render(vnode: m.CVnode<any>): m.Children {
        vnode.attrs.location = this.location;
        return this.layout ? m(this.layout, vnode.attrs, vnode) : vnode;
    }
}

export class AdminResolver extends TutorResolver {

    onmatch(args: any, path: string): void | m.ClassComponent {
        if (this.loginService.isAdmin) return this.page;
        m.route.set("/");
    }
}

export class EditorResolver extends TutorResolver {

    onmatch(args: any, path: string): void | m.ClassComponent {
        if (this.loginService.isEditor) return this.page;
        m.route.set("/");
    }
}
