const User = require('../models/user');
const Passport = require('passport');


//Express validator
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');


exports.signUpGet = (req, res) => {
    res.render('sign_up', {title: 'User sign up'});
}

exports.signUpPost = [
    // validate data
    check('first_name').isLength({ min: 1}).withMessage('First name must be specified')
    .isAlphanumeric().withMessage('First name must be alphameric'),

    check('surname').isLength({ min: 1}).withMessage('Surname must be specified')
    .isAlphanumeric().withMessage('Surname must be alphameric'),

    check('email').isEmail().withMessage('Invalid email address'),

    check('confirm_email')
    .custom((value, { req }) => value === req.body.email)
    .withMessage('Email address do not match'),

    check('password').isLength( {min: 6})
    .withMessage('Invalid password, passwords must be a minimun of 6 characters'),

    check('confirm_password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Confirm password do not match'),

    sanitize('*').trim().escape(),

    (req, res, next) => {

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            // There are errors
            // console.log(errors.array());
            res.render('sign_up', {title: 'Please fix the following errors:', errors: errors.array()});
            // res.json(req.body);
            return;
        } else {
            // There are no errors
            console.log('signUpPost');
            console.log(next);

            const newUser = new User(req.body);
            User.register(newUser, req.body.password, function(err){
                if(err){
                    console.log('error while registering!', err);
                    return next(err);
                }
                next(); // Move onto loginPost after registering 
            });
        }
    }

]

exports.loginGet = (req, res) => {
    // console.log("loginGet");
    res.render('login', {title: 'Login to continue'});
}

exports.loginPost = Passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}
