import express from 'express';
const router = express.Router();
import controller from '../Controllers/Controllers.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super-secreto-no-hardcode-en-produccion';

// -------------- MIDDLEWARE DE AUTH --------------
function authenticate(req, res, next) {
  const token = req.cookies.auth_token; // ¡No necesitas cabecera Authorization!
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;   // { name, password }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
/*
router.get('/me',authenticate,controller.me);
router.post('/login',controller.login);
router.post('/register',controller.register);
router.get('/logout',controller.logout);
*/
router.post('/post',controller.funpost);
router.post('/books',controller.books);
router.post('/search',controller.search);
router.post('/id1',controller.id1);
router.post('/id2',controller.id2);
router.post('/nr_p',controller.nr_p);
router.post('/nr_u',controller.nr_u);
router.post('/nr_l',controller.nr_l);
router.delete('/delete',controller.delete);
router.post('/login',controller.login);
router.post('/logout',controller.logout);

export default router;
//module.exports = router;