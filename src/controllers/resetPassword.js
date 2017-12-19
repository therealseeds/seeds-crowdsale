import randomToken from "random-token";
import { sendResetPasswordEmail } from "api/utils/mailer";
import { getUser, addResetPasswordToken, getUserByResetPasswordToken, resetUserPassword } from "api/db";
import { hashPassword } from "api/utils/password";

const createVerifyToken = () => randomToken(32);

export const getForgotPassword = (req, res) => {
  res.render("forgot-password");
};

export const postForgotPassword = (req, res) => {
  const email = req.body.email;

  const user = getUser(email);
  if (!user) {
    return res.sendStatus(400);
  }

  const token = createVerifyToken();
  addResetPasswordToken(email, token);

  sendResetPasswordEmail(email, token);
  return res.sendStatus(200);
};

export const getResetPassword = (req, res) => {
  const token = req.query.token;
  res.render("reset-password", { token });
};

export const postResetPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;

  if (!token || !password) {
    return res.sendStatus(400);
  }

  // Get user by token
  const user = await getUserByResetPasswordToken(token);
  if (!user) {
    return res.sendStatus(400);
  }

  // If correct, change password
  const hashed = hashPassword(password);
  resetUserPassword(user.email, hashed.hash, hashed.salt);

  return res.sendStatus(200);
};
