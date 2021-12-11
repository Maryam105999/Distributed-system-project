const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/item/:slug', authController.isLoggedIn, viewsController.getItem);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/my-items',
  purchaseController.createPurchaseCheckout,
  authController.protect,
  viewsController.getMyItems
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
