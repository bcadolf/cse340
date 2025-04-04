const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
require('dotenv').config();


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

// process login request
async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password} = req.body;
    const accountData = await accountModel.verifyEmail(account_email);
    if (!accountData) {
        req.flash('notice', 'Email not found please check for typos and try again, if new user please sign up below.');
        res.status(400).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})

            if (process.env.NODE_ENV === 'development') {
                res.cookie('jwt', accessToken, {httpOnly: true, secure: false, maxAge: 3600 * 1000})
            } else {
                res.cookie('jwt', accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            console.log('made it')
            return res.redirect('/account'); 
            console.log('This will never run!');
        } else {
            req.flash('message notice', 'Please check your credentials and try again.')
            res.status(400).render('account/login', {
                title: 'Login',
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('NO TOUCHY FOR YOU --- ACCESS DENIED')
    }
}

async function buildAccountManagment (req, res) {
    let nav = await utilities.getNav();
    res.render('./account/account-managment', {
        title: 'Account Manager',
        nav,
        errors: null,
    })
}


module.exports = { buildLogin, buildSignup, logSignup, accountLogin, buildAccountManagment };