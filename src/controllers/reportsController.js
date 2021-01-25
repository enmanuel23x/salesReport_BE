const { query } = require('../../database/conn/database');
const pool = require('../../database/conn/database');

module.exports = {

    async get_report_1 (req, res, next) {
     
        try {
            
            const { ABC, SellerActive, SellerName, Rol, SellerCode,UsrId } = req.body;
            let data='';

            let terms ='';
            let query = ''
            dataresp=[]
            
            if( SellerActive != undefined){
                terms += ` AND rpt1_seller_active = "` + SellerActive + `"`;
            } 
            if( ABC != undefined){
                terms += ` AND rpt1_abc RLIKE "` + ABC + `"`;
            }
            if (Rol == '3'){              //rol de vendedor
                terms += ` AND rpt1_seller_code = "` + SellerCode + `"`;
            }
            if (Rol == '2'){              //rol de supervisor
                    
                if( SellerName != undefined){
                    terms += ` AND rpt1_seller RLIKE "` + SellerName + `"`;

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
                        terms += ` AND rpt1_seller_code in ` + data + ``;
                    }else{
                        res.json([])
                    }     
                }                
            }

            if (Rol == '1'){              //rol de administrador
                
                if( SellerName != undefined){
                    terms += ` AND rpt1_seller RLIKE "` + SellerName + `"`;  
                  }else{
                      const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_rol = '3'`)                    
                      if(vendors.length !== 0){
                          data += `(`
                          vendors.forEach(element => { 
                              if(element.usr_code_seller !== null && element.usr_code_seller !== '' && element.usr_code_seller !== undefined){
                                  data += `'${element.usr_code_seller}',`
                              }
                               
                          })
                          data = data.slice(0, -1);
                          data += `)`                
                          terms += ` AND rpt1_seller_code in ` + data + ``;
                      }else{
                          res.json([])
                      }     
                  }   
            }

            query = `SELECT
            DISTINCT rpt1_group,
            ROUND(CAST(rpt1_avg_sales AS DECIMAL(10,2))) as rpt1_avg_sales,
            ROUND(CAST(rpt1_last_month AS DECIMAL(10,2))) as rpt1_last_month,
            CAST(rpt1_scope AS DECIMAL(10,2)) as rpt1_scope,
            rpt1_abc,
            rpt1_seller_code,
            rpt1_seller,
            rpt1_seller_active,
            rpt1_date
            FROM report_1 WHERE MONTH(rpt1_date) = MONTH(NOW()) AND YEAR(rpt1_date) = YEAR(NOW()) ${terms} 
            order by ROUND(CAST(rpt1_avg_sales AS DECIMAL(10,2))) desc`

            const result = await pool.query(query)            
            res.json(result)            
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_2 (req, res, next) {

        try {

            const {Month, ABC, SellerActive, SellerName, Rol, SellerCode,UsrId } = req.body;
            let data='';

            let terms ='';
            let query = ''
            dataresp=[]
            
            if(Month && Year){
                terms += ` WHERE MONTH(rpt2_date) = "${Month}" AND YEAR(rpt2_date) = "${Year}"`
            }else{
                terms += ` WHERE MONTH(rpt2_date) = MONTH(NOW()) AND YEAR(rpt2_date) = YEAR(NOW())`
            }
            if( SellerActive != undefined){
                terms += ` AND rpt2_seller_active = "` + SellerActive + `"`;
            }
            if (Rol == '3'){              //rol de vendedor
                terms += ` AND rpt2_seller_code = "` + SellerCode + `"`;
            }
            if (Rol == '2'){              //rol de supervisor
                    
                if( SellerName != undefined){
                    terms += ` AND rpt2_seller RLIKE "` + SellerName + `"`;

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
                        terms += ` AND rpt2_seller_code in ` + data + ``;
                    }else{
                        res.json([])
                    }     
                }                
            }

            if (Rol == '1'){              //rol de administrador
                
                if( SellerName != undefined){
                    terms += ` AND rpt2_seller RLIKE "` + SellerName + `"`;
  
                  }else{
                      const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_rol = '3'`)                    
                      if(vendors.length !== 0){
                          data += `(`
                          vendors.forEach(element => { 
                              if(element.usr_code_seller !== null && element.usr_code_seller !== '' && element.usr_code_seller !== undefined){
                                  data += `'${element.usr_code_seller}',`
                              }
                               
                          })
                          data = data.slice(0, -1);
                          data += `)`                
                          terms += ` AND rpt2_seller_code in ` + data + ``;
                      }else{
                          res.json([])
                      }     
                  }   
            }

            query = `SELECT 
            DISTINCT rpt2_group,
            ROUND(CAST(rpt2_avg_sales_weekly AS DECIMAL(10,2))) as rpt2_avg_sales_weekly,
            ROUND(CAST(rpt2_first_week AS DECIMAL(10,2))) as rpt2_first_week,
            CAST(rpt2_scope AS DECIMAL(10,2)) as rpt2_scope,
            rpt2_seller, rpt2_seller_code,
            rpt2_seller_active,  rpt2_date
             FROM copyoic.report_2 ${terms} order by ROUND(CAST(rpt2_avg_sales_weekly AS DECIMAL(10,2))) desc`           

            const result = await pool.query(query)
            res.json(result)            
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async get_report_3_top20_clients (req, res, next) {

        try {

            let query = `SELECT rpt3_client_code, rpt3_group,
            sum(CONVERT(SUBSTRING_INDEX(rpt3_avg_sales,'-',-1),UNSIGNED INTEGER)) AS num  
                        FROM copyoic.report_3 
                        WHERE MONTH(rpt3_date) = MONTH(NOW()) AND YEAR(rpt3_date) = YEAR(NOW())
                        group by rpt3_client_code
                        order by sum(CONVERT(SUBSTRING_INDEX(rpt3_avg_sales,'-',-1),UNSIGNED INTEGER)) desc limit 20`
            
                                   

            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async get_report_3 (req, res, next) {

       try {

            const { Class, Brand, SellerName, Rol, SellerCode,UsrId, Clients } = req.body;
            let inClients='';
            let data='';
            let terms ='';
            let query = ''
            dataresp=[]
            
            if( Class != undefined){
                terms += ` AND rpt3_class = "` + Class + `"`;
            }
            if( Brand != undefined){
                terms += ` AND rpt3_brand = "` + Brand + `"`;
            }
            if (Rol == '3'){              //rol de vendedor
                terms += ` AND rpt3_seller_code = "` + SellerCode + `"`;
            }
            if (Rol == '2'){              //rol de supervisor
                    
                if( SellerName != undefined){
                    terms += ` AND rpt3_seller RLIKE "` + SellerName + `"`;

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
                        terms += ` AND rpt3_seller_code in ` + data + ``;
                    }else{
                        res.json([])
                    }     
                }                
            }

            if (Rol == '1'){              //rol de administrador
                
                if( SellerName != undefined){
                    terms += ` AND rpt3_seller RLIKE "` + SellerName + `"`;
  
                  }else{
                      const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_rol = '3'`)                    
                      if(vendors.length !== 0){
                          data += `(`
                          vendors.forEach(element => { 
                              if(element.usr_code_seller !== null && element.usr_code_seller !== '' && element.usr_code_seller !== undefined){
                                  data += `'${element.usr_code_seller}',`
                              }
                               
                          })
                          data = data.slice(0, -1);
                          data += `)`                
                          terms += ` AND rpt3_seller_code in ` + data + ``;
                      }else{
                          res.json([])
                      }     
                  }   
            }

            if(Clients.length !== 0){
                for (let index = 0; index < Clients.length; index++) {

                    query = `SELECT 
                        b.count_scope_perc,
                        b.sum_avg_sales,
                        b.prom_scope_perc,
                        b.sum_month_sales,
                        rpt3_client_code, REPLACE(rpt3_group, '"','') as rpt3_group,   
                        CAST(rpt3_avg_sales AS DECIMAL(10,2)) as rpt3_avg_sales, rpt3_scope_perc,rpt3_month_sales, rpt3_seller_code, 
                        rpt3_seller, rpt3_brand, rpt3_date
                        FROM copyoic.report_3 a 
                        inner join (SELECT 
                        count(*) as count_scope_perc,
                        rpt3_client_code as rpt3_client_code_b,
                        sum(rpt3_avg_sales) as sum_avg_sales,
                        sum(rpt3_scope_perc) as prom_scope_perc,
                        sum(rpt3_month_sales) as sum_month_sales
                        FROM (SELECT rpt3_client_code,    
                        ROUND(CAST(rpt3_avg_sales AS DECIMAL(10,2))) as rpt3_avg_sales, 
                        ROUND(CAST(rpt3_scope_perc AS DECIMAL(10,2))) as rpt3_scope_perc,
                        ROUND(CAST(rpt3_month_sales AS DECIMAL(10,2))) as rpt3_month_sales
                        FROM copyoic.report_3 a where 
                        MONTH(rpt3_date) = MONTH(NOW()) AND YEAR(rpt3_date) 
                        ${terms} 
                        and rpt3_client_code = '${Clients[index].rpt3_client_code}'
                        order by CAST(rpt3_avg_sales AS DECIMAL(10,2)) desc limit 10) as report_3) b
                        on a.rpt3_client_code = b.rpt3_client_code_b 
                        where 
                        MONTH(rpt3_date) = MONTH(NOW()) AND YEAR(rpt3_date)
                        ${terms} 
                        and rpt3_client_code = '${Clients[index].rpt3_client_code}'
                        order by CAST(rpt3_avg_sales AS DECIMAL(10,2)) desc limit 10 `
                        
                     const Result = await pool.query(query)
                    if(Result.length !== 0){
                        for (let index1 = 0; index1 < Result.length; index1++) {
                            dataresp.push(Result[index1])
                         }
                    }    
                }
                
                res.json(dataresp)
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
            group by rpt4_client_code
            order by sum(CONVERT(SUBSTRING_INDEX(rpt4_avg_sales,'-',-1),UNSIGNED INTEGER)) desc limit 20`

            
            const result = await pool.query(query)
            
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async get_report_4 (req, res, next) {

       try {
            const { Class, Brand, SellerName, Rol, SellerCode,UsrId, Clients } = req.body;
            let data='';
            let terms ='';
            dataresp=[]
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
                    terms += ` AND rpt4_seller RLIKE "` + SellerName + `"`;

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

            if (Rol == '1'){              //rol de vendedor
                
                if( SellerName != undefined){
                    terms += ` AND rpt4_seller RLIKE "` + SellerName + `"`;
  
                  }else{
                      const vendors = await pool.query(`SELECT usr_code_seller FROM copyoic.users where usr_rol = '3'`)                    
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
                for (let index = 0; index < Clients.length; index++) {

                    query = `SELECT 
                        b.count_avg_sales,
                        b.sum_avg_sales,
                        b.sum_avg_sales_units,
                        b.sum_month_sales_units,
                        rpt4_client_code, REPLACE(rpt4_group, '"','') as rpt4_group,  
                        rpt4_article, REPLACE(rpt4_description, '"','') as rpt4_description, 
                        CAST(rpt4_avg_sales AS DECIMAL(10,2)) as rpt4_avg_sales, rpt4_avg_sales_units,rpt4_month_sales_units, rpt4_seller_code, 
                        rpt4_seller, rpt4_class, rpt4_brand, rpt4_date
                        FROM copyoic.report_4 a 
                        inner join (SELECT 
                        count(*) as count_avg_sales,
                        rpt4_client_code as rpt4_client_code_b,
                        sum(rpt4_avg_sales) as sum_avg_sales,
                        sum(rpt4_avg_sales_units) as sum_avg_sales_units,
                        sum(rpt4_month_sales_units) as sum_month_sales_units
                        FROM (SELECT rpt4_client_code,    
                        ROUND(CAST(rpt4_avg_sales AS DECIMAL(10,2))) as rpt4_avg_sales, 
                        ROUND(CAST(rpt4_avg_sales_units AS DECIMAL(10,2))) as rpt4_avg_sales_units,
                        ROUND(CAST(rpt4_month_sales_units AS DECIMAL(10,2))) as rpt4_month_sales_units
                        FROM copyoic.report_4 a where 
                        MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date) 
                        ${terms} 
                        and rpt4_client_code = '${Clients[index].rpt4_client_code}'
                        order by CAST(rpt4_avg_sales AS DECIMAL(10,2)) desc limit 15) as report_4) b
                        on a.rpt4_client_code = b.rpt4_client_code_b 
                        where 
                        MONTH(rpt4_date) = MONTH(NOW()) AND YEAR(rpt4_date)
                        ${terms} 
                        and rpt4_client_code = '${Clients[index].rpt4_client_code}'
                        order by CAST(rpt4_avg_sales AS DECIMAL(10,2)) desc limit 15 `

                     const Result = await pool.query(query)
                    if(Result.length !== 0){
                        for (let index1 = 0; index1 < Result.length; index1++) {
                            dataresp.push(Result[index1])
                         }
                    }    
                }
                res.json(dataresp)
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
            let query = `
            SELECT 
	            NOMBRE AS Seller,
	            VENDEDOR AS SellerCode,
	            Usr.usr_id_supervisor AS usr_id_supervisor 
                FROM oic_vendedor AS Vendedores 
            LEFT JOIN 
	            (SELECT * FROM users) AS Usr 
            ON ( Vendedores.VENDEDOR = Usr.usr_code_seller) 
            `
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