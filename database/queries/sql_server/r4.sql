SELECT 
	cli.CLIENTE AS 'CODIGO CLIENTE',
 	base.agr AS 'Agrupación',
 	base.ARTICULO AS 'ARTICULO',
 	base.DESCRIPCION AS 'DESCRIPCION',
	ROUND(base.promvtas,2) AS 'PROMEDIO VTAS',
	ROUND(base.promvtasu,2) AS 'PROMEDIO VTAS UNID',
	ROUND(base2.sumvtasu,2) AS 'VTAS MES ACTUAL UNID',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor'
				
FROM cliente_oic AS cli 
LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr,
			 	x.ARTICULO AS ARTICULO,
			 	x.DESCRIPCION AS DESCRIPCION,
			 	(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
			 	(SUM(x.CANTIDAD) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtasu
			FROM base_oic2 AS x
			WHERE
                x.Fecha Between DATEADD(m, -6, GETDATE()) and DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) 
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
         GROUP BY 
	         x.U_Agrupacion, x.ARTICULO, x.DESCRIPCION
			) AS base
		ON ( cli.RAZON_SOCIAL = base.agr )
	LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr,
			 	SUM(x.CANTIDAD) AS sumvtasu
			FROM base_oic2 AS x
			WHERE 
				YEAR(x.FECHA) = YEAR(GETDATE()) 
				AND 
				MONTH(x.FECHA) = MONTH(GETDATE())
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