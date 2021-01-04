const express = require('express');
const reportsRouter = express.Router();
const reportsController = require('../controllers/reportsController');

const uriReport_1 = '/report_1';
const uriReport_2 = '/report_2';
const uriReport_3 = '/report_3';
const uriReport_4 = '/report_4';
const uriSeller = '/seller';
const uriReport4Brand = '/report_4/brand';
const uriReport4Class = '/report_4/class';

reportsRouter.route(uriReport_1)
    .post(reportsController.get_report_1)

reportsRouter.route(uriReport_2)
    .post(reportsController.get_report_2)

reportsRouter.route(uriReport_3)
    .post(reportsController.get_report_3)

reportsRouter.route(uriReport_4)
    .post(reportsController.get_report_4)

reportsRouter.route(uriSeller)
    .get(reportsController.get_sellers)

reportsRouter.route(uriReport4Brand)
    .get(reportsController.get_report_4_brand)

reportsRouter.route(uriReport4Class)
    .get(reportsController.get_report_4_class)

module.exports = reportsRouter;