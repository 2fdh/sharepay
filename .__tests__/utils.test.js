const utils = require("../utils.js")
const { Pool } = require('pg')

const pool = new Pool({
  user: 'sharepay2fdh_test',
  host: 'localhost',
  database: 'sharepay2fdh_test',
  password: '',
  port: 5432,
})

test("should connect DB and show stats", () => {
  expect.assertions(1);

  return utils.healthCheck(pool).then(result =>
    expect(result.rows.length).toBeGreaterThan(0)
  );

})
