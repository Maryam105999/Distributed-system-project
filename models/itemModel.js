const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An item must have a name'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'An item must have a type']
  },
  gender: {
    type: String,
    //required: [true, 'An item must have a gender type'], //if it's type is clothes
    trim: true,
    enum: {
      values: ['women', 'men']
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'An item must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price should be below regular price'
    }
  },
  description: {
    type: String,
    //   trim: true,
    required: [true, 'An item must have a description']
  },
  imageCover: {
    type: String
    //   required: [true, 'An item must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
