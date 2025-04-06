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
router.get('/', invCtrl.buildInvManager);

router.get('/add-class', invCtrl.buildAddClass);

router.post('/add-class', validate.addClassRules(), validate.checkAddClass, utilities.handleErrors(invCtrl.logAddClass));

router.get('/add-inv', invCtrl.buildAddInv);

router.post('/add-inv', validate.addInvRules(), validate.checkAddInv, utilities.handleErrors(invCtrl.logAddInv));

router.get('/getInventory/:classification_id', utilities.handleErrors(invCtrl.getInvJSON));

// modify an inventory item
router.get('/edit/:inv_id', utilities.handleErrors(invCtrl.buildInvModify));

router.post('/edit/:inv_id', utilities.handleErrors(invCtrl.logEditInv))

module.exports = router;