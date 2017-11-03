import config from "config";
import { transactionStatus } from "api/ethereum/transactions";


const calculateSeedsAmount = (purchase) => purchase.value / purchase.price / config.sds;
const calculateSeedsUnitsAmount = (purchase) => purchase.value / purchase.price;
export const getConfirmedPurchases = (user) => user.purchases.filter((purchase) => purchase.status == transactionStatus.CONFIRMED);
export const calculateTotalSeeds = (purchases) => purchases.map(calculateSeedsAmount).reduce((sum, x) => sum + x, 0);
export const calculateTotalSeedsUnits = (purchases) => Math.round(purchases.map(calculateSeedsUnitsAmount).reduce((sum, x) => sum + x, 0));
