const express = require('express');
const morgan = require('morgan');
const itemRouter = require('./routes/itemRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Express is a function which add a bunch of methods to our app variable
const app = express();

// ================================================================================================
//                                 1) Middlewares
// ================================================================================================

// Log the information about the request that we did only if we are in development. dev is an argument that specify how the logging will look like
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// In this middleware the data from the body is added to the request (req.body becomes available)
app.use(express.json());
// Serve static files in public folder(ex: home.html)
app.use(express.static(`${__dirname}/public`));
// Add the current time to the request by defining a property requestTime on the request, toISOString is a date function that converts it to a readable string
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ================================================================================================
//                                 2) Routes
// ================================================================================================

// Mount itemRouter to that route
app.use('/api/v1/items', itemRouter);
// Mount userRouter to that route
app.use('/api/v1/users', userRouter);

// =========================================================================================
//                                 4) Error handling middlewares
// =========================================================================================

// Handling unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
