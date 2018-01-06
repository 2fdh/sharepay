const { createTransaction, payback } = require("./payback/payback.js");
const expense1 = createTransaction("roger",10,["roger","bernard"]);
const expense2 = createTransaction("bernard",50,["roger","bernard"]);
const transactions = [expense1, expense2];
console.log(payback(transactions, ["roger", "bernard"]));
