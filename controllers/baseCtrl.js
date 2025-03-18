const utilities = require('../utilities/');
const baseCtrl = {};

baseCtrl.buildHOME = async function (req, res) {
    const nav = await utilities.getNav();
    res.render('index', {title: 'Home', nav});
};

module.exports = baseCtrl;

