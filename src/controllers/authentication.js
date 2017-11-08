import { signUpUser, getUser } from "api/db";
import { hashPassword, verifyPassword } from "api/utils/password";
import { addToMailingList } from "api/utils/mailchimp";


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

  const correct = verifyPassword(password, user.password, user.salt);
  if (!correct) {
    return res.redirect(`/${from}?signin=true&errorMessage=wrongCredentials`);
  }

  req.session.email = email;
  return res.redirect(`/${to}`);
};

export const signUp = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!isValideEmail(email) || (password != confirmPassword)) {
    return res.redirect("/?signup=true&errorMessage=badInput");
  }

  const hashed = hashPassword(password);
  const success = await signUpUser(email, hashed.hash, hashed.salt);

  if (!success) {
    return res.redirect("/?signup=true&errorMessage=alreadyExists");
  }

  req.session.email = email;
  // addToMailingList(email);
  return res.redirect("/contribute");
};


const isValideEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
