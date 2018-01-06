const users = require("../users.js")
const { Pool } = require('pg')
const sha256 = require('js-sha256');

const pool = new Pool({
  user: 'sharepay2fdh_test',
  host: 'localhost',
  database: 'sharepay2fdh_test',
  password: '',
  port: 5432,
})


describe("user creation", () => {
  test("should create a user", () => {
    const form = {
      username: "john.biloute@mail.com",
      password: "azerty",
      firstname: "john",
      lastname: "biloute",
    }

    expect.assertions(1);

    return users.createUser(form, pool)
      .then(res => users.getUser(res.rows[0].id, pool))
      .then(user =>
        expect(user.rows[0].login).toBe("john.biloute@mail.com")
      )
  });

  test("should create a FB user", () => {
    const user = {
      id: "123456789",
      email: "john.biloute@mail.com",
      name: "john biloute",
    }

    expect.assertions(1);

    return users.createUserFromFb(user, pool)
      .then(res => users.getUser(res.rows[0].id, pool))
      .then(user =>
        expect(user.rows[0].login).toBe("john.biloute@mail.com")
      )
  });

  test("should create a FB user because its not known in DB", () => {
    const user = {
      id: "123456789",
      email: "john.biloute@mail.com",
      name: "john biloute",
    }

    return users.findOrCreateFbUser(user, pool)
    .then(res => {
        return pool.query(
          "SELECT * FROM users WHERE facebook_id = $1::text",
          [123456789]
        )
        .then(resultQry => {
            if (resultQry.rows[0].id === res.id ) {
              return true
            }
          }
        )
      }
    )
    .then(check =>
      expect(check).toBe(true)
    )

  });

});


describe("get Users", () => {
  test("should return one user that is Hamza ALI", () => {
    expect.assertions(4);

    return users.getUser("d04479ef-a2a9-4b3c-8b6d-40fd49062aa1", pool).then(result => {
        expect(result.rows.length).toBe(1)
        expect(result.rows[0].id).toBe("d04479ef-a2a9-4b3c-8b6d-40fd49062aa1")
        expect(result.rows[0].name).toBe("ALI")
        expect(result.rows[0].firstname).toBe("Hamza")
      }
    );

  });

  test("should return one user that is Hamza ALI", () => {
    expect.assertions(4);

    return users.findUserById("d04479ef-a2a9-4b3c-8b6d-40fd49062aa1", pool).then(result => {
        expect(result.rows.length).toBe(1)
        expect(result.rows[0].id).toBe("d04479ef-a2a9-4b3c-8b6d-40fd49062aa1")
        expect(result.rows[0].name).toBe("ALI")
        expect(result.rows[0].firstname).toBe("Hamza")
      }
    );

  });

  test("should return one user that is Fabien GLORY", () => {
    expect.assertions(4);

    return users.findUser("fabien.glory@decathlon.com", "1234", pool).then(result => {
        expect(result.rows.length).toBe(1)
        expect(result.rows[0].id).toBe("134b1f24-d1f8-4091-b704-963acc2f8487")
        expect(result.rows[0].name).toBe("GLORY")
        expect(result.rows[0].firstname).toBe("Fabien")
      }
    );

  });
});
