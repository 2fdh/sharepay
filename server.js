const express = require("express");
const utils = require("./utils.js");
const nunjucks = require("nunjucks");
const aqueries = require("./activities-queries.js");
const usersService = require("./users.js")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();

const port = process.env.PORT || 3000;

nunjucks.configure("views", {
  autoescape: true,
  express: app
});
app.set("views", __dirname + "/views");
app.set("view engine", "njk");

app.use(require("body-parser").urlencoded({ extended: true }));
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
  return callback(null, user.login);
});

passport.deserializeUser(function(login, callback) {
  return usersService.findUserByEmail(login).then(user => {
    callback(null, user)
  });
})


passport.use(
  new LocalStrategy(function(login, password, callback) {
    usersService
      .findUser(login, password)
      .then(user => {
        console.log(user);
        callback(null, user.rows[0]);
      })
      .catch(error => {
        callback(error);
      });
  })
);


app.get("/", function (request, result) {
  result.redirect("/login");
});

app.get("/login", function (request, result) {
  result.render("login");
});

app.post("/authenticate",
passport.authenticate("local", { failureRedirect: "/login" }),
function (request, result) {
  result.redirect("/profiles");
});



app.get("/signup", function (request, result) {
  result.render("signup");
});

app.get("/profiles/:profile_id", function (request, result) {
  usersService.getUser(request.params.profile_id)
    .then(res => result.render("profiles", {user: res.rows[0]}))
    .catch(e => result.redirect("/signup"));
});

app.post("/create_user", function (request, result) {
  console.log(request.body);
  usersService.createUser(request.body)
    .then(res => result.redirect("/profiles/" + res.rows[0].id ))
    .catch(e => console.log(e.stack));
});

app.get("/health-check", function (request, result) {
  utils.healthCheck((error, resultQuery) => {
    if (error) {
      result.send(error);
    } else {
      result.send(resultQuery);
    }
  })
});

app.get("/activities", function (request, result) {
    aqueries.getAllActivities((error, resultQuery) => {
      if (error) {
        result.send(error);
      } else {
        result.render("activities",{activities:resultQuery});
      }
    })
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
