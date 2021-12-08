// const { response } = require('express');
const AppError = require('./../utils/appError');

// example: 127.0.0.1:4000/api/v1/items/wwwwwwww
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  console.log(value);

  const message = `Duplicate field value: ${value}.please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR ', err);

    // 2) Send generic message

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('hello from error dev');
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('hello from error prod');
    // Create a hardcopy of the error
    let error = { ...err };
    // console.log(error);
    // example: 127.0.0.1:4000/api/v1/items/wwwwwwww
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    // Example: if we are trying to create an item and duplicate a field that we specified it to be unique in the schema
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    // Example: if we are trying to assign a field with a value that is not axxepted by the validators
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};