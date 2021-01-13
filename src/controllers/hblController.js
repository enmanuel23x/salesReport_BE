const pool = require('../../database/conn/database');

module.exports = {

    async get_current_hbl (req, res, next) {

        /* 
        Example JSON:
            {
            "ABC": "C",
            "SellerName": "MILKA CALDERON FERNANDEZ",
            "SellerActive": "S"
            }
        
        */
        try {
            const query = `SELECT *, DATE_FORMAT(hbl_habiles_5, '%Y-%m-%d') FROM habiles WHERE YEAR(hbl_date) = YEAR(NOW()) AND MONTH(hbl_date) = MONTH(NOW())`
            const result = await pool.query(query)
            
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async update_current_hbl (req, res, next) {

        /* 
        Example JSON:
            {
            "ABC": "C",
            "SellerName": "MILKA CALDERON FERNANDEZ",
            "SellerActive": "S"
            }
        
        */
        try {
            const { hbl_id, hbl_holidays, hbl_days, hbl_habiles_5 } = req.body;
            const query = 'UPDATE habiles SET ? WHERE hbl_id = ' + hbl_id
            const data = { 
                hbl_holidays, 
                hbl_days, 
                hbl_habiles_5: new Date(hbl_habiles_5).toISOString().slice(0, 19).replace('T', ' ')
            }
            
            const result = await pool.query(query, data)
            
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

};