import config from "config";
import winston from "winston";
import { getUser, getNeedByUUID, isTransactionRedeemed, addRedeemedTransaction, redeemSeedsToken, deactivateNeed } from "api/db";
import { validateTransaction, transactionStatus, validateOneSeedsTransaction } from "api/ethereum/transactions";
import { sendRedeemSuccessEmail, sendRedeemFailedEmail } from "api/utils/mailer";

export const getRedeem = async (req, res) => {

  if (!req.session.email) {
    return res.redirect('add-need');
  }

  const user = await getUser(req.session.email);
  const need = await getNeedByUUID(req.params.needUUID, user._id);

  if (!need) {
    return res.redirect('/not-found');
  }

  const data = {
    title: need.title,
    description: need.description,
    cost: need.cost,
    active: need.tokenRedeemed,
    token_address: config.seeds_token_receiver_address
  };

  res.render('redeem', data);
};


export const postRedeem = async (req, res) => {

  if (!req.session.email) {
    return res.redirect('add-need');
  }

  const user = await getUser(req.session.email);
  const need = await getNeedByUUID(req.params.needUUID, user._id);
  const transactionHash = req.body.tx;

  if (!need) {
    return res.redirect('/not-found');
  }

  let data = {
    title: need.title,
    description: need.description,
    cost: need.cost,
    active: need.tokenRedeemed,
    token_address: config.seeds_token_receiver_address
  };

  const alreadyRedeemed = await isTransactionRedeemed(transactionHash);
  if (alreadyRedeemed) {
    winston.info(`Attempt to redeem already redeemed transaction ${transactionHash}`);
    data.txError = true;
    return res.render('redeem', data);
  }

  redeemSeedsToken(need._id, user._id);

  validateOneSeedsTransaction(transactionHash).then(status => {
    if (status == transactionStatus.NOT_FOUND || status == transactionStatus.NOT_VALID) {
      deactivateNeed(need._id, user._id);
      sendRedeemFailedEmail(req.session.email, need.uuid);
    } else {
      winston.info(`User ${user.email} redeemed need ${need.uuid}`);
      addRedeemedTransaction(user._id, transactionHash);
      sendRedeemSuccessEmail(req.session.email);
    }
  });

  data.active = true;

  res.render('redeem', data);
};
