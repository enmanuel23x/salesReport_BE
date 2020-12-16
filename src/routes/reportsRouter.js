const express = require('express');
const reportsRouter = express.Router();
const reportsController = require('../controllers/reportsController');

const uriReport_1 = '/report_1';

reportsRouter.route(uriReport_1)
    .get(reportsController.get_report_1)

module.exports = reportsRouter;