import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);

export function encrypt(password: string) {
    return bcrypt.hashSync(password, salt);
}