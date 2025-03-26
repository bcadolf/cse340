const express = require('express');
const router = new express.Router();
const accountCtrl = require('../controllers/accountCtrl');
const utilities = require('../utilities/')
const signupValidator = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(accountCtrl.buildLogin));

router.get('/signup', utilities.handleErrors(accountCtrl.buildSignup));

router.post('/signup', signupValidator.signUpRules(), signupValidator.checkSignUp,
utilities.handleErrors(accountCtrl.logSignup));

module.exports = router;