const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new appError(message, 400);
};
const sendErrorDev = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //B) render website
  console.log('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value} please use another value`;
  return new AppError(message, 400);
};
const handelValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')} `;
  return new AppError(message, 400);
};
const handelJWTError = () =>
  new AppError('Invalid token. please log in again', 401);
const handelJWTExpiredError = () => {
  new AppError('Your token has Expired. plaese log in again');
};
const sendErrorProd = (err, req, res) => {
  console.log(req.originalUrl);
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    //A) Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //B) Programming or other unknown error: don't leak error details
    // 1) log error
    console.error('ERROR ', err);
    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  //B) Render website
  //A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  //B) Programming or other unknown error: don't leak error details
  // 1) log error
  console.log('ERROR', err);
  //send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'validationError')
      error = handelValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handelJWTError();
    if (error.name === 'TokenExpiredError') error = handelJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
