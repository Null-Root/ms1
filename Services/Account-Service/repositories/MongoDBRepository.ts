import { MongoClient } from "mongodb";
import { AccountInfo, AccountModel, LogState } from "../models";
import { IAccountRepository } from "./RepositoryInterfaces";
import { Collection } from "mongoose";

export default class MongoDBRepository implements IAccountRepository {
    connectionPool: MongoClient;

    constructor() {
        this.connectionPool = new MongoClient(process.env.MONGO_DB_URL!, { minPoolSize: 10 });
    }

    async connectToDataSource(): Promise<object> {
        return this.connectionPool.connect();
    }

    async handleOperation(db_operation: Function) {
        const client = await this.connectToDataSource() as MongoClient;

        try {
            await client.connect();
            const db = client.db(process.env.DB_NAME!);
            const collection = db.collection("user_accounts");
            
            // Run Operation, Pass Collection
            await db_operation(collection);
        } catch (error) {
            console.log(error);
        } finally {
            await client.close();
        }
    }

    async createAccount(account: AccountModel): Promise<boolean> {
        let flag = false;
        
        await this.handleOperation(async (collection: Collection) => {
            // Insert the account document into the collection
            const result = await collection.insertOne(account);

            // Check if the insertion was successful
            flag = result.acknowledged;
        });
        
        return flag;
    }

    async getAccountDetails(email: string): Promise<AccountModel | null> {
        let accountModel = null;
        
        await this.handleOperation(async (collection: Collection) => {
            // Retrieve the account based on the provided email
            const account_doc = await collection.findOne({ "account_info.email": email });

            if (account_doc == null) {
                return;
            }

            const accountInfo: AccountInfo = {
                first_name: account_doc?.account_info.first_name,
                last_name: account_doc?.account_info.last_name,
                date_of_birth: account_doc?.account_info.date_of_birth,
                email: account_doc?.account_info.email,
                hashed_password: account_doc?.account_info.hashed_password
            }

            const logState = new LogState()
                .setLogStatus(account_doc?.log_state?.is_logged_in!)
                .setLoginDate(account_doc?.log_state?.login_date!)
                .setUserToken(account_doc?.log_state?.user_token!)

            const _accountModel = new AccountModel()
                .setId(account_doc?._id.toString())
                .setAccountInfo(accountInfo)
                .setLogState(logState)

            accountModel = _accountModel;
        });
        
        return accountModel;
    }

    async updateAccount(email: string, account: AccountModel): Promise<boolean> {
        let flag = false;
        
        await this.handleOperation(async (collection: Collection) => {
            // Update the account document based on the provided email]
            const result = await collection.updateOne({ "account_info.email": email }, { $set: account });
            flag = result.acknowledged;
        });

        return flag;
    }

    async deleteAccount(email: string): Promise<boolean> {
        let flag = false;

        await this.handleOperation(async (collection: Collection) => {
            const result = await collection.deleteOne({ "account_info.email": email });
            flag = result.acknowledged;
        });

        return flag;
    }
}