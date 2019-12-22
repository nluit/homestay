var mysql = require('mysql');
var config = require('./config.json');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
        });
    }
    return db;
}
module.exports = connectDatabase();