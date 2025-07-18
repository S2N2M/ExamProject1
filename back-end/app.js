require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')

const usersRouter = require('./routes/users');
const brandsRouter = require('./routes/brands');
const cartRouter = require('./routes/carts');
const categoriesRouter = require('./routes/categories');
const initRouter = require('./routes/init');
const membershipsRouter = require('./routes/memberships');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const searchRouter = require('./routes/search');
const rolesRouter = require('./routes/roles');


const db = require('./models');

// Insert records and initilize database
async function initializeDatabase() {
	try {
    await db.sequelize.sync({ force: false });
    console.log('Back-end connection established successfully. Running on port 3000')
  } catch (err) {
    console.error('Unable to initialize the database:', err)
  }
}

// Initilize database
initializeDatabase()

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


app.use('/auth', usersRouter);
app.use('/brands', brandsRouter);
app.use('/cart', cartRouter);
app.use('/categories', categoriesRouter);
app.use('/', initRouter);
app.use('/memberships', membershipsRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/search', searchRouter);
app.use('/roles', rolesRouter);


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
