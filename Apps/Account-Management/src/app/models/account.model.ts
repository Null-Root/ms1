export class AccountModel {
    first_name?: string
    last_name?: string
    date_of_birth?: Date
    email?: string
    password?: string
    token?: string

    constructor() {}

    setFirstName(firstName: string): void {
        this.first_name = firstName;
    }

    setLastName(lastName: string): void {
        this.last_name = lastName;
    }

    setDateOfBirth(dateOfBirth: Date): void {
        this.date_of_birth = dateOfBirth;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    setToken(token: string): void {
        this.token = token;
    }
}
