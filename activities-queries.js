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
    "INSERT INTO activities (id,title,description,status) VALUES ($1,$2,$3,$4)",
    [uuidv4(),form.title,form.description,"Open"]);
    // [form.title,form.description],
    // function(error, resultQuery) {
    //   if (error) {
    //     return error;
    //   } else {
    //     return resultQuery;
    //   }
    //  client.end();
    }


module.exports = {
  getAllActivities:getAllActivities,
  createActivity:createActivity
};
