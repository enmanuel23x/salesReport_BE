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
                x.Fecha Between  DATEADD(m, DATEDIFF(m, 0, DATEADD(m, -6, GETDATE())), 0) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	        	x.CLIENTE, x.NOMBRE, x.ARTICULO, x.DESCRIPCION, x.CLASIFICACION_5_DES, x.CLASIFICACION_3_DES
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
				x.Fecha Between DATEADD(m, DATEDIFF(m, 0, DATEADD(m, 0, GETDATE())), 0) and DATEADD(m, DATEDIFF(m, 0, DATEADD(m, 1, GETDATE())), 0) 
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