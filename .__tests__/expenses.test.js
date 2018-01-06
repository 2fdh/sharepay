const expenses = require("../expenses.js")
const { Pool } = require('pg')

const pool = new Pool({
  user: 'sharepay2fdh_test',
  host: 'localhost',
  database: 'sharepay2fdh_test',
  password: '',
  port: 5432,
})


test("should return expenses from an activity", () => {
  expect.assertions(2);

  return expenses.getExpenses("e28022df-9727-4a98-ab86-12bf9021050f", pool)
  .then(res => {
    expect(res.rows.length).toBe(2)
    expect(res.rows[1].title).toEqual("Binouzes")
  }
)
});

// test("should create a new expense in database", () => {
//   expect.assertions(1);
//
//   const user = {}
//   const expenseForm = {
//     title: "test",
//     amount: "10",
//     debitor: "d04479ef-a2a9-4b3c-8b6d-40fd49062aa1",
//     attendees: ["3f0e622e-bda1-42ff-939f-d6afe6b7e6ff", "2645de87-8b51-4a50-96c3-06a1dc82204f"]
//   }

//   return expenses.createExpense("bee2b457-5b3f-403a-95c1-819a694ea6b1", user, expenseForm, pool)
//     .then(res => {
//       console.log(res);
//       pool.query("SELECT * FROM expenses WHERE id=$1", [res.rows[0].id])
//         .then(expense =>
//           expect(expense.rows[0].title).toBe("test")
//         );
//     })
// });
