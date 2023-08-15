# Server
The server for account-service

## Paths

**Register Account** \
Path: /account-service/v1/register \
Http Method: POST, x-www-form-urlencoded \
Required Parameters:
- first_name (must be a string)
- last_name (must be a string)
- date_of_birth (must be a valid date string with format yyyy-mm-dd e.g. 2021-12-31)
- email (must be a string)
- password (must be a string)
***


**Login Account** \
Path: /account-service/v1/login \
Http Method: POST, x-www-form-urlencoded \
Required Parameters:
- email (must be a string)
- password (must be a string)
***


**Logout Account** \
Path: /account-service/v1/logout \
Http Method: POST, x-www-form-urlencoded \
Required Parameters:
- email (must be a string)
- token (even if the token is already expired)
***


**Update Account** \
Path: /account-service/v1/account \
Http Method: PUT, x-www-form-urlencoded \
Required Parameters:
- token (must be a valid token)
- date_of_birth (must be a valid date string with format yyyy-mm-dd e.g. 2021-12-31)
- first_name (must be a string)
- last_name (must be a string)
- password (must be a string)
***


**Delete Account** \
Path: /account-service/v1/account \
Http Method: DELETE, x-www-form-urlencoded \
Required Parameters:
- token (must be a valid token)
***


**Check Email** \
Path: /account-service/v1/check-email \
Http Method: POST, x-www-form-urlencoded \
Required Parameters:
- email (must be a string)
***

**Check Identity** \
Path: /account-service/v1/check-auth \
Http Method: POST, x-www-form-urlencoded \
Required Parameters:
- token (must be a valid token)

## Warning

1. Authentication Implementation makes use of both mongodb and jwt token, logging in stores a token with the state to identify if user is logged in. This is to allow for logging out earlier than the token expiration (To avoid token reuse). Having no token in the client side will prompt a login to the user even if account if logged in according to server (MongoDB).

2. No Protections against CSRF Attacks
