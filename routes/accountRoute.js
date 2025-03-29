const express = require('express');
const router = new express.Router();
const accountCtrl = require('../controllers/accountCtrl');
const utilities = require('../utilities/')
const validator = require('../utilities/account-validation')

// login page
router.get('/login', utilities.handleErrors(accountCtrl.buildLogin));

router.post('/login', validator.loginRules(), validator.checkLogin, (req, res) => {
    utilities.handleErrors(res.status(200).send('login process'));
});


// signup page
router.get('/signup', utilities.handleErrors(accountCtrl.buildSignup));

router.post('/signup', validator.signUpRules(), validator.checkSignUp,
utilities.handleErrors(accountCtrl.logSignup));

module.exports = router;