const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.post('/createWallet', walletController.createWallet);
router.post('/transferFunds', walletController.transferFunds);

module.exports = router;
