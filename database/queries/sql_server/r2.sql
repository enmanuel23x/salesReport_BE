SELECT 
 	base.agr AS 'Agrupación',
 	ROUND(((base.promvtas / 20)*5),2) AS 'PROMEDIO VTA SEMANAL',
 	ROUND(semana.sumvtas,2) AS 'VENTA SEMANA 1',
 	ROUND(( semana.sumvtas / NULLIF(((base.promvtas / 20)*5) , 0) ),2) AS 'ALCANCE',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor',
 	vendedor.ACTIVO AS 'Vendedor Activo'
				
FROM cliente_oic AS cli 
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
                x.Fecha Between DATEADD(m, -6, GETDATE()) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) 
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
            WHERE
                Fecha Between DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) and convert(datetime, '2020-12-08 00:00:00.00', 121)
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