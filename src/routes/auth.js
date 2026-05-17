'use strict';

const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/authController');
const { requireGuest } = require('../middleware/auth');

router.get('/login',    requireGuest, ctrl.showLogin);
router.post('/login',   requireGuest, ctrl.login);
router.get('/register', requireGuest, ctrl.showRegister);
router.post('/register',requireGuest, ctrl.register);
router.post('/logout',  ctrl.logout);

module.exports = router;
