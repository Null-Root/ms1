import { AccountModel } from "../models";

interface IRepository {
    connectToDataSource(): Promise<object>;
}

interface IAccountRepository extends IRepository {
    createAccount(account: AccountModel): Promise<boolean>;
    getAccountDetails(email: string): Promise<AccountModel | null>;
    updateAccount(email: string, account: AccountModel): Promise<boolean>;
    deleteAccount(email: string): Promise<boolean>;
}

export { IAccountRepository }