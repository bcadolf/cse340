const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');


// login view retrival
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render('account/login', {
        title: 'Login',
        nav,
        errors: null,
    });
};
// account signup view
async function buildSignup(req, res, next) {
    let nav = await utilities.getNav();
    res.render('account/signup', {
        title: 'Sign-Up',
        nav,
        errors: null,
    });
};
// create new account
async function logSignup(req, res) {
    let nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email, account_password} = req.body;
    let hashedPass;
    try {
            hashedPass = await bcrypt.hashSync(account_password, 10);
        } catch (error) {
            req.flash('notice', 'Sorry there was an error signing up');
            res.status(500).render('account/signup', {
                title: 'Sign-Up',
                nav,
                errors: null,
            });
        }
        
    const logResult = await accountModel.logSignup(
        account_firstname, 
        account_lastname, 
        account_email, 
        hashedPass
    );

    if (logResult) {
        req.flash(
            'notice', `Congrats, you are registered ${account_firstname}. Please log in.`
        );

        res.status(201).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
        });

    } else {
        req.flash(
            'notice',
            'Sorry, registration has failed.'
        );
        res.status(501).render('account/signup', {
            title: 'Sign-Up',
            nav,
        });
    }
};


module.exports = { buildLogin, buildSignup, logSignup };