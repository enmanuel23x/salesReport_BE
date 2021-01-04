SELECT 
	cli.CLIENTE AS 'CODIGO CLIENTE',
 	base.agr AS 'Agrupación',
 	base.MARCA AS 'MARCA',
 	ROUND(base.promvtas,2) AS 'PROMEDIO VTAS',
 	ROUND(base2.sumvtas,2) AS 'VTAS DEL MES',
 	ROUND(((base2.sumvtas/ NULLIF(base.promvtas, 0) )*100),2) AS 'ALCANCE %',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor',
 	vendedor.ACTIVO AS 'Vendedor Activo'
				
FROM cliente_oic AS cli 
LEFT JOIN 
		(
	 		SELECT 
			 	x.CLIENTE as CLIENTE, 
			 	x.U_Agrupacion AS agr,
			 	x.CLASIFICACION_3_DES AS MARCA,
			 	(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas
			FROM base_oic2 AS x
			WHERE 
             x.Fecha Between  DATEADD(m, DATEDIFF(m, 0, DATEADD(m, -6, GETDATE())), 0) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)
	         AND
            (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         x.CLIENTE, x.U_Agrupacion, x.CLASIFICACION_3_DES
			) AS base
	ON ( cli.CLIENTE = base.CLIENTE )
LEFT JOIN 
		(
	 		SELECT
			 	x.CLIENTE as CLIENTE, 
			 	x.U_Agrupacion AS agr,
				x.CLASIFICACION_3_DES AS MARCA,
			 	SUM(x.VTAS) AS sumvtas
			FROM base_oic2 AS x
			WHERE 
				x.Fecha Between DATEADD(m, DATEDIFF(m, 0, DATEADD(m, 0, GETDATE())), 0) and DATEADD(m, DATEDIFF(m, 0, DATEADD(m, 1, GETDATE())), 0)
				AND
            (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         x.CLIENTE, x.U_Agrupacion, x.CLASIFICACION_3_DES
			) AS base2
	ON ( cli.CLIENTE = base2.CLIENTE AND base.MARCA = base2.MARCA )
	
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
	ORDER BY cli.CLIENTE
	;