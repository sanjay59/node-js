const express = require("express");
const router = require('./router');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');
var flash = require('express-flash');
var session = require('express-session');
var expressValidator = require('express-validator');


const app = express();
app.use(bodyParser.json());
app.use(flash());
// app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(session({ 
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 


app.use('/',router);
app.listen(3000);
