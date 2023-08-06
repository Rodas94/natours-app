import axios from 'axios';
import { showAlert } from './alerts';
//import Stripe from 'stripe';
const stripe = Stripe(
  'pk_test_51NaffyGxqzSfWeI4Xx97mCZQfifZNkcxON47cVlqsTYaWMh2LMCwjLR3mYSpWEomewI9EHysPHb7WZmSzpT04GHD00EP5sTuUl'
);

export const bookTour = async (tourId) => {
  try {
    //1. get checkout session from API
    const session = await axios(
      `http:127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    //2. Create checkout from + change create card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
