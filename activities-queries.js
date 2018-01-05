const utils = require("./utils.js");
const uuidv4 = require('uuid/v4');

function getAllActivities(pool,id) {
  return pool.query(
    //"SELECT * FROM activities where status='Open'"
    "SELECT * FROM activities inner join activities_users on activities_users.activity_id=activities.id where status='Open' and activities_users.user_id=$1",
    [id]
  )
    .then (resultQuery => resultQuery.rows)
    .catch(e => console.log(e))
  }

function getAllActivitiesHistory(pool) {
  return pool.query(
    //"SELECT * FROM activities where status='Close'"
    "SELECT * FROM activities inner join activities_users on activities_users.activity_id=activities.id where status='Close' and activities_users.user_id=$1",
    [id]
  )
    .then (resultQuery => resultQuery.rows)
    .catch(e => console.log(e))
  }


function createActivity(form, pool) {
  return pool.query(
      "INSERT INTO activities (id,title,description,status) VALUES ($1::uuid,$2::text,$3::text,$4::text) RETURNING id", [uuidv4(), form.title, form.description, "Open"]
    )
    .then(resActivityId => {
      let joinActivity = {
        activityId: resActivityId.rows[0].id
      };
      return joinActivity;
    })
    .then(resJoinActivity => {
      return pool.query(
          "INSERT INTO attendees VALUES ($1::uuid,$2::text,$3::text) RETURNING id",
          [uuidv4(), form.attendee, null]
        )
        .then(resAttendeeId => {
          resJoinActivity.attendeeId = resAttendeeId.rows[0].id;
          return resJoinActivity;
        })
        .then(resActivityAttendee =>
          pool.query(
            "insert into activities_attendees Values ($1::uuid,$2::uuid)",
            [resActivityAttendee.activityId, resActivityAttendee.attendeeId]
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
