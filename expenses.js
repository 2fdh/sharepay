const uuidv4 = require('uuid/v4');
const sha256 = require('js-sha256');


function getExpenses(activityId, pool){
  return pool.query(
    "SELECT * FROM expenses WHERE activity_id = $1::uuid",
    [activityId]
  )

}


module.exports = {
  getExpenses: getExpenses
}
