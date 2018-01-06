const express = require("express");
const utils = require("./utils.js");
const nunjucks = require("nunjucks");
const aqueries = require("./activities-queries.js");
const usersService = require("./users.js");
const expensesService = require("./expenses.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const FB = require("fb");

const { Pool } = require("pg");

const app = express();
app.use(require("body-parser").urlencoded({
  extended: true
}));

const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isPgSslActive()
});

nunjucks.configure("views", {
  autoescape: true,
  express: app
});
app.set("views", __dirname + "/views");
app.set("view engine", "njk");

app.use(require("body-parser").urlencoded({
  extended: true
}));
app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    secret: "kjsdhfkjhdfkjshdfkjh76876876gf4534!!jjjds%£",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, callback) {
  return callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  return usersService.findUserById(id, pool).then(user => {
    callback(null, user);
  });
});


passport.use(
  new LocalStrategy(function(login, password, callback) {
    usersService
      .findUser(login, password, pool)
      .then(user => {
        callback(null, user.rows[0]);
      })
      .catch(error => {
        callback(error);
      });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI
    },
    function(accessToken, refreshToken, profile, callback) {
      FB.api(
        "me",
        { fields: "id,name,email", access_token: accessToken },
        function(user) {
          usersService.findOrCreateFbUser(user, pool)
            .then(user => {
              callback(null, user);
            })
            .catch(error => {
              callback(error);
            });
        }
      );
    }
  )
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    authType: "rerequest", // rerequest is here to ask again if login was denied once,
    scope: ["email"]
  })
);

app.get("/", function(request, result) {
  result.redirect("/login");
});

app.get("/login", function(request, result) {
  result.render("login");
});

app.get(
  "/auth/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(request, result) {
    result.redirect("/profiles/" + request.user.id);
  }
);

app.post("/authenticate",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  function(request, result) {

    result.redirect("/profiles/" + request.user.id);
  });

app.get("/signup", function(request, result) {
  result.render("signup");
});

app.get("/profiles/:profile_id",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    Promise.all([
      usersService.getUser(request.params.profile_id, pool),
      aqueries.getAllActivities(pool,request.params.profile_id)
    ])
      .then(function(promiseAllResult) {
        result.render("profiles", {
          user : promiseAllResult[0].rows[0],
          activities : promiseAllResult[1]
        });
      })
      .catch(() => result.redirect("/signup"));
  });

app.post("/create_user", function(request, result) {
  usersService.createUser(request.body, pool)
    .then(res => result.redirect("/profiles/" + res.rows[0].id))
    .catch(e => console.warn(e.stack));
});

app.get("/health-check", function(request, result) {
  utils.healthCheck(pool)
    .then(() => result.json({message: "everything goes well"}))
    .catch(e => result.send(e));
});



app.post(
  "/activities/history/:id",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    aqueries.reOpenActivity(request.params.id,pool)
      .then(() => result.redirect("/activities/"+ request.params.id))
      .catch(err => console.warn(err));
  }
);


app.get("/activities/history",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    const user = request.user.rows[0];
    aqueries.getAllActivitiesHistory(pool,request.user.rows[0].id)
      .then(resultQuery =>result.render("activities_history",{
        activities:resultQuery,
        user: user
      }))
      .catch(err => console.warn(err));
  });



app.get("/activities/create",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    const user = request.user.rows[0];
    result.render("activity_create", {user: user});
  });

app.get("/activities/:id",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    Promise.all([
      aqueries.getActivityDetails(request.params.id, pool),
      aqueries.getActivityAttendees(request.params.id,pool),
      expensesService.getExpenses(request.params.id, pool)
    ])
      .then(function(promiseAllResult) {
        const user = request.user.rows[0];
        result.render("expenses", {
          activity : promiseAllResult[0].rows[0],
          expenses : promiseAllResult[2].rows,
          attendee : promiseAllResult[1].rows,
          user: user
        });
      })
      .catch(err => console.warn(err));
  });



app.post(
  "/activities/create",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    aqueries.createActivity(request.body, pool, request.user.rows[0])
      .then(() => result.redirect("/profiles/"+ request.user.rows[0].id))
      .catch(err => console.warn(err));
  }
);

app.post(
  "/activities/:id",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    aqueries.closeActivity(request.params.id,pool)
      .then(() => result.redirect("/profiles/"+ request.user.rows[0].id))
      .catch(err => console.warn(err));
  }
);


app.get(
  "/activities/:activityid/create-expense/",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result){
    const user = request.user.rows[0];
    const activity = {id: request.params.activityid};
    aqueries.getActivityAttendees(request.params.activityid, pool)
      .then(attendees => {
        result.render("new_expense", {activity: activity, attendees: attendees.rows, user: user});
      })
      .catch(err => console.warn(err));
  }
);

app.post(
  "/activities/:activityid/create-expense/",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result){

    const activityId = request.params.activityid;
    const user = request.user.rows[0];
    const expenseForm = request.body;

    expensesService.createExpense(activityId, user, expenseForm, pool)
      .then(
        result.redirect("/activities/"+ activityId)
      )
      .catch(err => console.warn(err));
  }
);

app.get(
  "/activities/:activityId/expenses/:expenseId",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result){
    const user = request.user.rows[0];
    const expenseId = request.params.expenseId;
    const activityId = request.params.activityId;

    expensesService.getExpense(expenseId, pool)
      .then(expense => {
        result.render("expense", {
          expense : expense,
          user: user,
          activityId: activityId
        });
      })
      .catch(err => console.warn(err));
  }
);

app.get(
  "/activities/history/:activityId",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    Promise.all([
      aqueries.getActivityDetails(request.params.activityId, pool),
      aqueries.getActivityAttendees(request.params.activityId,pool),
      expensesService.getExpenses(request.params.activityId, pool)
    ])
      .then(function(promiseAllResult) {
        const user = request.user.rows[0];
        result.render("historyactivity", {
          activity : promiseAllResult[0].rows[0],
          expenses : promiseAllResult[2].rows,
          attendee : promiseAllResult[1].rows,
          user: user
        });
      })
      .catch(err => console.warn(err));
  });

//  Balance implementation

app.get(
  "/activities/:activityid/expenses",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result){
    Promise.all([
      aqueries.getActivityDetails(request.params.activityid, pool),
      aqueries.getActivityAttendees(request.params.activityid,pool),
      expensesService.getExpenses(request.params.activityid, pool),
    ])
    .then(function(promiseAllResult) {
      console.log(promiseAllResult[2]); //undefined
      promiseAllResult[2].rows.id.map(createTransaction(getExpenseOwner(),10,getExpenseAttendees()));
    })
    .then(function(promiseAllResult) {
        result.render("new_expenses", {
          activity : promiseAllResult[0].rows[0],
          attendee : promiseAllResult[1].rows,
          expenses : promiseAllResult[2].rows
        })
      })
  }
)

// How it works
//
// [expense1,expense2,expense3].map(createTransaction("expenseOwner",10,["attende1","attende2"]))
// [expenseBis1,expenseBis2,expenseBis3]
// payback([expenseBis1,expenseBis2,expenseBis3],["attende1","attende2"])




//  Payback algo test
const { createTransaction, payback } = require('./payback/payback.js');
const expense1 = createTransaction("roger",10,["roger","bernard"]);
const expense2 = createTransaction("bernard",40,["roger","bernard"]);
const transactions = [expense1, expense2];
console.log(payback(transactions, ["roger", "bernard"]));

//  End of ayback algo test




function isPgSslActive() {
  if (process.env.SSLPG === "false") {
    return false;
  }
  return true;
}

app.listen(port, function() {
  console.log("Server listening on port:" + port);
});
