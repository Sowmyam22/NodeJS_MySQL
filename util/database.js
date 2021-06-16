//Connecting to the MySQL Database using mysql2 package

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Dhruvareddy@123'
// });

// module.exports = pool.promise();


// Connecting to MySQL Database using Sequelize

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'node-complete', 'root', 'Dhruvareddy@123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;