SELECT 
	cli.CLIENTE AS 'CODIGO CLIENTE',
 	base.agr AS 'Agrupación',
 	base.MARCA AS 'MARCA',
 	ROUND(base.promvtas,2) AS 'PROMEDIO VTAS',
 	ROUND(base2.sumvtas,2) AS 'VTAS DEL MES',
 	ROUND(((base2.sumvtas/ NULLIF(base.promvtas, 0) )*100),2) AS 'ALCANCE %',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor',
 	vendedor.ACTIVO AS 'Vendedor Activo',
 	NOW() AS 'Date'
				
FROM cliente_oic AS cli 
LEFT JOIN 
		(
	 		SELECT 
			 	x.CLIENTE as CLIENTE, 
			 	x.NOMBRE AS agr,
			 	x.CLASIFICACION_3_DES AS MARCA,
			 	(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas
			FROM 
				base_oic2 AS x
			WHERE 
            	(x.FECHA BETWEEN (last_day(NOW() - INTERVAL 7 month) + interval 1 DAY) AND last_day(NOW() - INTERVAL 1 month))
	         	AND
            	(x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         x.CLIENTE, x.NOMBRE, x.CLASIFICACION_3_DES
			) AS base
	ON ( cli.CLIENTE = base.CLIENTE )
LEFT JOIN 
		(
	 		SELECT
			 	x.CLIENTE as CLIENTE, 
			 	x.NOMBRE AS agr,
				x.CLASIFICACION_3_DES AS MARCA,
			 	SUM(x.VTAS) AS sumvtas
			FROM base_oic2 AS x
			WHERE 
				(YEAR(FECHA) = YEAR(NOW()) AND MONTH(FECHA) = MONTH(NOW()))
				AND
            	(x.VTAS > 0 OR x.VTAS < 0)
         	GROUP BY 
	        	x.CLIENTE, x.NOMBRE, x.CLASIFICACION_3_DES
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
    AND 
		ROUND(((base2.sumvtas/ NULLIF(base.promvtas, 0) )*100),2) <= 70
	ORDER BY cli.CLIENTE, base.MARCA
	;