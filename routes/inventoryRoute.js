// resources 
const express = require('express');
const router = new express.Router();
const invCtrl = require('../controllers/invCtrl');
const validate = require('../utilities/inventory-validation');
const utilities = require('../utilities/');
const invCont = require('../controllers/invCtrl');

router.get('/type/:classificationId', invCtrl.buildByClassificationId);

router.get('/detail/:invId', invCtrl.buildByInvId);

// manipulation of inv
router.get('/', utilities.verifyAuthAccess, invCtrl.buildInvManager);

router.get('/getInventory/:classification_id', utilities.verifyAuthAccess, utilities.handleErrors(invCtrl.getInvJSON));

// add new inv class
router.get('/add-class', utilities.verifyAuthAccess, invCtrl.buildAddClass);

router.post('/add-class', utilities.verifyAuthAccess, validate.addClassRules(), validate.checkAddClass, utilities.handleErrors(invCtrl.logAddClass));


// add new inv item
router.get('/add-inv', utilities.verifyAuthAccess, utilities.handleErrors(invCtrl.buildAddInv));

router.post('/add-inv', utilities.verifyAuthAccess, validate.addInvRules(), validate.checkAddInv, utilities.handleErrors(invCtrl.logAddInv));


// modify an inventory item
router.get('/edit/:inv_id', utilities.verifyAuthAccess, utilities.handleErrors(invCtrl.buildInvModify));

router.post('/edit/:inv_id', utilities.verifyAuthAccess, validate.addInvRules(), validate.checkEditInv, utilities.handleErrors(invCtrl.logEditInv))

// delete inv item
router.get('/delete/:inv_id', utilities.verifyAuthAccess, utilities.handleErrors(invCtrl.buildInvDelete))

router.post('/delete/:inv_id', utilities.verifyAuthAccess, utilities.handleErrors(invCtrl.deleteInv))

module.exports = router;