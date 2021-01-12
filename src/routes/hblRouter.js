const express = require('express');
const hblRouter = express.Router();
const hblController = require('../controllers/hblController');

const uriHBL = '/hbl';

hblRouter.route(uriHBL)
    .get(hblController.get_current_hbl)
    .put(hblController.update_current_hbl)

module.exports = hblRouter;