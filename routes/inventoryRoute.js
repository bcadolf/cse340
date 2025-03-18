// resources 
const express = require('express');
const router = new express.Router();
const invCtrl = require('../controllers/invCtrl');

router.get('/type/:classificationId', invCtrl.buildByClassificationId);

module.exports = router;