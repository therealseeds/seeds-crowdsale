import { getUsers, updatePurchase } from "api/db";
import { withdrawFromWallet, getWalletBalance } from "api/ethereum/wallets";
import { validateTransaction, transactionStatus } from "api/ethereum/transactions";
import { sendPurchaseConfirmedEmail, sendPurchaseFailedEmail } from "api/utils/mailer";

const transferAllEthers = async () => {
  const users = await getUsers();
  // console.log(users);
  users.forEach((user) => {
    if (!user.walletAddress) return;

    const currBalance = getWalletBalance(user.walletAddress);
    if (currBalance === 0) return;

    console.log(`Wallet ${user.walletAddress} for user ${user.email} has balance = ${currBalance}`);

    const { transactionHash, balance, error } = withdrawFromWallet(user.walletID, user.walletAddress);
    if (!transactionHash) {
      console.log(error);
      return;
    }

    console.log("Withdraw from wallet, transaction: " + transactionHash);

    validateTransaction(transactionHash).then((status) => {
      updatePurchase(transactionHash, status);

      if (status === transactionStatus.CONFIRMED) {
        sendPurchaseConfirmedEmail(user.email);
        console.log("Sending purchase confirmed email to " + user.email);
      } else {
        sendPurchaseFailedEmail(user.email);
        console.log("Sending purchase failed email to " + user.email);
      }
    });
  });
};

transferAllEthers();
