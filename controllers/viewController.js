const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1. Get tour data from collection
  const tours = await Tour.find();
  //2. Build template
  //3. Render that template useing tour data from

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1.
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fieldes: 'review rating user',
  });

  if (!tour) {
    return next(new appError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login into account',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updateUser,
  });
});
