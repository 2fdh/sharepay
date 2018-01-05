const uuidv4 = require('uuid/v4');
const sha256 = require('js-sha256');


function getExpenses(activityId, pool){
  return pool.query(
    "SELECT * FROM expenses WHERE activity_id = $1::uuid",
    [activityId]
  )

}

function createExpense(activityId, user, expenseForm, pool){
 return pool.query(
   "INSERT INTO expenses (id, title, date, amount, activity_id, payer_id) VALUES ($1::uuid, $2::text, $3::date, $4::integer, $5::uuid, $6::uuid) RETURNING id",
   [uuidv4(), expenseForm.title, new Date(), expenseForm.amount, activityId, user.id]
 ).then(res => {
   return expenseForm.attendees.forEach(attendee => linkExpenseToAttendee(res.rows[0].id, attendee, pool))
 })
 .catch(e => console.log(e));
}


function linkExpenseToAttendee(expenseId, attendeeId, pool) {
  return pool.query(
    "INSERT INTO expenses_attendees (expense_id, attendee_id) VALUES ($1::uuid, $2::uuid)",
    [expenseId, attendeeId]
  )
}

module.exports = {
  getExpenses: getExpenses,
  createExpense: createExpense
}
