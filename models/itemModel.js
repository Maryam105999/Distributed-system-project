const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A item must have a name'],
      // unique: true,
      trim: true,
      maxlength: [40, 'A item name must have less or equal then 40 characters'],
      minlength: [10, 'A item name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'item name must only contain characters']
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A item must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A item must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A item must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    // secretItem: {
    //   type: Boolean,
    //   default: false
    // },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// itemSchema.index({ price: 1 });
itemSchema.index({ price: 1, ratingsAverage: -1 });
itemSchema.index({ slug: 1 });

// Virtual populate
itemSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'item',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
itemSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

itemSchema.pre(/^find/, function(next) {
  this.find({ secretItem: { $ne: true } });

  this.start = Date.now();
  next();
});

itemSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

itemSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
// itemSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretitem: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
