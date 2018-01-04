const PG = require("pg");

function healthCheck(pool) {
  return pool.query(
    "SELECT datname FROM pg_stat_activity");
}

module.exports = {
  healthCheck:healthCheck
};
