import { addAcceptedTerms } from 'api/db';

export const getTerms = (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true");
  }

  res.render('terms');
}

export const postTerms = (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true");
  }

  if (!req.body.acceptTerms) {
    return res.render('terms', { error: true });
  }

  addAcceptedTerms(req.session.email);
  res.redirect("/contribute");
}
