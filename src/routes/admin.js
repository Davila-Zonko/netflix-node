'use strict';

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/',                    ctrl.dashboard);
router.get('/movies',              ctrl.movies);
router.get('/movies/create',       ctrl.createMovieForm);
router.post('/movies',             ctrl.upload, ctrl.storeMovie);
router.get('/movies/:id/edit',     ctrl.editMovieForm);
router.post('/movies/:id',         ctrl.upload, ctrl.updateMovie);
router.post('/movies/:id/delete',  ctrl.deleteMovie);
router.get('/users',               ctrl.users);
router.post('/users/:id/delete',   ctrl.deleteUser);

module.exports = router;
