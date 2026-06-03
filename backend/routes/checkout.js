const express = require('express');
const router = express.Router();

// Requires STRIPE_SECRET in environment variables
const stripeSecret = process.env.STRIPE_SECRET;
if (!stripeSecret) {
  console.warn('STRIPE_SECRET not set — checkout will not work until configured');
}

let stripe;
try {
  stripe = require('stripe')(stripeSecret);
} catch (err) {
  // stripe may not be installed or secret not set; handle gracefully
}

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { item } = req.body;
    if (!item || !item.name || !item.price) return res.status(400).json({ error: 'Invalid item' });

    // Parse numeric price (assumes format like 'Rs.70')
    const priceMatch = String(item.price).match(/(\d+)/);
    const amount = priceMatch ? parseInt(priceMatch[1], 10) * 100 : 0;

    if (!stripe) {
      // Fallback: simulate a payment URL for local testing
      return res.json({ checkoutUrl: `/success.html?item=${encodeURIComponent(item.name)}` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: item.name },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success.html`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

module.exports = router;
