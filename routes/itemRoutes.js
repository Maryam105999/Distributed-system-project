const express = require('express');
const itemController = require('../controllers/itemController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:itemId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(itemController.aliasTopItems, itemController.getAllItems);

router.route('/item-stats').get(itemController.getItemStats);

router
  .route('/')
  .get(itemController.getAllItems)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    itemController.createItem
  );

router
  .route('/:id')
  .get(itemController.getItem)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    itemController.uploadItemImages,
    itemController.resizeItemImages,
    itemController.updateItem
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    itemController.deleteItem
  );

module.exports = router;
