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