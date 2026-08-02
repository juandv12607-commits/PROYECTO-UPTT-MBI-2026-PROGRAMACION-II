const express = require('express');
const router = express.Router();
const controller = require('../Controllers/Controllers');
const db = require('../DataBase.js');

router.post('/post',controller.funpost);
router.post('/pass',controller.funpass);

module.exports = router;