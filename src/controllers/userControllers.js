const pool = require('../../database/conn/database');

module.exports = {

    async getAllUser (req, res, next) {
        try {
            const result = await pool.query('SELECT * FROM users')
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },

    async getUsersById(req, res, next) {
        try {
            const usr_id = req.params.id;
            const result = await pool.query('SELECT * FROM users WHERE usr_id = ' + usr_id);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.send("ERROR");
        }
    },
    async getUsersByEmail(req, res, next) {
        try {
            const usr_email = req.params.email;
            const result = await pool.query('SELECT * FROM users WHERE usr_email = ' + usr_email);
            res.json(result);
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
            const params = {
                usr_name: req.body.usrName,
                usr_last_name: req.body.usrLastName,
                usr_email: req.body.usrEmail,
                usr_rol: req.body.usrRol,
                usr_status: req.body.usrStatus,
                cli_id: req.body.cliId
                }
            const result = await pool.query(`UPDATE users SET 
                    usr_name = ?, 
                    usr_last_name = ?, 
                    usr_email = ?, 
                    usr_rol = ?, 
                    usr_status = ?, 
                    cli_id = ? 
                WHERE 
                    usr_id = ?`, 
            [...params, usr_id])

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