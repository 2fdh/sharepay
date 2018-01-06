const utils = require("./utils.js");
const uuidv4 = require('uuid/v4');

function getAllActivities(pool,id) {
  return pool.query(
    "SELECT * FROM activities inner join activities_users on activities_users.activity_id=activities.id where status='Open' and activities_users.user_id=$1",
    [id]
  )
    .then (resultQuery => resultQuery.rows)
    .catch(e => console.log(e))
  }

function getAllActivitiesHistory(pool,id) {
  return pool.query(
    "SELECT * FROM activities INNER JOIN activities_users on activities_users.activity_id=activities.id WHERE status='Close' AND activities_users.user_id=$1",
    [id]
  )
    .then (resultQuery => resultQuery.rows)
    .catch(e => console.log(e))
  }


function createActivity(form, pool,user) {
  return pool.query(
      "INSERT INTO activities (id,title,description,status) VALUES ($1::uuid,$2::text,$3::text,$4::text) RETURNING id",
      [uuidv4(), form.title, form.description, "Open"]
    )
    .then (resActivityId => {
      return pool.query(
        "INSERT INTO activities_users VALUES ($1::uuid, $2::uuid) RETURNING activity_id",
        [resActivityId.rows[0].id,user.id]
      )
    })
    .then(resActivityId => {
      let joinActivity = {
        activityId: resActivityId.rows[0].activity_id
      };
      return joinActivity;
    })
    .then (resObjActivityId => {
      return pool.query(
          "INSERT INTO attendees VALUES ($1::uuid,$2::text,$3::text) RETURNING id",
          [uuidv4(),user.name,user.login]
        )
        .then (resAttendeeId => {
          resObjActivityId.attendeeId = resAttendeeId.rows[0].id;
          return resObjActivityId;

          })
        .then(resObjActivityAttendee => {
          return pool.query(
            "INSERT INTO activities_attendees VALUES ($1::uuid,$2::uuid) RETURNING activity_id",
            [resObjActivityAttendee.activityId, resObjActivityAttendee.attendeeId]
          )
        })
        .then(resActivityId => {
          let ObjActivityId = {
            activityId: resActivityId.rows[0].activity_id
          };
          return ObjActivityId;
        })
        .catch(e => console.log(e));
})
    .then(resObjActivity => {
      form.attendee.map(function treatActivityAttributes(element) {
        pool.query(
          "INSERT INTO attendees VALUES ($1::uuid,$2::text,$3::text) RETURNING id",
          [uuidv4(), element, null]
        )
          .then(resAttendeeId => {
            resObjActivity.attendeeId = resAttendeeId.rows[0].id;
            return resObjActivity;
          })
          .then(resActivityAttendee => {
            pool.query(
              "INSERT INTO activities_attendees VALUES ($1::uuid,$2::uuid)",
              [resActivityAttendee.activityId, resActivityAttendee.attendeeId]
            );
          }
          )
          .catch(e => console.log(e));
      });
    })
    .catch(e => console.log(e));
}

function getActivityDetails(id, pool) {
  return pool.query("SELECT * FROM activities WHERE id = $1 ", [id]);
}

function getActivityAttendees(activityId,pool){
  return pool.query(
    "SELECT name, attendees.id, activities_attendees.attendee_id FROM attendees INNER JOIN activities_attendees ON activities_attendees.attendee_id=attendees.id WHERE activities_attendees.activity_id= ($1::uuid)",
    [activityId]);
}

function closeActivity(activityId, pool) {
  return pool.query(
    "UPDATE activities SET status='Close' WHERE id=($1::uuid)",
    [activityId]
  );
}

module.exports = {
  getAllActivities: getAllActivities,
  createActivity: createActivity,
  getActivityDetails: getActivityDetails,
  getAllActivitiesHistory:getAllActivitiesHistory,
  closeActivity:closeActivity,
  getActivityAttendees:getActivityAttendees
};
