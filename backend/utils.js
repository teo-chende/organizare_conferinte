import bcrypt from 'bcrypt';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function passHashCompare(pass_str, pass_hash) {
    return bcrypt.compare(pass_str, pass_hash)
}