const express = require('express');
const router = express.Router();
const controller = require('../Controllers/Controllers');
const db = require('../DataBase.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super-secreto-no-hardcode-en-produccion';

// -------------- MIDDLEWARE DE AUTH --------------
function authenticate(req, res, next) {
  const token = req.cookies.auth_token; // ¡No necesitas cabecera Authorization!
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;   // { name, password }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

router.get('/me',authenticate,controller.me);
router.post('/login',controller.login);
router.get('/logout',controller.logout);
router.post('/post',controller.funpost);
router.post('/pass',controller.funpass);

module.exports = router;