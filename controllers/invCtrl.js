const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');
const invCont = {};

// build inv by classification view
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render('./inventory/classification', {
        title: `${className} vehicles`,
        nav,
        grid,
    });
}

// build details by inv id
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId;
    const data = await invModel.getDetailByInvId(inv_id);
    const display = await utilities.buildByInvId(data);
    let nav = await utilities.getNav();
    // const carName = `${data[0].inv_make}`; possible title
    res.render('./inventory/vehicle-details',{
        title: 'Drive Home Today!',
        nav,
        display,
    });
}

module.exports = invCont;