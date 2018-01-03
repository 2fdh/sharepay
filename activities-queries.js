const PG = require("pg");
const utils = require("./utils.js");

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

module.exports = {getAllActivities:getAllActivities};
