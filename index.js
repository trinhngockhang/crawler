var express = require("express");
var everyLimit = require ('async/everyLimit');
var async = require('async');
var app = express();
app.set("view engine","ejs");
app.set("vỉews","./views");
const bodyParser = require('body-parser');
app.use(bodyParser.json({ extend: true }));
app.use(bodyParser.urlencoded({ extend: true }));
const mongoose= require('mongoose');
const cheerio = require('cheerio');
var request = require('request');
var linkShop = "";
var request = require('request');
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("vỉews","./views");
var productController = require('./sendoApi/productController');

// var order = [];
// var array = [1, 5, 3, 4, 2,6,3];
// var iterator = function(num, done) {
// 	setTimeout(function() {
// 		order.push(num);
// 		console.log("num " + num);
// 		done(null,num);
// 	}, num * 100);
// };
// async.each(array,  iterator, function(err, res) {
// 	console.log(res); // false
// 	console.log(order); 
// });
app.get("/", (req,res) => {
	res.render('trangchu');
})

app.get("/sendo", (req,res) => {
	res.render('sendo');
})

app.get("/resultSendo", (req,res) => {
	productController.doneAll(linkShop);
	res.send("hihi");
})

app.get("/resultSendo", (req,res) => {
	productController.doneAll(linkShop);
	res.send("hihi");
})

app.post("/senUrl",(req,res) =>{
	linkShop = req.body.linkShop;
	res.redirect("/resultSendo");
})

app.listen(3000,() => {
	console.log("server start ");
});

mongoose.connect("mongodb://localhost/sendo", (err) => {
	if (err) {
	  console.log(err);
	} else {
	  console.log('Connect DB success !');
	}
  })