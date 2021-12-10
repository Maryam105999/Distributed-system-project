const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Item = require('../models/itemModel');
const Purchase = require('../models/purchaseModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently purchased item
  const item = await Item.findById(req.params.itemId);
  console.log(item);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-items/?item=${
      req.params.itemId
    }&user=${req.user.id}&price=${item.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/item/${item.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.itemId,
    line_items: [
      {
        name: `${item.name} Item`,
        description: item.summary,
        images: [`https://www.natours.dev/img/tours/${item.imageCover}`],
        amount: item.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createPurchaseCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make purchase without paying
  const { item, user, price } = req.query;

  if (!item && !user && !price) return next();
  await Purchase.create({ item, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createPurchase = factory.createOne(Purchase);
exports.getPurchase = factory.getOne(Purchase);
exports.getAllPurchase = factory.getAll(Purchase);
exports.updatePurchase = factory.updateOne(Purchase);
exports.deletePurchase = factory.deleteOne(Purchase);
