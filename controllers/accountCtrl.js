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
            return res.redirect('/account'); 
        } else {
            req.flash('notice', 'Please check your credentials and try again.')
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

async function buildAccountUpdate(req, res) {
    let nav = await utilities.getNav()
    res.render('./account/account-update', {
        title: 'Update Account Information',
        nav,
        errors: null,
        account_firstname: null,
        account_email: null,
        account_lastname: null,
    })
}

async function logInfoUpdate(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_id} = req.body;

    const logResult = await accountModel.updateInfo(account_id, account_firstname, account_lastname, account_email)
    if (logResult) {
        req.flash(
            'notice', `Congrats, ${account_firstname}. You changed your information.`
        );

        res.status(201).render(`./account/account-update`, {
            title: 'Update Account Information',
            nav,
            errors: null,
            account_firstname: logResult.account_firstname,
            account_email: logResult.account_email,
            account_lastname: logResult.account_lastname,
        });

    } else {
        req.flash(
            'notice',
            'Sorry, information update has failed.'
        );
        res.status(501).render(`./account/account-update`, {
            title: 'Update Account Information',
            nav,
            errors: null,
            account_firstname,
            account_email,
            account_lastname,
        });
    }

}

async function logPassUpdate(req, res) {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body
    let hashedPass
    try {
        hashedPass = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash('notice', 'Sorry there was an error changing the password');
        res.status(500).render(`./account/account-update`, {
            title: 'Update Account Information',
            nav,
            errors: null,
            account_firstname: null,
            account_email: null,
            account_lastname: null,
        });
    }
    const logResult = await accountModel.updatePass(account_id, hashedPass)
    if (logResult) {
        req.flash(
            'notice', `Congrats, ${logResult.account_firstname}. You changed your password.`
        );

        res.status(201).render(`./account/account-update`, {
            title: 'Update Account Information',
            nav,
            errors: null,
            account_firstname: null,
            account_email: null,
            account_lastname: null,
        });

    } else {
        req.flash(
            'notice',
            'Sorry, password update has failed.'
        );
        res.status(501).render(`./account/account-update`, {
            title: 'Update Account Information',
            nav,
            errors: null,
            account_firstname: null,
            account_email: null,
            account_lastname: null,
        });
    }

}

async function accountLogout(req, res) {
    try {
        if (process.env.NODE_ENV === 'development') {
            res.clearCookie('jwt', {httpOnly: true, secure: false})
        } else {
            res.clearCookie('jwt', {httpOnly: true, secure: true})
        }
        return res.redirect('/'); 
    } catch (error) {
        req.flash('notice', 'An error occurred while logging out. Please try again.');
        throw new Error('Trouble logging out. Try again or close all browsers.');
    }
}

module.exports = { buildLogin, buildSignup, logSignup, accountLogin, buildAccountManagment, buildAccountUpdate, logInfoUpdate, logPassUpdate, accountLogout};