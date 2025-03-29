const utilities = require('./index');
const { body, validationResult } = require('express-validator');
const accountModel = require('../models/account-model');
const validate = {};


// signup data validation
validate.signUpRules = () => {
    return [
        body('account_firstname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage('Please provide a first name.'),
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2})
            .withMessage('Please provide a last name.'),
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailFound = await accountModel.checkForEmail(account_email);
                if (emailFound){
                    throw new Error('Email already in use, please login or choose a new email.')
                }
            }),
        body('account_password')
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ];
};

//check data and return errors or continue
validate.checkSignUp = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/signup', {
            errors,
            title: 'Sign-Up',
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return;
    }
    next();
};

// validation rules for login
validate.loginRules = () => {
    return [
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailFound = await accountModel.checkForEmail(account_email);
                console.log(emailFound)
                if (emailFound === 0){
                    throw new Error('Email not found please renter email or signup below')
                }
            }),
        body('account_password')
            .trim()
            .notEmpty()
    ]
}

// run validation for login
validate.checkLogin = async (req, res, next) => {
    const { account_email} = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/login', {
            errors,
            title: 'Login',
            nav,
            account_email,
        })
        return;
    }
    next();
};

module.exports = validate;