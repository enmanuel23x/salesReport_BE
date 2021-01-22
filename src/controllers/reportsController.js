const pool = require('../../database/conn/database');

module.exports = {

    async get_report_1 (req, res, next) {
        /* 
        Example JSON:
            {
            "ABC": "C",
            "SellerName": "MILKA CALDERON FERNANDEZ",
            "SellerActive": "S"
            }
        
        */       
        try {
            
            const { ABC, SellerActive, SellerName, Rol, SellerCode,UsrId } = req.body;
            let data='';

            let query = `SELECT * FROM report_1 WHERE MONTH(rpt1_date) = MONTH(NOW()) AND YEAR(rpt1_date) = YEAR(NOW())`
            if( ABC != undefined){
                query += ` AND rpt1_abc RLIKE "` + ABC + `"`;
            }
            if( SellerActive != undefined){
                query += ` AND rpt1_seller_active = "` + SellerActive + `"`;
            }            
            if (Rol == '3'){              //rol de vendedor
                query += ` AND rpt1_seller_code = "` + SellerCode + `"`;
            }
            if (Rol == '2'){              //rol de supervisor
                if( SellerName != undefined){
                    query += ` AND rpt1_seller RLIKE "` + SellerName + `"`;
                }else{
                    const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_id_supervisor = '${UsrId}'`)
                    if(vendors.length !== 0){
                        data += `(`
                        vendors.forEach(element => { data += `'${element.usr_code_seller}',` })
                        data = data.slice(0, -1);
                        data += `)`                
                        query += ` AND rpt1_seller_code in ` + data + ``;                        
                    }else{
                        res.json([])
                    } 
                }                
            }
            const result = await pool.query(query)            
            res.json(result)            
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_2 (req, res, next) {
        /* 
        Example JSON:
            {
            "SellerName": "CARLOS MORA CORRELLA",
            "SellerActive": "S",
            "Month": "12",
            "Year": "2020"
            }
        
        */
        try {
            const { SellerActive, SellerName, Month, Year, Rol, SellerCode,UsrId } = req.body;
            let data='';
            let query = `select * from report_2`
            if(Month && Year){
                query += ` WHERE MONTH(rpt2_date) = "${Month}" AND YEAR(rpt2_date) = "${Year}"`
            }else{
                query += ` WHERE MONTH(rpt2_date) = MONTH(NOW()) AND YEAR(rpt2_date) = YEAR(NOW())`
            }
            if( SellerActive != undefined){
                query += ` AND rpt2_seller_active = "` + SellerActive + `"`;
            }
            if (Rol == '3'){              //rol de vendedor
                query += ` AND rpt2_seller_code = "` + SellerCode + `"`;
            }
            if (Rol == '2'){              //rol de supervisor
                
                if( SellerName != undefined){
                    query += ` AND rpt2_seller RLIKE "` + SellerName + `"`;
                }else{
                    const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_id_supervisor = '${UsrId}'`)
                    
                    if(vendors.length !== 0){
                        data += `(`
                        vendors.forEach(element => { data += `'${element.usr_code_seller}',` })
                        data = data.slice(0, -1);
                        data += `)`                
                        query += ` AND rpt2_seller_code in ` + data + ``;
                    }else{
                        res.json([])
                    }     
                }                
            }
            const result = await pool.query(query)
            res.json(result)            
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async get_report_3_top20_clients (req, res, next) {

        try {
            const { SellerActive, SellerName,Rol, SellerCode,UsrId } = req.body;
            let data='';
            let query = `SELECT distinct rpt3_client_code, rpt3_group FROM report_3 WHERE MONTH(rpt3_date) = MONTH(NOW()) AND YEAR(rpt3_date) = YEAR(NOW())`
            if( SellerActive != undefined){
                query += ` AND rpt3_seller_active = "` + SellerActive + `"`;
            }
            if( SellerName != undefined){
                query += ` AND rpt3_seller RLIKE "` + SellerName + `"`;
            }
            if (Rol == '3'){              //rol de vendedor
                query += ` AND rpt3_seller_code = "` + SellerCode + `"`;
            }
            if (Rol == '2'){              //rol de supervisor
                
                if( SellerName != undefined){
                    query += ` AND rpt3_seller RLIKE "` + SellerName + `"`;
                }else{
                    const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_id_supervisor = '${UsrId}'`)
                    
                    if(vendors.length !== 0){
                        data += `(`
                        vendors.forEach(element => { data += `'${element.usr_code_seller}',` })
                        data = data.slice(0, -1);
                        data += `)`                
                        query += ` AND rpt3_seller_code in ` + data + ``;
                    }else{
                        res.json([])
                    }     
                }                
            }
            query += `order by rpt3_group asc limit 20`;

            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async get_report_3 (req, res, next) {
        /* 
        Example JSON:
            {
            "SellerName": "CARLOS MORA CORRELLA",
            "SellerActive": "S"
            }
        
        */  
       try {
            const { SellerActive, SellerName, Clients, Rol, SellerCode,UsrId } = req.body;
            let inClients='';
            let data='';
            if(Clients.length !== 0){
                Clients.forEach(element => {  inClients += `'${element.rpt3_client_code}',` })
                inClients = inClients.slice(0, -1);
                let query = `SELECT *, 
                (select sum(CAST(rpt3_avg_sales AS DECIMAL(10,2))) from copyoic.report_3 where rpt3_client_code = a.rpt3_client_code) as sum_avg_sales, 
                (select sum(CAST(rpt3_month_sales AS DECIMAL(10,2))) from copyoic.report_3 where rpt3_client_code = a.rpt3_client_code) as sum_month_sales,
                (select sum(CAST(rpt3_scope_perc AS DECIMAL(10,2))) from copyoic.report_3 where rpt3_client_code = a.rpt3_client_code) as sum_scope_perc,
                (select (sum(CAST(rpt3_scope_perc AS DECIMAL(10,2)))/(select count(rpt3_scope_perc) from copyoic.report_3 where rpt3_client_code = a.rpt3_client_code)) as a from copyoic.report_3 where rpt3_client_code = a.rpt3_client_code) as prom_scope_perc,
                (select count(rpt3_scope_perc) from copyoic.report_3 where rpt3_client_code = a.rpt3_client_code) as count_scope_perc FROM copyoic.report_3 as a WHERE MONTH(rpt3_date) = MONTH(NOW()) AND YEAR(rpt3_date) = YEAR(NOW())`
                //let query = `select * from report_3 WHERE MONTH(rpt3_date) = MONTH(NOW()) AND YEAR(rpt3_date) = YEAR(NOW())`
                if( SellerActive != undefined){
                    query += ` AND rpt3_seller_active = "` + SellerActive + `"`;
                }
                if( SellerName != undefined){
                    query += ` AND rpt3_seller RLIKE "` + SellerName + `"`;
                }
                if (Rol == '3'){              //rol de vendedor
                    query += ` AND rpt3_seller_code = "` + SellerCode + `"`;
                }
                if (Rol == '2'){              //rol de supervisor
                    
                    if( SellerName != undefined){
                        query += ` AND rpt3_seller RLIKE "` + SellerName + `"`;
                    }else{
                        const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_id_supervisor = '${UsrId}'`)
                        
                        if(vendors.length !== 0){
                            data += `(`
                            vendors.forEach(element => { data += `'${element.usr_code_seller}',` })
                            data = data.slice(0, -1);
                            data += `)`                
                            query += ` AND rpt3_seller_code in ` + data + ``;
                        }else{
                            res.json([])
                        }     
                    }                
                }
                query += `AND rpt3_client_code IN (${inClients}) order by rpt3_group asc`;
                

                const result = await pool.query(query)
                res.json(result)
            }else{
                res.json([])
            }
           
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async get_report_4_top20_clients (req, res, next) {

        try { 
            
            let query = `SELECT rpt4_client_code, rpt4_group,sum(CONVERT(SUBSTRING_INDEX(rpt4_avg_sales,'-',-1),UNSIGNED INTEGER)) AS num  
            FROM copyoic.report_4 
            WHERE MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) = YEAR(NOW())
            group by rpt4_client_code asc
            order by sum(CONVERT(SUBSTRING_INDEX(rpt4_avg_sales,'-',-1),UNSIGNED INTEGER)) desc limit 20`

            
            const result = await pool.query(query)
            
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async get_report_4 (req, res, next) {
        /* 
        Example JSON:
            {
            "SellerName": "CARLOS MORA CORRELLA",
            "SellerActive": "S"
            }
        
        */  
       try {
            const { Class, Brand, SellerName, Rol, SellerCode,UsrId, Clients } = req.body;
            //console.log('SellerName:::', SellerName)
            let inClients='';
            let data='';
            let terms ='';
            if( Class != undefined){
                terms += ` AND rpt4_class = "` + Class + `"`;
            }
            if( Brand != undefined){
                terms += ` AND rpt4_brand = "` + Brand + `"`;
            }
            if (Rol == '3'){              //rol de vendedor
                terms += ` AND rpt4_seller_code = "` + SellerCode + `"`;
            }
            if (Rol == '2'){              //rol de supervisor
                    
                if( SellerName != undefined){
                    //console.log('entro', SellerName)
                  let seller_code =  SellerName.split('|')
                  //console.log('seller_code::', seller_code)
                  data += `(`
                  seller_code.forEach(element => { 
                      if(element !== null && element !== '' && element !== undefined){
                          data += `'${element}',`
                      }
                       
                  })
                  data = data.slice(0, -1);
                  data += `)`
                  terms += ` AND rpt4_seller_code in ` + data + ``;
                  //console.log('result::', terms)
                    //terms += ` AND rpt4_seller RLIKE "` + SellerName + `"`;
                }else{
                    const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_id_supervisor = '${UsrId}'`)                    
                    if(vendors.length !== 0){
                        data += `(`
                        vendors.forEach(element => { 
                            if(element.usr_code_seller !== null && element.usr_code_seller !== '' && element.usr_code_seller !== undefined){
                                data += `'${element.usr_code_seller}',`
                            }
                             
                        })
                        data = data.slice(0, -1);
                        data += `)`                
                        terms += ` AND rpt4_seller_code in ` + data + ``;
                    }else{
                        res.json([])
                    }     
                }                
            }

            
            if(Clients.length !== 0){
                Clients.forEach(element => {  inClients += `'${element.rpt4_client_code}',` })
                inClients = inClients.slice(0, -1);
                terms += ` AND rpt4_client_code IN (${inClients})`;

                let query = `SELECT rpt4_client_code, REPLACE(rpt4_group, '"','') as rpt4_group,  rpt4_article, REPLACE(rpt4_description, '"','') as rpt4_description, rpt4_avg_sales, rpt4_avg_sales_units,rpt4_month_sales_units, rpt4_seller_code, rpt4_seller, rpt4_class, rpt4_brand, rpt4_date,
                (select sum(CAST(rpt4_avg_sales AS DECIMAL(10,2))) from copyoic.report_4 where rpt4_client_code = a.rpt4_client_code and MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) ${terms}  ) as sum_avg_sales, 
                round((select sum(rpt4_avg_sales_units) from copyoic.report_4 where rpt4_client_code = a.rpt4_client_code  and MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) ${terms})) as sum_avg_sales_units,
                round((select sum(rpt4_month_sales_units) from copyoic.report_4 where rpt4_client_code = a.rpt4_client_code  and MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) ${terms})) as sum_month_sales_units,
                (select count(rpt4_avg_sales) from copyoic.report_4 where rpt4_client_code = a.rpt4_client_code  and MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) ${terms}) as count_avg_sales,
				(select sum(CAST(rpt4_avg_sales AS DECIMAL(10,2))) from copyoic.report_4 where MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) ${terms}) as grandtotal_avg_sales, 
                round((select sum(rpt4_avg_sales_units) from copyoic.report_4 where MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) ${terms} )) as grandtotal_avg_sales_units,
                (select sum(CONVERT(SUBSTRING_INDEX(rpt4_month_sales_units,'-',-1),UNSIGNED INTEGER)) from copyoic.report_4 where MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) ${terms}) as grandtotal_month_sales_units
                FROM copyoic.report_4 as a WHERE MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) = YEAR(NOW()) ${terms}`
                query += ` order by rpt4_group asc`;
                console.log('______________________________________')
                console.log('este es el query report 4', query)
                console.log('**************************************')
                const result = await pool.query(query)
                res.json(result)
            }else{
                res.json([])
            }
           
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_5 (req, res, next) {
        try {
            let data='';
            const result = {}
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_sellers (req, res, next) {
        try {
            let query = `SELECT NOMBRE AS Seller FROM OIC_VENDEDOR`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
   
    async get_report_4_brand (req, res, next) {
        try {
            let query = `SELECT DISTINCT rpt4_brand from report_4 WHERE MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) = YEAR(NOW())`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_4_class (req, res, next) {
        try {
            let query = `SELECT DISTINCT rpt4_class from report_4 WHERE MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) = YEAR(NOW())`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    }
};