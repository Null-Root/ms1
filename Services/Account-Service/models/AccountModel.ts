interface AccountInfo {
    first_name?: string;
    last_name?: string;
    date_of_birth?: Date;
    email?: string;
    hashed_password?: string;
}

class AccountModel {
    id?: string
    share_id?: string

    // Required Info at Registration
    account_info?: AccountInfo

    // Account Logging
    log_state?: LogState

    constructor() {}

    setId(value: string) {
        this.id = value;
        return this;
    }
    
    setShareId(value: string) {
        this.share_id = value;
        return this;
    }

    setAccountInfo(value: AccountInfo) {
        this.account_info = value;
        return this;
    }

    setLogState(value: LogState) {
        this.log_state = value;
        return this;
    }
}

class LogState {
    is_logged_in?: boolean = false;
    login_date?: Date = new Date()
    user_token?: string = '';

    constructor() {}

    setLogStatus(value: boolean) {
        this.is_logged_in = value;
        return this;
    }

    setLoginDate(value: Date) {
        this.login_date = value;
        return this;
    }

    setUserToken(value: string) {
        this.user_token = value;
        return this;
    }
}

export { AccountModel, AccountInfo, LogState };