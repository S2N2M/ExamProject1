const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const SQLiteStore = require('connect-sqlite3')(session);


const authRouter = require('./routes/auth');
const brandsRouter = require('./routes/brands');
const categoriesRouter = require('./routes/categories');
const membershipsRouter = require('./routes/memberships')
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const rolesRouter = require('./routes/roles');
const usersRouter = require('./routes/users');

const app = express();
console.log('Front-end connection established successfully. Running on port 3001')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'TEMP_SECRET',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore()
}))


app.use('/', authRouter);
app.use('/admin/categories', categoriesRouter);
app.use('/admin/brands', brandsRouter);
app.use('/admin/memberships', membershipsRouter);
app.use('/admin/orders', ordersRouter);
app.use('/admin/products', productsRouter);
app.use('/admin/roles', rolesRouter);
app.use('/admin/users', usersRouter);

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
