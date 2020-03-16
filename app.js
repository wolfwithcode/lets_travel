require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  console.log('current path is: ' + req.path);
  res.locals.url = req.path;
  next();
})
// Set up mongoose connection
// mongoose.connect('mongodb+srv://lets_travel_admin:choipokerK0@cluster0-svt6p.mongodb.net/test?retryWrites=true&w=majority');

// mongoose.Promise = global.Promise;

// 
// const MONGODB_URI = 'mongodb+srv://lets_travel_admin:travel1@cluster0-svt6p.mongodb.net/test?retryWrites=true&w=majority';
// mongoose.connect(MONGODB_URI);
// mongoose.connection.on('error',(error)=> console.error(error.message));
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!!!!!');
});
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://lets_travel_admin:choipokerK0@cluster0-svt6p.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
mongoose.Promise = global.Promise;
//Import the mongoose module


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
