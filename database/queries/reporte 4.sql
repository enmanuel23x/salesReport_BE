SELECT 
	cli.CLIENTE AS 'CODIGO CLIENTE',
 	base.agr AS 'Agrupación',
 	base.ARTICULO AS 'ARTICULO',
 	base.DESCRIPCION AS 'DESCRIPCION',
	ROUND(base.promvtas,2) AS 'PROMEDIO VTAS',
	ROUND(base.promvtasu,2) AS 'PROMEDIO VTAS UNID',
	ROUND(base2.sumvtasu,2) AS 'VTAS MES ACTUAL UNID',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor',
	base.MARCA AS 'Marca',
	base.CLAS AS 'Clasificacion'
				
FROM cliente_oic AS cli 
LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr,
			 	x.ARTICULO AS ARTICULO,
			 	x.DESCRIPCION AS DESCRIPCION,
				x.CLASIFICACION_5_DES AS CLAS,
				x.CLASIFICACION_3_DES AS MARCA,
			 	(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
			 	(SUM(x.CANTIDAD) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtasu
			FROM base_oic2 AS x
			WHERE 
	         x.FECHA >= date_sub(NOW(), interval 6 month)
	         AND
            (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         x.U_Agrupacion, x.ARTICULO, x.DESCRIPCION, x.CLASIFICACION_5_DES, x.CLASIFICACION_3_DES
			) AS base
		ON ( cli.RAZON_SOCIAL = base.agr )
	LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr,
			 	SUM(x.CANTIDAD) AS sumvtasu
			FROM base_oic2 AS x
			WHERE 
				YEAR(x.FECHA) = YEAR(NOW()) 
				AND 
				MONTH(x.FECHA) = MONTH(NOW())
				AND
            (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         x.U_Agrupacion, x.ARTICULO
			) AS base2
	ON ( cli.RAZON_SOCIAL = base2.agr )
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
	ORDER BY cli.CLIENTE
	;