import randomToken from 'random-token';
import { signUpUser, getUser, verifyEmailToken } from "api/db";
import { hashPassword, verifyPassword } from "api/utils/password";
import { addToMailingList } from "api/utils/mailchimp";
import { sendVerifyEmail } from "api/utils/mailer";


export const signIn = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const to = req.body.to;
  const from = req.body.from;

  if (!isValideEmail(email) || (password == "")) {
    return res.redirect(`/${from}?signin=true&errorMessage=badInput`);
  }

  const user = await getUser(email);
  if (!user) {
    return res.redirect(`/${from}?signin=true&errorMessage=wrongCredentials`);
  }

  if (!user.emailVerified) {
    sendVerifyEmail(email, user.verifyToken);
    return res.render('verify-email', { verified: false, email });
  }

  const correct = verifyPassword(password, user.password, user.salt);
  if (!correct) {
    return res.redirect(`/${from}?signin=true&errorMessage=wrongCredentials`);
  }

  req.session.email = email;
  return res.redirect(`/${to}`);
};

export const signOut = async (req, res) => {
  req.session.email = null;
  return res.redirect(`/`);
};

export const signUp = async (req, res) => {
  const email = req.body.newEmail;
  const password = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  if (!isValideEmail(email) || (password != confirmPassword)) {
    return res.redirect("/?signup=true&errorMessage=badInput");
  }

  const hashed = hashPassword(password);
  const verifyToken = createVerifyToken();
  const success = await signUpUser(email, hashed.hash, hashed.salt, verifyToken);

  if (!success) {
    return res.redirect("/?signup=true&errorMessage=alreadyExists");
  }

  sendVerifyEmail(email, verifyToken);

  return res.render('verify-email', { verified: false, email });
};

export const verifyEmail = async (req, res) => {

  if (!req.query.token) {
    return res.redirect('/');
  }

  const user = await verifyEmailToken(req.query.token);
  if (!user) {
    return res.redirect('/');
  }

  addToMailingList(user.email);
  return res.redirect(`/?signin=true&successMessage=emailVerified`);
};


const isValideEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const createVerifyToken = () => randomToken(32);
