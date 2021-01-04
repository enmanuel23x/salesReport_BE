const pool = require('../../database/conn/database');

module.exports = {

    async get_report_1 (req, res, next) {

        /* 
        Example JSON:
            {
            "ABC": "C",
            "SellerName": "MILKA CALDERON FERNANDEZ",
            "SellerActive": "S"
            }
        
        */
        try {
            const { ABC, SellerActive, SellerName } = req.body;
            let query = `SELECT * FROM report_1 WHERE MONTH(rpt1_date) = MONTH(NOW()) AND YEAR(rpt1_date) = YEAR(NOW())`
            if( ABC != undefined){
                query += ` AND rpt1_abc RLIKE "` + ABC + `"`;
            }
            if( SellerActive != undefined){
                query += ` AND rpt1_seller_active = "` + SellerActive + `"`;
            }
            if( SellerName != undefined){
                query += ` AND rpt1_seller RLIKE "` + SellerName + `"`;
            }
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_2 (req, res, next) {
        /* 
        Example JSON:
            {
            "SellerName": "CARLOS MORA CORRELLA",
            "SellerActive": "S",
            "Month": "12",
            "Year": "2020"
            }
        
        */
        try {
            const { SellerActive, SellerName, Month, Year } = req.body;
            let query = `select * from report_2`
            if(Month && Year){
                query += ` WHERE MONTH(rpt2_date) = "${Month}" AND YEAR(rpt2_date) = "${Year}"`
            }else{
                query += ` WHERE MONTH(rpt2_date) = MONTH(NOW()) AND YEAR(rpt2_date) = YEAR(NOW())`
            }
            if( SellerActive != undefined){
                query += ` AND rpt2_seller_active = "` + SellerActive + `"`;
            }
            if( SellerName != undefined){
                query += ` AND rpt2_seller RLIKE "` + SellerName + `"`;
            }
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async get_report_3 (req, res, next) {
        /* 
        Example JSON:
            {
            "SellerName": "CARLOS MORA CORRELLA",
            "SellerActive": "S"
            }
        
        */
       try {
            const { SellerActive, SellerName } = req.body;
            let query = `select * from report_3 WHERE MONTH(rpt3_date) = MONTH(NOW()) AND YEAR(rpt3_date) = YEAR(NOW())`
            if( SellerActive != undefined){
                query += ` AND rpt3_seller_active = "` + SellerActive + `"`;
            }
            if( SellerName != undefined){
                query += ` AND rpt3_seller RLIKE "` + SellerName + `"`;
            }
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_4 (req, res, next) {
         /* 
        Example JSON:
            {
            "SellerName": "JOSUE HIDALGO SOTO",
            "Brand" : "3M",
            "Class": "BASICO"
            }
        
        */
       try {
            const { SellerName, Brand, Class } = req.body;
            let query = `select * from report_4 WHERE MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) = YEAR(NOW())`
            if( SellerName != undefined){
                query += ` AND rpt4_seller RLIKE "` + SellerName + `"`;
            }
            if( Brand != undefined){
                query += ` AND rpt4_brand RLIKE "` + Brand + `"`;
            }
            if( Class != undefined){
                query += ` AND rpt4_class RLIKE "` + Class + `"`;
            }
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_5 (req, res, next) {
        try {
            const result = {}
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_sellers (req, res, next) {
        try {
            let query = `SELECT NOMBRE AS Seller FROM OIC_VENDEDOR`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_4_brand (req, res, next) {
        try {
            let query = `SELECT DISTINCT rpt4_brand from report_4 WHERE MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) = YEAR(NOW())`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_4_class (req, res, next) {
        try {
            let query = `SELECT DISTINCT rpt4_class from report_4 WHERE MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) = YEAR(NOW())`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    }
};