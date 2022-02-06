var express = require('express');
var router = express.Router();
var mysql = require('mysql');
 var path = require('path');

var dbConn = require('../db/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.loggedin) {
        res.redirect('/home')
}else{
    res.render('admin/login');          
}
});

router.post('/check-user', function(req, res, next) {
       
    var email = req.body.email;
    var password = req.body.password;
 
        dbConn.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(err, rows, fields) {
            if(err) throw err
             
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Please correct enter email and Password!')
                res.redirect('/')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                req.session.loggedin = true;
                req.flash('success', 'Login Success')

                // req.session.name = name;
                res.redirect('/home');
 
            }            
        })
  
})

router.get('/home', function(req, res, next) {
     // res.render('home');
    if (req.session.loggedin) {
         
        res.render('home', {
            title:"Dashboard",
            // name: req.session.name,     
        });
 
    } else {
 
        req.flash('success', 'Please login first!');
        res.redirect('/');
    }
});
 
// Logout user
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  req.flash('success', 'Login Again Here');
  res.redirect('/');
});


router.get('/register', function(req, res, next) {
    res.render('admin/register');
});
router.post('/register', function(req, res, next) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let errors = false;

    if(name.length === 0 || email.length === 0 || password.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('register', {
            name: name,
            email: email,
            password: password
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            email: email,
            password: password
        }
        
        // insert query
        dbConn.query('INSERT INTO users SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('register', {
                    name: form_data.name,
                    email: form_data.email,                  
                    password: form_data.password                    
                })
            } else {                
                // req.flash('success', 'Book successfully added');
                res.redirect('/register-user');
            }
        })
    }
});
router.get('/register-user', function(req, res, next){
    dbConn.query('select * from users order by id desc', function(err, rows){
        if(err){
            req.flash('error',err);
            res.render('/',{data:''});
        }else{
            // console.log(rows);
            res.render('admin/register-user',{data:rows});
        }
    });
     
});
module.exports = router;