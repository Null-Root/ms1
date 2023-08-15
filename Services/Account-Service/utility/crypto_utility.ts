import bcryptjs from 'bcryptjs';

async function hashString(plainText: string) {
    return await bcryptjs.hash(plainText, 10);
}

async function compareHash(plainText: string, hashedPassword: string) {
    return await bcryptjs.compare(plainText, hashedPassword);
}

export { hashString, compareHash };