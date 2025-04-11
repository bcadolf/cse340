const express = require('express');
const router = new express.Router();
const quoteCtrl = require('../controllers/quoteCtrl');
const { handleErrors, verifyAuthAccess } = require('../utilities');
const validate = require('../utilities/quote-validation');


router.get('/request', handleErrors(quoteCtrl.buildQuoteReq));

router.post('/request', validate.quoteRules() ,validate.checkNewQuote, handleErrors(quoteCtrl.logNewQuote));

router.get('/manage', verifyAuthAccess, handleErrors(quoteCtrl.buildManageQuote));

router.get('/process/:quote_id', verifyAuthAccess, handleErrors(quoteCtrl.buildProcessQuote));

router.post('/process/:quote_id', verifyAuthAccess, handleErrors(quoteCtrl.logProcessQuote))

router.post('/response/:quote_id', handleErrors(quoteCtrl.buildQuoteResponse))

router.post('/update', validate.quoteRules(), validate.checkChangeQuote, handleErrors(quoteCtrl.logQuoteChange));



module.exports = router;