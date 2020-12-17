const pool = require('../../database/conn/database');

module.exports = {

    async get_report_1 (req, res, next) {
        try {
            const result = await pool.query(`
            SELECT 
 	base.agr AS 'Agrupación',
 	base.promvtas AS 'Promedio de ventas',
 	base.lastmonth AS 'Mes Anterior',
 	base.alc AS 'Alcance',
 	vtassum.VtaTotal AS 'Ventas',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor'
				
FROM cliente_oic AS cli 

LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr, 
				(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
				(SELECT SUM(y.VTAS) FROM BASE_OIC2 AS y
     	 			WHERE 
						YEAR(y.FECHA) = YEAR(NOW() - INTERVAL 1 MONTH)
         			AND 
						MONTH(y.FECHA) = MONTH(NOW() - INTERVAL 1 MONTH)
         			AND
						y.U_Agrupacion = x.U_Agrupacion
      			GROUP BY 
						x.U_Agrupacion) AS lastmonth,
      		(SELECT SUM(z.VTAS) / (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) FROM BASE_OIC2 AS z
    				WHERE 
         			YEAR(z.FECHA) = YEAR(NOW() - INTERVAL 1 MONTH)
	         		AND 
		   			MONTH(z.FECHA) = MONTH(NOW() - INTERVAL 1 MONTH)
						AND
            		z.U_Agrupacion = x.U_Agrupacion
		   		GROUP BY 
         			x.U_Agrupacion) AS alc
            FROM 
	            BASE_OIC2 AS x
            WHERE 
	            x.FECHA >= date_sub(NOW(), interval 6 month)
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
            GROUP BY 
	            x.U_Agrupacion
			) AS base
	ON ( cli.RAZON_SOCIAL = base.agr )
	LEFT JOIN (
		SELECT 
			U_Agrupacion AS agr, 
			SUM(VTAS) AS VtaTotal
		FROM 
	      BASE_OIC2
	   GROUP BY 
			U_Agrupacion
		)  AS vtassum
	ON ( cli.RAZON_SOCIAL = vtassum.agr )
	LEFT JOIN (
		SELECT 
			VENDEDOR AS COD,
			NOMBRE
		FROM 
	      oic_vendedor
		)  AS vendedor
	ON ( cli.CODIGO_VENDEDOR = vendedor.COD )
	WHERE 
		base.agr IS NOT NULL
		AND
		base.lastmonth IS NOT NULL
	ORDER BY cli.CLIENTE
	;
            `)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_2 (req, res, next) {
        try {
            const date = req.body.date
            console.log(date)
            const query = `
            SELECT 
 	base.agr AS 'Agrupación',
 	((base.promvtas / hbl.days)*5) AS 'PROMEDIO VTA SEMANAL',
 	semana.sumvtas AS 'VENTA SEMANA 1',
 	( semana.sumvtas / ((base.promvtas / hbl.days)*5)) AS 'ALCANCE',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor',
 	vendedor.ACTIVO AS 'Vendedor Activo'
				
FROM cliente_oic AS cli 
LEFT JOIN 
	(SELECT hbl_days AS days, hbl_date, hbl_habiles_5 FROM habiles WHERE YEAR(hbl_date) = YEAR(CURRENT_DATE()) AND MONTH(hbl_date) = MONTH(STR_TO_DATE('${date}', '%d/%m/%Y')))
		AS hbl
	ON (YEAR(hbl.hbl_date) = YEAR(CURRENT_DATE()) AND MONTH(hbl.hbl_date) = MONTH(STR_TO_DATE('${date}', '%d/%m/%Y')))
LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr, 
      		(
					(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  )
					*1
					
				) AS promvtas
            FROM 
	            BASE_OIC2 AS x
	         
				
            WHERE 
	            x.FECHA >= date_sub(STR_TO_DATE('${date}', '%d/%m/%Y'), interval 6 month)
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
            GROUP BY 
	            x.U_Agrupacion
			) AS base
	ON ( cli.RAZON_SOCIAL = base.agr )
	
	LEFT JOIN (
		SELECT 
			 	x.U_Agrupacion AS agr,
				SUM(x.VTAS)  AS sumvtas

            FROM 
	            BASE_OIC2 AS x
	         LEFT JOIN 
					(SELECT hbl_days AS days, hbl_date, hbl_habiles_5 FROM habiles WHERE YEAR(hbl_date) = YEAR(CURRENT_DATE()) AND MONTH(hbl_date) = MONTH(STR_TO_DATE('${date}', '%d/%m/%Y')))
						AS hbl2
					ON (YEAR(hbl2.hbl_date) = YEAR(CURRENT_DATE()) AND MONTH(hbl2.hbl_date) = MONTH(STR_TO_DATE('${date}', '%d/%m/%Y')))
            WHERE 
            	(FECHA BETWEEN DATE_FORMAT(STR_TO_DATE('${date}', '%d/%m/%Y') ,'%Y-%m-01') AND hbl2.hbl_habiles_5)
	           	AND
               (x.VTAS > 0 OR x.VTAS < 0)
            GROUP BY 
	            x.U_Agrupacion
		) AS semana
	ON ( cli.RAZON_SOCIAL = semana.agr )
	
	LEFT JOIN (
		SELECT 
			VENDEDOR AS COD,
			NOMBRE,
			ACTIVO
		FROM 
	      oic_vendedor
		)  AS vendedor
	ON ( cli.CODIGO_VENDEDOR = vendedor.COD )
	WHERE 
		base.agr IS NOT NULL
		AND
		semana.sumvtas IS NOT NULL
	ORDER BY cli.CLIENTE
	;
            `
            console.log(query)
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_3 (req, res, next) {
        try {
            const result = await pool.query(`
            SELECT 
	cli.CLIENTE AS 'CODIGO CLIENTE',
 	base.agr AS 'Agrupación',
 	base.MARCA AS 'MARCA',
 	base.promvtas AS 'PROMEDIO VTAS',
 	base2.sumvtas AS 'VTAS DEL MES',
 	((base2.sumvtas/base.promvtas)*100) AS 'ALCANCE %',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor',
 	vendedor.ACTIVO AS 'Vendedor Activo'
				
FROM cliente_oic AS cli 
LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr,
			 	x.CLASIFICACION_3_DES AS MARCA,
			 	(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas
			FROM base_oic2 AS x
			WHERE 
	         x.FECHA >= date_sub(NOW(), interval 6 month)
	         AND
            (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         x.U_Agrupacion, x.CLASIFICACION_3_DES
			) AS base
	ON ( cli.RAZON_SOCIAL = base.agr )
LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr,
			 	SUM(x.VTAS) AS sumvtas
			FROM base_oic2 AS x
			WHERE 
				YEAR(x.FECHA) = YEAR(NOW()) 
				AND 
				MONTH(x.FECHA) = MONTH(NOW())
				AND
            (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         x.U_Agrupacion, x.CLASIFICACION_3_DES
			) AS base2
	ON ( cli.RAZON_SOCIAL = base2.agr )
	
	LEFT JOIN (
		SELECT 
			VENDEDOR AS COD,
			NOMBRE,
			ACTIVO
		FROM 
	      oic_vendedor
		)  AS vendedor
	ON ( cli.CODIGO_VENDEDOR = vendedor.COD )
	WHERE 
		base.agr IS NOT NULL
		AND
		base2.sumvtas IS NOT NULL
	ORDER BY cli.CLIENTE
	;
            `)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_4 (req, res, next) {
        try {
            const result = await pool.query(`
            SELECT 
 	base.agr AS 'Agrupación',
 	base.promvtas AS 'Promedio de ventas',
 	base.lastmonth AS 'Mes Anterior',
 	base.alc AS 'Alcance',
 	vtassum.VtaTotal AS 'Ventas',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor'
				
FROM cliente_oic AS cli 

LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr, 
				(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
				(SELECT SUM(y.VTAS) FROM BASE_OIC2 AS y
     	 			WHERE 
						YEAR(y.FECHA) = YEAR(NOW() - INTERVAL 1 MONTH)
         			AND 
						MONTH(y.FECHA) = MONTH(NOW() - INTERVAL 1 MONTH)
         			AND
						y.U_Agrupacion = x.U_Agrupacion
      			GROUP BY 
						x.U_Agrupacion) AS lastmonth,
      		(SELECT SUM(z.VTAS) / (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) FROM BASE_OIC2 AS z
    				WHERE 
         			YEAR(z.FECHA) = YEAR(NOW() - INTERVAL 1 MONTH)
	         		AND 
		   			MONTH(z.FECHA) = MONTH(NOW() - INTERVAL 1 MONTH)
						AND
            		z.U_Agrupacion = x.U_Agrupacion
		   		GROUP BY 
         			x.U_Agrupacion) AS alc
            FROM 
	            BASE_OIC2 AS x
            WHERE 
	            x.FECHA >= date_sub(NOW(), interval 6 month)
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
            GROUP BY 
	            x.U_Agrupacion
			) AS base
	ON ( cli.RAZON_SOCIAL = base.agr )
	LEFT JOIN (
		SELECT 
			U_Agrupacion AS agr, 
			SUM(VTAS) AS VtaTotal
		FROM 
	      BASE_OIC2
	   GROUP BY 
			U_Agrupacion
		)  AS vtassum
	ON ( cli.RAZON_SOCIAL = vtassum.agr )
	LEFT JOIN (
		SELECT 
			VENDEDOR AS COD,
			NOMBRE
		FROM 
	      oic_vendedor
		)  AS vendedor
	ON ( cli.CODIGO_VENDEDOR = vendedor.COD )
	WHERE 
		base.agr IS NOT NULL
		AND
		base.lastmonth IS NOT NULL
	ORDER BY cli.CLIENTE
	;
            `)
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
    }
};