const utils = require("../utils.js")
const { Pool } = require('pg')

const pool = new Pool({
  user: 'user_test',
  host: 'localhost',
  database: 'sharepay2dfh_test',
  password: '',
  port: 5432,
})

test("should connect DB", () => {
  expect.assertions(1);

  return utils.connectDB(pool).then(result =>
    expect(result.rows.length).toBeGreaterThan(0)
  );

})
