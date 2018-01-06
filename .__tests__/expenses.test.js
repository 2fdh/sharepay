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


// function getExpenses(activityId, pool){
//   return pool.query(
//     "SELECT * FROM expenses WHERE activity_id = $1::uuid",
//     [activityId]
//   )
//
// }
