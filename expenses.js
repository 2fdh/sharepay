const uuidv4 = require("uuid/v4");


function getExpenses(activityId, pool){
  return pool.query(
    "SELECT * FROM expenses WHERE activity_id = $1::uuid",
    [activityId]
  );
}

function createExpense(activityId, user, expenseForm, pool){
  console.log(activityId);
  console.log(user);
  console.log(expenseForm);


  return pool.query(
    "INSERT INTO expenses (id, title, date, amount, activity_id, payer_id) VALUES ($1::uuid, $2::text, $3::date, $4::integer, $5::uuid, $6::uuid) RETURNING id",
    [uuidv4(), expenseForm.title, new Date(), expenseForm.amount.replace(/,/g, ".") * 100, activityId, expenseForm.debitor]
  ).then(res => {
    return expenseForm.attendees.forEach(attendee => linkExpenseToAttendee(res.rows[0].id, attendee, pool));
  })
    .catch(e => console.log(e));
}


function linkExpenseToAttendee(expenseId, attendeeId, pool) {
  return pool.query(
    "INSERT INTO expenses_attendees (expense_id, attendee_id) VALUES ($1::uuid, $2::uuid)",
    [expenseId, attendeeId]
  );
}

function getExpense(expenseId, pool){
  return pool.query(
    "SELECT e.id, e.title, e.date, e.amount, a.name FROM expenses e INNER JOIN attendees a ON (a.id = e.payer_id) WHERE e.id = $1::uuid",
    [expenseId]
  ).then(simpleExpense => {
    getExpenseAttendees(expenseId, pool)
      .then(attendees => {
        const fullExpense = simpleExpense.rows[0];
        fullExpense.attendees = attendees.rows;
        return fullExpense;
      });
  }
  );
}

function getExpenseAttendees(expenseId, pool) {
  return pool.query(
    "SELECT a.id, a.name FROM expenses_attendees ea INNER JOIN attendees a ON (a.id = ea.attendee_id) WHERE ea.expense_id = $1::uuid",
    [expenseId]
  );
}

module.exports = {
  getExpenses: getExpenses,
  createExpense: createExpense,
  getExpense: getExpense
};
