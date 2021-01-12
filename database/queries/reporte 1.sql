SELECT 
 	base.agr AS 'Agrupación',
 	ROUND(base.promvtas, 2) AS 'Promedio de ventas',
 	ROUND(base.lastmonth, 2) AS 'Mes Anterior',
 	ROUND(base.alc*100, 2) AS 'Alcance',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor',
 	vendedor.ACTIVO AS 'Vendedor Activo',
 	NOW() AS 'Date'
				
FROM 
	cliente_oic AS cli 
LEFT JOIN 
		(
	 	SELECT
	        x.U_Agrupacion AS agr, 
	        (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
	        (SELECT SUM(y.VTAS) 
                FROM 
                    BASE_OIC2 AS y
                WHERE
					(y.FECHA BETWEEN (last_day(curdate() - INTERVAL 2 month) + interval 1 DAY) AND last_day(curdate() - INTERVAL 1 month))
         	        AND
			        y.U_Agrupacion = x.U_Agrupacion
      	        GROUP BY 
			        y.U_Agrupacion) AS lastmonth,
            (SELECT SUM(z.VTAS) / NULLIF((SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ),0) 
                FROM 
                    BASE_OIC2 AS z
    	        WHERE

                    (z.FECHA BETWEEN (last_day(curdate() - INTERVAL 2 month) + interval 1 DAY) AND last_day(curdate() - INTERVAL 1 month))
			        AND
                    z.U_Agrupacion = x.U_Agrupacion
		        GROUP BY 
         	        z.U_Agrupacion) AS alc
            FROM 
	            BASE_OIC2 AS x
            WHERE
                (x.FECHA BETWEEN (last_day(curdate() - INTERVAL 7 month) + interval 1 DAY) AND last_day(curdate() - INTERVAL 1 month))
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
				AND
				x.U_Agrupacion IS NOT NULL
            GROUP BY 
                x.U_Agrupacion, x.CLIENTE ) AS base
    ON ( cli.RAZON_SOCIAL = base.agr )
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
ORDER BY cli.RAZON_SOCIAL
;