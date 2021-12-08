const express = require('express');
const itemController = require('./../controllers/itemController');

// Create a router for item routes
const router = express.Router();

router.route('/search/:name').get(itemController.search);

router
  .route('/')
  .get(itemController.getAllItems)
  .post(itemController.createItem);

router
  .route('/:id')
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;
