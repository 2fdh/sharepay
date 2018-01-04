const utils = require("../utils.js")

test("should connect DB", () => {
  expect.assertions(1);

  return utils.connectDB().then(result =>
    expect(result.rows.length).toBeGreaterThan(3)
  );

})
