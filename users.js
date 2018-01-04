const PG = require("pg");
const uuidv4 = require('uuid/v4');
const sha256 = require('js-sha256');

function createUser(form){
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: isPgSslActive(),
  });
    client.connect();
    return client.query(
      "INSERT INTO users(id, name, firstname, login, password) VALUES($1::uuid, $2::text, $3::text, $4::text, $5::text) RETURNING id",
      [uuidv4(), form.lastname, form.firstname, form.username, sha256(form.password)]);

}

function getUser(uuid){
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: isPgSslActive(),
  });
    client.connect();
    return client.query(
      "SELECT * FROM users WHERE id = $1::uuid",
      [uuid]
    );
}

function findUserByEmail(login) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: isPgSslActive(),
  });
    client.connect();
    return client.query(
      "SELECT * FROM users WHERE login = $1::text",
      [login]
    );
}

function findUser(login, password) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: isPgSslActive(),
  });
    client.connect();
    return client.query(
      "SELECT * FROM users WHERE login = $1::text AND password = $2::text",
      [login, sha256(password)])
}

function isPgSslActive () {
  if (process.env.SSLPG === "false") {
    return false;
  }
  return true;
}

module.exports = {
  createUser : createUser,
  getUser: getUser,
  findUser: findUser,
  findUserByEmail: findUserByEmail
}
