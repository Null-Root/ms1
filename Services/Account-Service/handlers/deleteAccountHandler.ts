import { Request, Response } from 'express';
import { ResponseModel } from '../models';
import { RepositoryProvider } from '../repositories';

export default async function deleteAccountHandler(req: Request, res: Response) {
    const repository = RepositoryProvider.getRepository()!;

    // Get all required account information
    const { __token_decoded } = req.body;
    const { email } = __token_decoded as { email: string }
    
    // Check If Account Exists
    let account_details = await repository.getAccountDetails(email);
    if (account_details == null) {
        return res.status(404).json(
            new ResponseModel(
                'failed',
                'Account Not Found'
            )
        )
    }
    
    // Delete Account
    const result = await repository.deleteAccount(email);

    if (result) {
        return res.status(200).json(
            new ResponseModel(
                'success',
                'Account Deleted Successfully'
            )
        )
    }
    
    return res.status(400).json(
        new ResponseModel(
            'failed',
            'Account Deletion Failed'
        )
    )
}