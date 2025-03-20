// resources 
const express = require('express');
const router = new express.Router();
const invCtrl = require('../controllers/invCtrl');

router.get('/type/:classificationId', invCtrl.buildByClassificationId);

router.get('/detail/:invId', invCtrl.buildByInvId);

module.exports = router;