SELECT 
 	base.agr AS 'Agrupación',
 	ROUND(((base.promvtas / hbl.days)*5),2) AS 'PROMEDIO VTA SEMANAL',
 	ROUND(semana.sumvtas,2) AS 'VENTA SEMANA 1',
 	ROUND(( semana.sumvtas / ((base.promvtas / hbl.days)*5)),2) AS 'ALCANCE',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor',
 	vendedor.ACTIVO AS 'Vendedor Activo'
				
FROM cliente_oic AS cli 
LEFT JOIN 
	(SELECT hbl_days AS days, hbl_date, hbl_habiles_5 FROM habiles WHERE YEAR(hbl_date) = YEAR(CURRENT_DATE()) AND MONTH(hbl_date) = MONTH(NOW()))
		AS hbl
	ON (YEAR(hbl.hbl_date) = YEAR(CURRENT_DATE()) AND MONTH(hbl.hbl_date) = MONTH(NOW()))
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
	            x.FECHA >= date_sub(NOW(), interval 6 month)
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
					(SELECT hbl_days AS days, hbl_date, hbl_habiles_5 FROM habiles WHERE YEAR(hbl_date) = YEAR(CURRENT_DATE()) AND MONTH(hbl_date) = MONTH(NOW()))
						AS hbl2
					ON (YEAR(hbl2.hbl_date) = YEAR(CURRENT_DATE()) AND MONTH(hbl2.hbl_date) = MONTH(NOW()))
            WHERE 
            	(FECHA BETWEEN DATE_FORMAT(NOW() ,'%Y-%m-01') AND hbl2.hbl_habiles_5)
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