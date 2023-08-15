import MongoDBRepository from "./MongoDBRepository";
import { IAccountRepository } from "./RepositoryInterfaces";

export default class RepositoryProvider {
    static getRepository(): IAccountRepository | null {
        // Get Chosen DB
        const chosen_db = process.env.DB_USED!;

        switch(chosen_db) {
            case "mongodb":
                return new MongoDBRepository();
        }

        return null;
    }
}