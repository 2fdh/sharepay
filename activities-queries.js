const PG = require("pg");
const utils = require("./utils.js");
const uuidv4 = require('uuid/v4');

function getAllActivities(callback) {
  const client = new PG.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: utils.isPgSslActive(),
});
  client.connect();
  client.query(
    "SELECT * FROM activities where status='Open'",
    function(error, resultQuery) {
      if (error) {
        callback(error);
      } else {
        callback(null, resultQuery.rows);
      }
      client.end();
    }
  );
}

function createActivity(form) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: utils.isPgSslActive(),
  });
  client.connect()
  return client.query(
    "INSERT INTO activities (id,title,description,status) VALUES ($1::uuid,$2::text,$3::text,$4::text) RETURNING id",
    [uuidv4(),form.title,form.description,"Open"]
  )
  .then(res => {
    let joinObject = {activityId: res.rows[0].id};
    return joinObject;
  })
  .then(res => {
    return client.query(
      "INSERT INTO users (id,name,firstname,login,password) VALUES ($1::uuid,$2::text,$3::text,$4::text,$5::text) RETURNING id",
      [uuidv4(),"toto",form.attendee,"toto","titi"]
    )
    .then(res2 => {
      res.userId = res2.rows[0].id;
      return res
    })
    .then(finalRes =>
      client.query(
          "insert into activities_users Values ($1::uuid,$2::uuid,$3::boolean)",
          [finalRes.activityId, finalRes.userId, true]
        )
    )
    .catch(e => console.log(e))
  })
}



module.exports = {
  getAllActivities:getAllActivities,
  createActivity:createActivity
};
