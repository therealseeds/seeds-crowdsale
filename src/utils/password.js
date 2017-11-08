import crypto from 'crypto';

var LEN = 256;
var SALT_LEN = 64;
var ITERATIONS = 10000;
var DIGEST = 'sha256';

export const hashPassword = (password, salt) => {
  if (!salt) {
    salt = crypto.randomBytes(SALT_LEN / 2).toString('hex');
  }

  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, LEN / 2, DIGEST);
  return { hash: derivedKey.toString('hex'), salt };
};

export const verifyPassword = (password, hash, salt) => {
  const hashedPassword = hashPassword(password, salt);
  return hashedPassword['hash'] === hash;
};
