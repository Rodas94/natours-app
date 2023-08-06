const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1. get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  //2. create checkout session
  //const priceId = 333333;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        //description: tour.summary,
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
          },
          unit_amount: tour.price * 100,
        },
      },
    ],
    mode: 'payment',
  });
  //3. Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
