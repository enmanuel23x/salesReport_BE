//NPM requires
const mysql = require('mysql');
const { promisify } = require('util');

//Project's own requires
const database  = {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE,
    connectionLimit: process.env.DB_CONNECTIONLIMIT,
    acquireTimeout: process.env.DB_ACQUIRETIMEOUT,
    multipleStatements: process.env.DB_MULTIPLESTATMENTS,
}
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if(err === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DB is connected');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;