const express = require('express');
const router = new express.Router();
const accountCtrl = require('../controllers/accountCtrl');
const utilities = require('../utilities/')
const validator = require('../utilities/account-validation');




// login page
router.get('/login', utilities.handleErrors(accountCtrl.buildLogin));

router.post('/login', validator.loginRules(), validator.checkLogin, accountCtrl.accountLogin);

// logout
router.get('/logout', utilities.handleErrors(accountCtrl.accountLogout));

// signup page
router.get('/signup', utilities.handleErrors(accountCtrl.buildSignup));

router.post('/signup', validator.signUpRules(), validator.checkSignUp,
utilities.handleErrors(accountCtrl.logSignup));

// account pages
router.get('/', utilities.checkLoginSuccess, accountCtrl.buildAccountManagment);

// change account info 
router.get('/update/:account_id', utilities.handleErrors(accountCtrl.buildAccountUpdate));

router.post('/update/info', validator.infoUpdateRules(), validator.checkInfoUpdate, utilities.handleErrors(accountCtrl.logInfoUpdate));

router.post('/update/pass', validator.passUpdateRules(), validator.checkPassUpdate, utilities.handleErrors(accountCtrl.logPassUpdate));

module.exports = router;