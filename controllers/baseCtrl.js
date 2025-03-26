const utilities = require('../utilities/');
const baseCtrl = {};

baseCtrl.buildHOME = async function (req, res) {
    const nav = await utilities.getNav();
    // req.flash('notice', 'This is a flash message.');
    res.render('index', {title: 'Home', nav, errors: null, });
};

module.exports = baseCtrl;

