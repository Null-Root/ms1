import { Request, Response, NextFunction } from "express";
import { ResponseModel } from "../models";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { RepositoryProvider } from "../repositories";

export default async function auth_verify(req: Request, res: Response, next: NextFunction) {
	const token = req.body.token || req.query.token || req.params.token || req.headers["x-access-token"];

	// check for token passed
	if (!token) return res.status(400).json(
		new ResponseModel(
			'failed',
			"A token is required for authentication"
		)
	);

	// decode token and check if token is valid
	try {
		const decoded = jwt.verify(token, process.env.SECRET_TOKEN!);
		req.body.__token_decoded = decoded;

		// check if email is logged with correct token
		const { email } = decoded as { email: string }

		const repository = RepositoryProvider.getRepository()!;
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

		const { log_state } = account_details;
		const { is_logged_in, user_token } = log_state!;

		if (is_logged_in === false || user_token !== token) {
			return res.status(403).json(
				new ResponseModel(
					'failed',
					"Invalid token (based on database)"
				)
			);
		}

	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return res.status(403).json(
				new ResponseModel(
					'failed',
					"Token already expired"
				)
			);
		}

		if (error instanceof JsonWebTokenError) {
			return res.status(403).json(
				new ResponseModel(
					'failed',
					"Invalid Token"
				)
			);
		}

		// Other error types or validation failures
		return true;
	}

	return next();
}