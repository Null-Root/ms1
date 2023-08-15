import { Request, Response } from 'express';
import { ResponseModel } from '../models';
import { RepositoryProvider } from '../repositories';

export default async function checkEmailHandler(req: Request, res: Response) {
    const repository = RepositoryProvider.getRepository()!;

    // Get all required account information
    const { email } = req.body;

    // Check if account exists
    const result = await repository.getAccountDetails(email as string);
    if(result == null) {
        return res.status(404).json(
            new ResponseModel(
                'failed',
                'Account Not Found'
            )
        );
    }

    return res.status(200).json(
        new ResponseModel(
            'failed',
            'Email Is Registered'
        )
    );
}