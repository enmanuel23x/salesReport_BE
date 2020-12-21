const pool = require('../../database/conn/database');

module.exports = {

    async get_report_1 (req, res, next) {
        try {
            const query = `select * from report_1`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_2 (req, res, next) {
        try {
            const query = `select * from report_2`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_3 (req, res, next) {
        try {
            const query = `select * from report_3`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_4 (req, res, next) {
        try {
            const query = `select * from report_4`
            const result = await pool.query(query)
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    },
    async get_report_5 (req, res, next) {
        try {
            const result = {}
            res.json(result)
        } catch (error) {
            console.error(error)
            res.send("ERROR")
        }
    }
};