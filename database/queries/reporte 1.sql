SELECT 
 	base.agr AS 'Agrupación',
 	base.promvtas AS 'Promedio de ventas',
 	base.lastmonth AS 'Mes Anterior',
 	base.alc AS 'Alcance',
 	vtassum.VtaTotal AS 'Ventas',
 	vendedor.COD AS 'Codigo Vendedor',
 	vendedor.NOMBRE AS 'Vendedor'
				
FROM cliente_oic AS cli 

LEFT JOIN 
		(
	 		SELECT 
			 	x.U_Agrupacion AS agr, 
				(SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) AS promvtas,
				(SELECT SUM(y.VTAS) FROM BASE_OIC2 AS y
     	 			WHERE 
						YEAR(y.FECHA) = YEAR(NOW() - INTERVAL 1 MONTH)
         			AND 
						MONTH(y.FECHA) = MONTH(NOW() - INTERVAL 1 MONTH)
         			AND
						y.U_Agrupacion = x.U_Agrupacion
      			GROUP BY 
						x.U_Agrupacion) AS lastmonth,
      		(SELECT SUM(z.VTAS) / (SUM(x.VTAS) / NULLIF(COUNT( DISTINCT( MONTH(x.FECHA) ) ), 0)  ) FROM BASE_OIC2 AS z
    				WHERE 
         			YEAR(z.FECHA) = YEAR(NOW() - INTERVAL 1 MONTH)
	         		AND 
		   			MONTH(z.FECHA) = MONTH(NOW() - INTERVAL 1 MONTH)
						AND
            		z.U_Agrupacion = x.U_Agrupacion
		   		GROUP BY 
         			x.U_Agrupacion) AS alc
            FROM 
	            BASE_OIC2 AS x
            WHERE 
	            x.FECHA >= date_sub(NOW(), interval 6 month)
	            AND
                (x.VTAS > 0 OR x.VTAS < 0)
            GROUP BY 
	            x.U_Agrupacion
			) AS base
	ON ( cli.RAZON_SOCIAL = base.agr )
	LEFT JOIN (
		SELECT 
			U_Agrupacion AS agr, 
			SUM(VTAS) AS VtaTotal
		FROM 
	      BASE_OIC2
	   GROUP BY 
			U_Agrupacion
		)  AS vtassum
	ON ( cli.RAZON_SOCIAL = vtassum.agr )
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