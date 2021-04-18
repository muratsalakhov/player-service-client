import { AccountInfo } from "../util";

export class LoginService {

    private accountInfo: AccountInfo;// = { isActive: true, isAdmin: true, isEditor: true };

    get isUserLoggedIn(): boolean {
        return this.accountInfo && this.accountInfo.isActive;
    }

    get isAdmin(): boolean {
        return this.isUserLoggedIn && this.accountInfo.isAdmin;
    }

    get isEditor(): boolean {
        return this.isUserLoggedIn && this.accountInfo.isEditor;
    }

    login(accountInfo: AccountInfo) {
        this.accountInfo = accountInfo;
    }
}
