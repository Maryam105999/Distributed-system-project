const Item = require('../models/itemModel');
const User = require('../models/userModel');
const Purchase = require('../models/purchaseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get item data from collection
  const tours = await Item.find();
  console.log(tours);
  // const tours = items;
  // 2) Build template
  // 3) Render that template using item data from 1)
  res.status(200).render('overview', {
    title: 'All Items',
    tours
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested item (including reviews and guides)
  const item = await Item.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!item) {
    return next(new AppError('There is no item with that name.', 404));
  }
  const tour = item;
  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('item', {
    title: `${item.name} item`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyItems = catchAsync(async (req, res, next) => {
  // 1) Find all purchases
  const purchases = await Purchase.find({ user: req.user.id });

  // 2) Find items with the returned IDs
  const itemIDs = purchases.map(el => el.item);
  const tours = await Item.find({ _id: { $in: itemIDs } });

  res.status(200).render('overview', {
    title: 'My Items',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
