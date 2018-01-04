const utils = require("./utils.js");
const uuidv4 = require('uuid/v4');

function getAllActivities(pool, callback) {
  pool.query(
    "SELECT * FROM activities where status='Open'",
    function(error, resultQuery) {
      if (error) {
        callback(error);
      } else {
        callback(null, resultQuery.rows);
      }
    }
  );
}

function getAllActivitiesHistory(pool, callback) {
  pool.query(
    "SELECT * FROM activities where status='Close'",
    function(error, resultQuery) {
      if (error) {
        callback(error);
      } else {
        callback(null, resultQuery.rows);
      }
    }
  );
}

function createActivity(form, pool) {
  return pool.query(
      "INSERT INTO activities (id,title,description,status) VALUES ($1::uuid,$2::text,$3::text,$4::text) RETURNING id", [uuidv4(), form.title, form.description, "Open"]
    )
    .then(res => {
      let joinObject = {
        activityId: res.rows[0].id
      };
      return joinObject;
    })
    .then(res => {
      return pool.query(
          "INSERT INTO users (id,name,firstname,login,password) VALUES ($1::uuid,$2::text,$3::text,$4::text,$5::text) RETURNING id", [uuidv4(), "toto", form.attendee, "toto", "titi"]
        )
        .then(res2 => {
          res.userId = res2.rows[0].id;
          return res
        })
        .then(finalRes =>
          pool.query(
            "insert into activities_users Values ($1::uuid,$2::uuid,$3::boolean)", [finalRes.activityId, finalRes.userId, true]
          )
        )
        .catch(e => console.log(e))
    })
}


function getActivityDetails(id, pool) {
  return pool.query("SELECT * from activities where id = $1 ", [id]);
}



module.exports = {
  getAllActivities: getAllActivities,
  createActivity: createActivity,
  getActivityDetails: getActivityDetails,
  getAllActivitiesHistory:getAllActivitiesHistory
};
