const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const Item = require('./../models/itemModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllItems = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Item.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const items = await features.query;

  // const items = await Item.find();
  res.status(200).json({
    status: 'success',
    results: items.length,
    data: {
      items
    }
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const newItem = await Item.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      item: newItem
    }
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    // The new updated document is the one that will be returned
    new: true,
    // Each time we update the document the validators that we specified in the schema will run again
    runValidators: true
  });

  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    return next(new AppError('No Item found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.search = catchAsync(async (req, res) => {
  const product = req.params.name;
  const regex = new RegExp(product, 'i');
  const result = await Item.find({ name: regex });
  res.status(200).json({
    status: 'success',
    data: {
      result
    }
  });
});
