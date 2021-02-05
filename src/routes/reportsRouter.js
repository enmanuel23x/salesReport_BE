const express = require('express');
const reportsRouter = express.Router();
const reportsController = require('../controllers/reportsController');

const uriReport_1 = '/report_1';
const uriReport_2 = '/report_2';
const uriReport_3 = '/report_3';
const uriReport_4 = '/report_4';
const uriReport_5 = '/report_5';
const uriSeller = '/seller';
const uriReport4Brand = '/report_4/brand';
const uriReport4Class = '/report_4/class';
const uriReport5Client = '/report_5/client';
const uriReport_3Top20Clients = '/report_3/top20clients';
const uriReport_4Top20Clients = '/report_4/top20clients';
const uriReport5Month = '/report_5/month';

reportsRouter.route(uriReport_1)
    .post(reportsController.get_report_1)

reportsRouter.route(uriReport_2)
    .post(reportsController.get_report_2)

reportsRouter.route(uriReport_3)
    .post(reportsController.get_report_3)

reportsRouter.route(uriReport_3Top20Clients)
    .post(reportsController.get_report_3_top20_clients)    

reportsRouter.route(uriReport_4)
    .post(reportsController.get_report_4)

reportsRouter.route(uriReport_5)
    .post(reportsController.get_report_5)
 
reportsRouter.route(uriReport_4Top20Clients)
    .post(reportsController.get_report_4_top20_clients) 

reportsRouter.route(uriSeller)
    .get(reportsController.get_sellers)

reportsRouter.route(uriReport4Brand)
    .get(reportsController.get_report_4_brand)

reportsRouter.route(uriReport4Class)
    .get(reportsController.get_report_4_class)

reportsRouter.route(uriReport5Client)
    .get(reportsController.get_report_5_client)

reportsRouter.route(uriReport5Month)
    .get(reportsController.get_report_5_month)

    


module.exports = reportsRouter;