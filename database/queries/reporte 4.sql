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
 	base.CLAS AS 'Clasificacion',
	base.MARCA AS 'Marca',
 	NOW() AS 'Date'
	
				
FROM cliente_oic AS cli 
LEFT JOIN 
		(
	 		SELECT
			 	x.CLIENTE as CLIENTE, 
			 	x.NOMBRE AS agr,
			 	x.ARTICULO AS ARTICULO,
			 	x.DESCRIPCION AS DESCRIPCION,
				x.CLASIFICACION_5_DES AS CLAS,
				x.CLASIFICACION_3_DES AS MARCA,
			 	(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
			 	(SUM(x.CANTIDAD) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtasu
			FROM base_oic2 AS x
			WHERE
                (x.FECHA BETWEEN (last_day(NOW() - INTERVAL 7 month) + interval 1 DAY) AND last_day(NOW() - INTERVAL 1 month))
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
				AND 
				(x.CLASIFICACION_5_DES = 'DOBLE BASICO' OR x.CLASIFICACION_5_DES = 'TRIPLE BASICO')
         GROUP BY 
	        	x.CLIENTE, x.NOMBRE, x.ARTICULO, x.DESCRIPCION, x.CLASIFICACION_5_DES, x.CLASIFICACION_3_DES
		ORDER BY 
			agr, promvtas DESC
			) AS base
		ON ( cli.CLIENTE = base.CLIENTE )
	LEFT JOIN 
		(
	 		SELECT
			 	x.CLIENTE as CLIENTE, 
			 	x.NOMBRE AS agr,
			 	SUM(x.CANTIDAD) AS sumvtasu,
				x.ARTICULO AS ARTICULO
			FROM base_oic2 AS x
			WHERE
				(YEAR(FECHA) = YEAR(NOW()) AND MONTH(FECHA) = MONTH(NOW()))
				AND
                (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         	x.CLIENTE, x.NOMBRE, x.ARTICULO
			) AS base2
	ON ( cli.CLIENTE = base2.CLIENTE AND base.ARTICULO = base2.ARTICULO)
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
