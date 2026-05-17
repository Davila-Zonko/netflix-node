'use strict';

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/homeController');
const { requireAuth } = require('../middleware/auth');

router.get('/',            requireAuth, ctrl.index);
router.get('/search',      requireAuth, ctrl.search);
router.get('/my-list',     requireAuth, ctrl.myList);
router.post('/list/add',   requireAuth, ctrl.addToList);
router.post('/list/remove',requireAuth, ctrl.removeFromList);

module.exports = router;
