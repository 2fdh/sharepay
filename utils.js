const PG = require("pg");

function healthCheck(callback) {
  const client = new PG.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isPgSslActive(),
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

function connectDB() {
  const client = new PG.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isPgSslActive(),
});
  client.connect();
  return client.query(
    "SELECT datname FROM pg_stat_activity");
}

function isPgSslActive () {
  if (process.env.SSLPG === "false") {
    return false;
  }
  return true;
}

module.exports = {
  healthCheck:healthCheck,
  isPgSslActive : isPgSslActive,
  connectDB: connectDB
};
