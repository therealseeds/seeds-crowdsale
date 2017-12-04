import { categories } from "api/utils/needs";
import { getUser, addUserInfo, addUserNeed } from "api/db";

export const getAddNeed = async (req, res) => {

  const errorMessage = req.query.errorMessage;
  const successMessage = req.query.successMessage;

  const data = {
    isLoggedIn: req.session.email != undefined,
    wrongCredentialsError: errorMessage == "wrongCredentials",
    badInputError: errorMessage == "badInput",
    alreadyExistsError: errorMessage == "alreadyExists",
    emailVerified: successMessage == "emailVerified",
    categories
  };

  res.render('add-need', data);
};

export const postAddNeed = async (req, res) => {

  if (!req.session.email) {
    return res.redirect('add-need');
  }

  if (!req.body.title
      || !req.body.description
      || !req.body.cost
      || !(req.body.needCategory || req.body.needCategoryOther)
    ) {
    return res.redirect('add-need?errorMessage=badInput');
  }

  const user = await getUser(req.session.email);

  const name = req.body.name;
  const gender = req.body.gender;
  const age = req.body.age;

  let userInterests = [];
  const userInterestsOther = req.body.userInterestsOther;
  if (userInterestsOther) userInterests.push('Other: ' + userInterestsOther);

  if (req.body.userInterests)
    for (let key of req.body.userInterests) {
      const category = categories.filter(cat => cat.key == key)[0];
      if (category) userInterests.push(category.name);
    }


  const needTitle = req.body.title;
  const needDescription = req.body.description;
  const needCost = req.body.cost;

  let needCategories = [];
  const needCategoryOther = req.body.needCategoryOther;
  if (needCategoryOther) needCategories.push('Other: ' + needCategoryOther);

  if (req.body.needCategory)
    for (let key of req.body.needCategory) {
      const category = categories.filter(cat => cat.key == key)[0];
      if (category) needCategories.push(category.name);
    }

  addUserInfo(req.session.email, name, gender, age, userInterests);

  const need = await addUserNeed(user._id, needTitle, needDescription, needCost, needCategories);
  return res.redirect('redeem/' + need.uuid);
};
