import { signUpUser } from "api/db";


export const signIn = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
};

export const signUp = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!isValideEmail(email) || (password != confirmPassword)) {
    return res.redirect("/?signup=true&errorMessage=badInput");
  }

  const success = await signUpUser(email);
  console.log(success);

};


const isValideEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
