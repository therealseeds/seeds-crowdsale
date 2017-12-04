import config from "config";
import { getUser, getNeedByUUID, isTransactionRedeemed, addRedeemedTransaction, redeemSeedsToken } from "api/db";
import { validateTransaction, transactionStatus, validateOneSeedsTransaction } from "api/ethereum/transactions";

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
    data.txError = true;
    return res.render('redeem', data);
  }

  const status = await validateOneSeedsTransaction(transactionHash);

  if (status == transactionStatus.NOT_FOUND || status == transactionStatus.NOT_VALID) {
    data.txError = true;
  } else {
    addRedeemedTransaction(user._id, transactionHash);
    redeemSeedsToken(need._id, user._id);
    data.active = true;
  }

  res.render('redeem', data);
};
