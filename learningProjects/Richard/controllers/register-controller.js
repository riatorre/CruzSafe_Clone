var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./../config');
 
module.exports.register=function(req,res){
    var today = new Date();
	var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "username":req.body.username,
        "password":encryptedString
    }
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
		if (error) {
			console.error(error);
			res.json({
				status:false,
				message:'there are some error with query'
			})
		}else{
			console.log("User <"+users.username+"> was successfully entered into the database");
			res.json({
				status:true,
				data:results,
				message:'user registered sucessfully'
			})
		}
    });
}