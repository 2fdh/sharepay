const PG = require("pg");

function healthCheck(callback) {
  const client = new PG.Client({
  connectionString: process.env.DATABASE_URL,
  ssl:true,
});
  client.connect();
  client.query(
    "SELECT datname FROM pg_stat_activity",
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

module.exports = {healthCheck:healthCheck};
