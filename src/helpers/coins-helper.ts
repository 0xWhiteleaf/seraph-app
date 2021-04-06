import BigNumber from "bignumber.js";

export function getShiftedAmount(blockchain: string, amount: BigNumber) {
  if (!blockchain || !amount) return new BigNumber(0);

  switch (blockchain) {
    case "neo":
      return amount.shiftedBy(-8);
    case "eth":
      return amount.shiftedBy(-18);
    case "bsc":
      return amount.shiftedBy(-18);
    default:
      return amount;
  }
}
