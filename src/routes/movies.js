'use strict';

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/movieController');
const { requireAuth } = require('../middleware/auth');

router.get('/browse',    requireAuth, ctrl.browse);
router.get('/:id',       requireAuth, ctrl.show);
router.get('/:id/watch', requireAuth, ctrl.watch);

module.exports = router;
