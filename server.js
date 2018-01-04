const express = require("express");
const utils = require("./utils.js");
const nunjucks = require("nunjucks");
const aqueries = require("./activities-queries.js");
const usersService = require("./users.js")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const FB = require("fb");

const {
  Pool
} = require('pg')

const app = express();
app.use(require("body-parser").urlencoded({
  extended: true
}));

const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isPgSslActive()
})

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
    callback(null, user)
  });
})


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
         })
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
    usersService.getUser(request.params.profile_id, pool)
      .then(res => result.render("profiles", {
        user: res.rows[0]
      }))
      .catch(e => result.redirect("/signup"));
  });

app.post("/create_user", function(request, result) {
  usersService.createUser(request.body, pool)
    .then(res => result.redirect("/profiles/" + res.rows[0].id))
    .catch(e => console.log(e.stack));
});

app.get("/health-check", function(request, result) {
  utils.healthCheck(pool)
    .then(resultQuery => result.json({message: "everything goes well"}))
    .catch(e => result.send(e));
});

app.get("/activities/create",
require("connect-ensure-login").ensureLoggedIn("/login"),
function(request, result) {
  result.render("activity_create");
});

app.get("/activities",
require("connect-ensure-login").ensureLoggedIn("/login"),
function(request, result) {
  aqueries.getAllActivities(pool, (error, resultQuery) => {
    if (error) {
      result.send(error);
    } else {
      result.render("activities", {
        activities: resultQuery
      });
    }
  })
});

app.get("/activities/history",
require("connect-ensure-login").ensureLoggedIn("/login"),
function(request, result) {
  aqueries.getAllActivitiesHistory(pool, (error, resultQuery) => {
    if (error) {
      result.send(error);
    } else {
      result.render("activities_history", {
        activities: resultQuery
      });
    }
  })
});

app.get("/activities/:id",
require("connect-ensure-login").ensureLoggedIn("/login"),
function(request, result) {
  aqueries.getActivityDetails(request.params.id, pool)
    .then(res => result.render("activity_details", {
      activity_id: res.rows[0].id,
      activity_title: res.rows[0].title,
      activity_description: res.rows[0].description,
      activity_status: res.rows[0].status
    }));
});



app.post(
  "/activities/create",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    aqueries.createActivity(request.body, pool)
      .then(res => result.redirect("/activities"))
      .catch(err => console.warn(err));
  }
)

function isPgSslActive() {
  if (process.env.SSLPG === "false") {
    return false;
  }
  return true;
}

app.listen(port, function() {
  console.log("Server listening on port:" + port);
});
