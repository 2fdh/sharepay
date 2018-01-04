const uuidv4 = require('uuid/v4');
const sha256 = require('js-sha256');

function createUser(form, pool){
    return pool.query(
      "INSERT INTO users(id, name, firstname, login, password) VALUES($1::uuid, $2::text, $3::text, $4::text, $5::text) RETURNING id",
      [uuidv4(), form.lastname, form.firstname, form.username, sha256(form.password)]);

}

function createUserFromFb(user, pool){
  return pool.query(
    "INSERT INTO users(id, name, firstname, login, password, facebook_id) VALUES($1::uuid, $2::text, $3::text, $4::text, $5::text, $6::text) RETURNING id, name, login",
    [uuidv4(), user.name, " ", user.email, " ", user.id]);
}

function getUser(uuid, pool){
    return pool.query(
      "SELECT * FROM users WHERE id = $1::uuid",
      [uuid]
    );
}

function findUserById(id, pool) {
    return pool.query(
      "SELECT * FROM users WHERE id = $1::uuid",
      [id]
    );
}

function findUser(login, password, pool) {
    return pool.query(
      "SELECT * FROM users WHERE login = $1::text AND password = $2::text",
      [login, sha256(password)])
}

function findOrCreateFbUser(user, pool) {
  return pool.query(
    "SELECT * FROM users WHERE facebook_id = $1::text",
    [user.id]
  )
  .then(res => {
    if (res.rowCount > 0) {
      return res.rows[0];
    } else {
      createUserFromFb(user, pool)
        .then(resultQuery => {
          const userObject = {id: resultQuery.rows[0].id, name: resultQuery.rows[0].name, login: resultQuery.rows[0].login}
          return userObject;
        })
        .catch(e => console.log(e));
    }
  })
  .catch(e => console.log(error));
}

module.exports = {
  createUser : createUser,
  getUser: getUser,
  findUser: findUser,
  findUserById: findUserById,
  findOrCreateFbUser: findOrCreateFbUser
}
