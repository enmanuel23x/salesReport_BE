const pool = require('../../database/conn/database');

module.exports = {

    async getAllUser (req, res, next) {
        try {
            const result = await pool.query('SELECT * FROM users')
            res.json(result.map( el => {
                return {
                    usrId: el.usr_id,
                    usrName: el.usr_name,
                    usrLastName: el.usr_last_name,
                    usrEmail: el.usr_email,
                    usrRol: el.usr_rol,
                    usrStatus: el.usr_status,
                    cliId: el.cli_id,
                    cliName: el.cli_name,
                    usrSellerCode:el.usr_seller_code,
                    usrIdSupervisor:el.usr_id_supervisor,
                    usrTeleventa: el.usr_televenta
                }
            }))
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async getAllUserFilterCollaborator (req, res, next) {
        try {
            const result = await pool.query('SELECT * FROM users where usr_rol != "4"')
            res.json(result.map( el => {
                return {
                    usrId: el.usr_id,
                    usrName: el.usr_name,
                    usrLastName: el.usr_last_name,
                    usrEmail: el.usr_email,
                    usrRol: el.usr_rol,
                    usrStatus: el.usr_status,
                    cliId: el.cli_id,
                    cliName: el.cli_name,
                    usrSellerCode:el.usr_code_seller,
                    usrIdSupervisor:el.usr_id_supervisor,
                    usrTeleventa: el.usr_televenta
                }
            }))
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async getUsersById(req, res, next) {
        try {
            const usr_id = req.params.id;
            const result = await pool.query('SELECT * FROM users WHERE usr_id = ' + usr_id);
            res.json({
                usrId: result[0].usr_id,
                usrName: result[0].usr_name,
                usrLastName: result[0].usr_last_name,
                usrEmail: result[0].usr_email,
                usrRol: result[0].usr_rol,
                usrStatus: result[0].usr_status,
                cliId: result[0].cli_id,
                cliName: result[0].cli_name,
                usrSellerCode:result[0].usr_seller_code,
                usrIdSupervisor:result[0].usr_id_supervisor,
                usrTeleventa: result[0].usr_televenta
            });
        } catch (error) {
            console.error(error);
            res.send("ERROR");
        }
    },
    async getUsersByIdSupervisor(req, res, next) {
        try {
            
            const usr_idSupervisor = req.params.idsupervisor;

            const result = await pool.query(`SELECT * FROM users WHERE usr_id_supervisor = '${usr_idSupervisor}'`);
            res.json(result.map( el => {
                return {
                    usrId: el.usr_id,
                    usrName: el.usr_name,
                    usrLastName: el.usr_last_name,
                    usrEmail: el.usr_email,
                    usrRol: el.usr_rol,
                    usrStatus: el.usr_status,
                    cliId: el.cli_id,
                    cliName: el.cli_name,
                    usrSellerCode:el.usr_code_seller,
                    usrIdSupervisor:el.usr_id_supervisor,
                    usrTeleventa: el.usr_televenta
                }
            }));
        } catch (error) {
            console.error(error);
            res.send("ERROR");
        }
    },
    async getUsersByEmail(req, res, next) {
        try {
            const usr_email = req.params.email;
            const query = `
                SELECT 
	                us.*, cli.cli_name AS cli_name 
                FROM 
	                users AS us 
                LEFT JOIN 
	                (SELECT * FROM clients) 
		            AS cli 
                ON 
                    (us.cli_id = cli.cli_id)
                WHERE 
	                usr_email = "${usr_email}" ;
            `
            const result = await pool.query(query);
            res.json(result.length == 0 ? {} : { 
                usrId: result[0].usr_id,
                usrName: result[0].usr_name,
                usrLastName: result[0].usr_last_name,
                usrEmail: result[0].usr_email,
                usrRol: result[0].usr_rol,
                usrStatus: result[0].usr_status,
                cliId: result[0].cli_id,
                cliName: result[0].cli_name,
                usrSellerCode: result[0].usr_code_seller,
                usrIdSupervisor:result[0].usr_id_supervisor,
                usrTeleventa: result[0].usr_televenta}
            );
        } catch (error) {
            console.error(error);
            res.send("ERROR");
        }
    },
    async getUserSellerByEmail (req, res, next) {
        try {
            const usr_email = req.params.email;

            let query = `SELECT A.VENDEDOR as sellerCode,
            usr_name,usr_last_name,A.U_SUPERVISOR,A.U_LOCALIDAD,usr_id,usr_email,usr_rol,usr_status,B.cli_id,C.cli_name
            FROM copyoic.OIC_VENDEDOR A
            left join copyoic.users B on B.usr_email= A.E_MAIL
            LEFT JOIN clients C on B.cli_id = C.cli_id
                        WHERE B.usr_email = '${usr_email}'`
            const result = await pool.query(query) 
            res.json({
                usrId: result[0].usr_id,
                usrName: result[0].usr_name,
                usrLastName: result[0].usr_last_name,
                usrEmail: result[0].usr_email,
                usrRol: result[0].usr_rol,
                usrStatus: result[0].usr_status,
                cliId: result[0].cli_id,
                cliName: result[0].cli_name,
                usrSellerCode: result[0].sellerCode,
                usrTeleventa: result[0].usr_televenta
            });

        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async addUsers(req, res, next) {
        try {
            const result = await pool.query('INSERT INTO users SET ?', 
                {
                usr_name: req.body.usrName,
                usr_last_name: req.body.usrLastName,
                usr_email: req.body.usrEmail,
                usr_rol: req.body.usrRol,
                usr_status: req.body.usrStatus,
                cli_id: req.body.cliId,
                usr_seller_code:req.body.usrSellerCode,
                usr_id_supervisor:req.body.usrIdSupervisor

                });
            res.json(result);
        } catch (error) {
            console.error(error);
            res.send("ERROR");
        }
        
        
    },

    async updateUsers(req,res,next) {
        try {
            const usr_id = req.params.id;
            let user = await pool.query('SELECT * FROM users WHERE usr_id = ' + usr_id);
            user = user.length == 0 ? { 
                usr_name: null, 
                usr_last_name: null, 
                usr_email: null, 
                usr_rol: null, 
                usr_status: null, 
                cli_id: null,
                usr_seller_code:null,
                usr_id_supervisor:null 
            } : user[0]
            const params = {
                usr_name: (req.body.usrName != null) ? req.body.usrName : user.usr_name,
                usr_last_name: (req.body.usrLastName != null) ? req.body.usrLastName : user.usr_last_name,
                usr_email: (req.body.usrEmail != null) ? req.body.usrEmail : user.usr_email,
                usr_rol: (req.body.usrRol != null) ? req.body.usrRol : user.usr_rol,
                usr_status: (req.body.usrStatus != null) ? req.body.usrStatus : user.usr_status,
                cli_id: (req.body.cliId != null) ? req.body.cliId : user.cli_id,
                usr_seller_code: (req.body.usrSellerCode != null) ? req.body.usrSellerCode : user.usr_seller_code,
                usr_id_supervisor: (req.body.usrIdSupervisor != null) ? req.body.usrIdSupervisor : user.usr_id_supervisor

                }
            const result = await pool.query(`UPDATE users SET 
                    ?
                WHERE 
                    ?`, 
            [ {...params}, {usr_id} ])

            res.json(result);
        } catch (error) {
            console.error(error);
            res.send("ERROR");
        }
    },

    async deleteUsers(req, res, next) {
        try {
            const usr_id = req.params.id;
            const result = await pool.query('DELETE FROM users WHERE usr_id = ' + usr_id);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.send("ERROR");
        }
    },



};