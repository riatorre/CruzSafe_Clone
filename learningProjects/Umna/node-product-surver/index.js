const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELET_ALL_PRODUCT_QUERY = 'SELECT * FROM Student';

const connection = mysql.createConnection({
	host:'localhost',
	user: 'root',
	password: 'password',
	database:'cmps116test'
});


connection.connect(err => {
	if(err){
		console.log("Could not connect to the database 'cmps116test'. " +
			"Make sure you have your mysql database running locally with a 'Student' table. " + 
			"This table should have first_name, last_name, city, student_id fields.", err)
		return err;
	}
})

//console.log(connection);

app.use(cors()); 

app.get('/', (req,res) => {
	res.send('go to /student to see Student')
});



app.get('/student/add', (req, res) => {
	const {first_name, last_name, city, student_id} = req.query;
	const INSERT_PRODUCTS_QUERY = `INSERT INTO student (first_name,last_name,city,student_id) VALUES('${first_name}','${last_name}','${city}',${student_id})`;
	connection.query(INSERT_PRODUCTS_QUERY, (err, results) => {
		if(err){
			return res.send("Could not connect to the database 'cmps116test'. " +
			"Make sure you have your mysql database running locally with a 'Student' table. " + 
			"This table should have first_name, last_name, city, student_id fields.", err)
		}
		else {
			res.send('successfully added student')
		}
	});
});



// app.get('/student/add', (req, res) => {
// 	const {first_name, last_name, city, student_id} = req.query;
// 	console.log(first_name,last_name,city,student_id);
// 	res.send('adding students');
// });


/// Add data through localhost 
// app.get('/student/add', (req, res) => {
// 	const {first_name, last_name, city, student_id} = req.query;
// 	const INSERT_PRODUCTS_QUERY = `INSERT INTO student (first_name,last_name,city,student_id) VALUES('${first_name}', '${last_name}', $'{city}', ${student_id})`
// 	connection.query(INSERT_PRODUCTS_QUERY,(err, results) => {
// 		if(err){
// 			return res.send(err)
// 		}
// 		else {
// 			return res.send('successfully added the prodcuts')
// 		}
// 	});
// });










app.get('/student', (req,res) => {
	console.log(`inside students `)
	connection.query(SELET_ALL_PRODUCT_QUERY, (err,results) => {
		if(err){
			console.log(`if inside students `)
			return res.send(err)

		}

		else {
			console.log(`else inside students `)
			return res.json({
				data: results
			})
		}
	});
});

app.listen(4600, () => {
	console.log(`Products server Listening on port 4600 \n`)
}); 


