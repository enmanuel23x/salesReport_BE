const pool = require('../../database/conn/database');

module.exports = {

    async get_report_1 (req, res, next) {
        try {
            const result = await pool.query(`
            SELECT 
	            x.U_Agrupacion AS 'Agrupación', 
	            (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS 'Promedio de ventas',
	            (SELECT SUM(y.VTAS) FROM BASE_OIC2 AS y
            		WHERE 
			            YEAR(y.FECHA) = YEAR(NOW() - INTERVAL 1 MONTH)
            			AND 
			            MONTH(y.FECHA) = MONTH(NOW() - INTERVAL 1 MONTH)
            			AND
			            y.U_Agrupacion = x.U_Agrupacion
            		GROUP BY 
			            x.U_Agrupacion) AS 'Mes Anterior',
            	(SELECT SUM(z.VTAS) / (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) FROM BASE_OIC2 AS z
    		        WHERE 
            			YEAR(z.FECHA) = YEAR(NOW() - INTERVAL 1 MONTH)
	            		AND 
		    	        MONTH(z.FECHA) = MONTH(NOW() - INTERVAL 1 MONTH)
			            AND
            			z.U_Agrupacion = x.U_Agrupacion
		            GROUP BY 
                        x.U_Agrupacion) AS 'Alcance'

            FROM 
	            BASE_OIC2 AS x
	
            WHERE 
	            x.FECHA >= date_sub(NOW(), interval 6 month)
	            AND
                (VTAS > 0 OR VTAS < 0)
            GROUP BY 
	            x.U_Agrupacion;
            `)
            res.json({result})
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_2 (req, res, next) {
        try {
            const result = {}
            res.json({result})
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_3 (req, res, next) {
        try {
            const result = {}
            res.json({result})
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_4 (req, res, next) {
        try {
            const result = {}
            res.json({result})
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_5 (req, res, next) {
        try {
            const result = {}
            res.json({result})
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    }
};