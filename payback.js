const createTransaction = (debitor, amount, creditors) => {
  return { debitor, amount, creditors };
};

const initBalances = people =>
  people.reduce((acc, contact) => {
    acc[`${contact}`] = 0;
    return acc;
  }, {});

const computeBalance = (acc, transaction) => {
  acc[transaction.debitor] -= transaction.amount;
  const x = transaction.amount / transaction.creditors.length;

  return transaction.creditors.reduce((acc, creditor) => {
    acc[creditor] += x;
    return acc;
  }, acc);
};

const setBalances = (transactions, people) => transactions.reduce(computeBalance, people);

const zipBalances = balances => Object.keys(balances).map(b => [b, balances[b]]);

const computeRefund = (balances, history) => {
  const len = balances.length;

  if (len === 0) {
    return history;
  }

  const sortedBalances = balances.sort((a, b) => a[1] < b[1]);
  const debitor = sortedBalances[0];
  const creditor = sortedBalances[len - 1];

  const refund = debitor[1] + creditor[1];

  const result = sortedBalances.splice(1, len - 2);

  if (refund > 0) {
    history.push({ from: debitor[0], to: creditor[0], value: debitor[1] - refund });
    debitor[1] = refund;
    result.push(debitor);
  } else if (refund < 0) {
    history.push({ from: debitor[0], to: creditor[0], value: debitor[1] });
    creditor[1] = refund;
    result.push(creditor);
  } else {
    history.push({ from: debitor[0], to: creditor[0], value: debitor[1] });
  }

  return computeRefund(result, history);
};

const payback = (transactions, people) => {
  const initializedBalances = initBalances(people);

  const balances = setBalances(transactions, initializedBalances);

  const zippedBalances = zipBalances(balances);

  return computeRefund(zippedBalances, []);
};

module.exports = {
  createTransaction,
  payback
};
