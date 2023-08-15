import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { ResponseModel } from '../models';
import { RepositoryProvider } from '../repositories';

export default async function checkIdentityHandler(req: Request, res: Response) {
    const repository = RepositoryProvider.getRepository()!;
    
    // Get all required account information
    let { token } = req.body;
    token = token as string;

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN!);
        const { email } = decoded as { email: string }

        // Check if account in database is set to logged in
        // Check if token match from what is stored in database
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

        const { is_logged_in, user_token } = account_details.log_state!;

        if (is_logged_in === false || user_token !== token) {
            return res.status(400).json(
                new ResponseModel(
                    'failed',
                    "Invalid token (based on database)"
                )
            );
        }
    }
    catch (err) {
        return res.status(400).json(
            new ResponseModel(
                'failed',
                "Invalid token"
            )
        );
    }

    return res.status(200).json(
        new ResponseModel(
            'success',
            "Identity Verified"
        )
    );
}