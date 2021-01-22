SELECT 
 	base.agr AS 'Agrupación',
 	ROUND(base.promvtas, 2) AS 'Promedio de ventas',
 	ROUND(base.lastmonth, 2) AS 'Mes Anterior',
 	ROUND(base.alc*100, 2) AS 'Alcance',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor'
				
FROM 
	cliente_oic AS cli 

LEFT JOIN 
		(
	 	SELECT
	        x.NOMBRE AS agr, 
	        (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
	        (SELECT SUM(y.VTAS) 
                FROM 
                    BASE_OIC2 AS y
                WHERE
					y.Fecha Between DATEADD(m, DATEDIFF(m, 0, DATEADD(m, -1, GETDATE())), 0) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)
         	        AND
			        y.NOMBRE = x.NOMBRE
      	        GROUP BY 
			        y.NOMBRE) AS lastmonth,
            (SELECT SUM(z.VTAS) / NULLIF((SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ),0) 
                FROM 
                    BASE_OIC2 AS z
    	        WHERE

                    z.Fecha Between DATEADD(m, DATEDIFF(m, 0, DATEADD(m, -1, GETDATE())), 0) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)
			        AND
                    z.NOMBRE = x.NOMBRE
		        GROUP BY 
         	        z.NOMBRE) AS alc
            FROM 
	            BASE_OIC2 AS x
            WHERE
                x.Fecha Between DATEADD(m, DATEDIFF(m, 0, DATEADD(m, -6, GETDATE())), 0) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
            GROUP BY 
                x.NOMBRE ) AS base
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
ORDER BY cli.RAZON_SOCIAL
;