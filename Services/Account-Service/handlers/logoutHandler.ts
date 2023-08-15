import { Request, Response } from 'express';
import { LogState, ResponseModel } from '../models';
import { RepositoryProvider } from '../repositories';

export default async function logoutHandler(req: Request, res: Response) {
    const repository = RepositoryProvider.getRepository()!;

    // Get all required account information
    const { email, token } = req.body;

    // Check if same token
    const account_details = await repository.getAccountDetails(email);

    // Check If Account Exists
    if (account_details == null) {
        return res.status(404).json(
            new ResponseModel(
                'failed',
                'Account Not Found'
            )
        )
    }

    const { user_token } = account_details.log_state!;

    if (token != user_token) {
        return res.status(400).json(
            new ResponseModel(
                'failed',
                'Token Mismatch'
            )
        );
    }

    // Logout the said email
    account_details.setLogState(
        new LogState()
            .setLogStatus(false)
            .setUserToken('')
    );
    const result = await repository.updateAccount(email, account_details);

    if (result) {
        return res.status(201).json(
            new ResponseModel(
                'success',
                'Log Out Successful'
            )
        );
    }
    
    return res.status(400).json(
        new ResponseModel(
            'failed',
            'Log Out Failed'
        )
    )
}