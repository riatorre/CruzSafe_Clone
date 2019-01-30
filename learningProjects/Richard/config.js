var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'Compatibility_riatorre',
	password: 'SiD1475357',
	database: 'cruzsafe'
});

connection.connect(err => {
	if(err) throw err;
	console.log('Database Connection Established');
});

module.exports = connection;