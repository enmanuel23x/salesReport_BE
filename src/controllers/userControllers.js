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
                    cliName: el.cli_name
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
                cliName: result[0].cli_name
            });
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
            res.json({
                usrId: result[0].usr_id,
                usrName: result[0].usr_name,
                usrLastName: result[0].usr_last_name,
                usrEmail: result[0].usr_email,
                usrRol: result[0].usr_rol,
                usrStatus: result[0].usr_status,
                cliId: result[0].cli_id,
                cliName: result[0].cli_name
            });
        } catch (error) {
            console.error(error);
            res.send("ERROR");
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
                cli_id: req.body.cliId
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
                cli_id: null 
            } : user[0]
            const params = {
                usr_name: (req.body.usrName != null) ? req.body.usrName : user.usr_name,
                usr_last_name: (req.body.usrLastName != null) ? req.body.usrLastName : user.usr_last_name,
                usr_email: (req.body.usrEmail != null) ? req.body.usrEmail : user.usr_email,
                usr_rol: (req.body.usrRol != null) ? req.body.usrRol : user.usr_rol,
                usr_status: (req.body.usrStatus != null) ? req.body.usrStatus : user.usr_status,
                cli_id: (req.body.cliId != null) ? req.body.cliId : user.cli_id
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