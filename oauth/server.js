var express = require('express')
var app = express()
var passport = require('passport')
var session = require('express-session')
var env = require('dotenv').load()
var exphbs = require('express-handlebars')
var PORT = process.env.PORT || 3000;


//Middelware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// For Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './views')
app.engine('hbs', exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set('view engine', '.hbs');

//Models
var models = require("./models");


//Routes
require('./routes/auth.js')(app, passport);


//load passport strategies
require('./config/passport/passport.js')(passport, models.user);


//Sync Database
models.sequelize.sync().then(function () {
    console.log('Nice! Database looks fine')

}).catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!")
});



app.listen(PORT, function (err) {
    if (!err)
        console.log(
            "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
            PORT,
            PORT
        ); else console.log(err)

});




