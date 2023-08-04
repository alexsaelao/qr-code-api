const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET QR Generate. */
router.get('/qrcode/png', indexController.png);
router.get('/qrcode/pngWithLogo', indexController.pngWithLogo);
router.get('/qrcode/svg', indexController.svg);
router.get('/qrcode/base64', indexController.base64);
router.get('/qrcode/base64WithLogo', indexController.base64WithLogo);
router.get('/qrcode/readEMV', indexController.readEMVQR);
router.get('/qrcode/personalQrEMV', indexController.personalQrEMVGenerate);
router.get('/qrcode/merchantQrEMV', indexController.merchantQrEMVGenerate);

module.exports = router;
