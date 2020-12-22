SELECT 
 	base.agr AS 'Agrupación',
 	ROUND(base.promvtas, 2) AS 'Promedio de ventas',
 	ROUND(base.lastmonth, 2) AS 'Mes Anterior',
 	ROUND(base.alc, 2) AS 'Alcance',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor'
				
FROM cliente_oic AS cli 

LEFT JOIN 
		(
	 	SELECT 
	        x.U_Agrupacion AS agr, 
	        (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
	        (SELECT SUM(y.VTAS) 
                FROM 
                    BASE_OIC2 AS y
                WHERE
                    y.Fecha Between DATEADD(m, -1, GETDATE()) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)  
         	        AND
			        y.U_Agrupacion = x.U_Agrupacion
      	        GROUP BY 
			        y.U_Agrupacion) AS lastmonth,
            (SELECT SUM(z.VTAS) / (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) 
                FROM 
                    BASE_OIC2 AS z
    	        WHERE 
                    z.Fecha Between DATEADD(m, -1, GETDATE()) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) 
			        AND
                    z.U_Agrupacion = x.U_Agrupacion
		        GROUP BY 
         	        z.U_Agrupacion) AS alc
            FROM 
	            BASE_OIC2 AS x
            WHERE
                x.Fecha Between DATEADD(m, -6, GETDATE()) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
            GROUP BY 
                x.U_Agrupacion ) AS base
    ON ( cli.RAZON_SOCIAL = base.agr )
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