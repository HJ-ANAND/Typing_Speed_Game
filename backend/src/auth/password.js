import { randomBytes, scrypt as scryptCallback, timingSafeEqual, } from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
export async function hashPassword(password) {
    const salt = randomBytes(SALT_LENGTH);
    const derivedKey = (await scrypt(password, salt, KEY_LENGTH));
    return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}
export async function verifyPassword(password, storedHash) {
    const [saltHex, hashHex] = storedHash.split(":");
    if (!saltHex || !hashHex) {
        return false;
    }
    const salt = Buffer.from(saltHex, "hex");
    const storedKey = Buffer.from(hashHex, "hex");
    const derivedKey = (await scrypt(password, salt, KEY_LENGTH));
    if (storedKey.length !== derivedKey.length) {
        return false;
    }
    return timingSafeEqual(storedKey, derivedKey);
}
