import jwt from "jsonwebtoken";

const secret = process.env.SECRET || "secret"
const expiresIn = "7d";

export function createToken(payload: any) {
    return jwt.sign(payload, secret, {expiresIn})
}