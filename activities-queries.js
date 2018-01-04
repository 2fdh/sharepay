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
  client.connect();
  return client.query(
    "INSERT INTO activities (id,title,description,status) VALUES ($1,$2,$3,$4) RETURNING id",
    [uuidv4(),form.title,form.description,"Open"]);
  }

function addAttendees(form) {
  const client = new PG.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: utils.isPgSslActive(),
});
  client.connect();
  return client.query(
    "INSERT INTO users (id,name,firstname,login,password) VALUES ($1,$2,$3,$4,$5) RETURNING id",
    [uuidv4(),"toto",form.attendee,"toto","titi"]);
  }

function retrieveUserId(form){
  const client = new PG.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: utils.isPgSslActive(),
});
  client.connect();
  return client.query(
    "select id from users where firstname=$1",
    [form.attendee])
}

function retrieveActivityId(form){
  const client = new PG.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: utils.isPgSslActive(),
});
  client.connect();
  return client.query(
    "select id from activities where title=$1 and description=$2",
    [form.title,form.description])
}

function insertActivitiesUsers(form){
  const client = new PG.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: utils.isPgSslActive(),
});
  Promise.all([
    retrieveUserId(form),
    retrieveActivityId(form)
  ])
  .then (function(promiseAllResult) {
    client.connect();
    return client.query(
      "insert into activities_users Values ($1,$2,$3)",
      [promiseAllResult[1].rows[0].id,promiseAllResult[0].rows[0].id,true]
  )
})
}


module.exports = {
  getAllActivities:getAllActivities,
  createActivity:createActivity,
  addAttendees:addAttendees,
  insertActivitiesUsers:insertActivitiesUsers
};
