import { Request, Response } from 'express';
import { compareHash } from '../utility';
import { LogState, ResponseModel } from '../models';
import jwt from 'jsonwebtoken';
import { RepositoryProvider } from '../repositories';

export default async function loginHandler(req: Request, res: Response) {
    const repository = RepositoryProvider.getRepository()!;

    // Get all required account information
    const { email, password } = req.body;
    
    // Check if password matches
    let account_details = await repository.getAccountDetails(email);

    // Check If Account Exists
    if (account_details == null) {
        return res.status(404).json(
            new ResponseModel(
                'failed',
                'Account Not Found'
            )
        )
    }

    const { account_info } = account_details;

    if(!await compareHash(password, account_info?.hashed_password!)) {
        return res.status(400).json(
            new ResponseModel(
                'failed',
                'Wrong Password On Email'
            )
        )
    }

    // Create a token containing, email, share_id
    const payload = {
        email: email,
        share_id: account_details.share_id
    }
    const user_token = jwt.sign(payload, process.env.SECRET_TOKEN as string, { expiresIn: '24h' });

    // Update Log State then push to database
    account_details.setLogState(
        new LogState()
            .setLogStatus(true)
            .setLoginDate(new Date())
            .setUserToken(user_token)
    )
    const result = await repository.updateAccount(email, account_details);

    if (result) {
        return res.status(200).json(
            new ResponseModel(
                'success',
                'Log In Successful'
            ).setPayload(user_token)
        )
    }
    
    return res.status(400).json(
        new ResponseModel(
            'failed',
            'Log In Failed'
        )
    )
}