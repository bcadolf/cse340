const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');
const invCont = {};

// build inv by classification view
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId;
        // code to throw 500 error
        if (classification_id === '99') {
        throw new Error('Intentional 500 Error: Simulating an issue in buildByClassificationId');
        }
        const data = await invModel.getInventoryByClassificationId(classification_id);
        const grid = await utilities.buildClassificationGrid(data);
        let nav = await utilities.getNav();
        const className = data[0].classification_name;
        res.render('./inventory/classification', {
        title: `${className} vehicles`,
        nav,
        grid,
        errors: null,
        });
    } catch (error) {
        console.error('Error in buildByClassificationId:', error.message);
        next(error);
    }
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
        errors: null,
    });
}

invCont.buildInvManager = async function (req, res) {
    let nav = await utilities.getNav();
    res.render('./inventory/managment', {
        title: 'Inventory Management',
        nav,
        errors: null,
    });
}

invCont.buildAddClass = async function (req, res) {
    let nav = await utilities.getNav();
    res.render('./inventory/add-classification', {
        title: 'Add Vehicle Classification',
        nav,
        errors: null,
    })
}

invCont.logAddClass = async function (req, res) {
    const {classification_name} = req.body;
    const logResult = await invModel.addClassification(classification_name);
    
    if (logResult) {
        req.flash('notice', `You have added ${classification_name} to the Vehicle Classification list. Please assign vehicles to this list.`);
        let nav = await utilities.getNav();
        res.status(201).render('./inventory/add-classification', {
            title: 'Add Vehicle Classification',
            nav,
            errors: null,
        });
    } else {
        req.flash('notice', 'Adding new classification failed.');
        res.status(501).render('./inventory/add-classification', {
            title: 'Add Vehicle Classification',
            nav,
        });
    }
}

invCont.buildAddInv = async function (req, res) {
    let nav = await utilities.getNav();
    let data = await invModel.getInvColumns();
    let form = await utilities.buildaddInvForm(data, {});
    const defaultValues = {};
    data.forEach(({ column_name }) => {
        defaultValues[column_name] = '';
    })
    res.render('./inventory/add-inventory', {
        title: "Add Inventory Item",
        form,
        nav,
        errors: null,
        locals: defaultValues,
    })
}

invCont.logAddInv = async function (req, res) {
    const { inv_miles, inv_price, inv_year, inv_description, inv_image, inv_thumbnail, inv_make, inv_color, inv_model, classification_id } = req.body;
    const logResult = await invModel.addInventory(inv_miles, inv_price, inv_year, inv_description, inv_image, inv_thumbnail, inv_make, inv_color, inv_model, classification_id);
    let nav = await utilities.getNav();
    let data = await invModel.getInvColumns();
    let form = await utilities.buildaddInvForm(data, {});
    if (logResult) {
        req.flash('notice', `You have added ${inv_make} ${inv_model} with Id ${logResult} to the Vehicle Inventory list.`);
        
        res.status(201).render('./inventory/add-inventory', {
            title: 'Add Inventory Item',
            form,
            nav,
            errors: null,
        });
    } else {
        req.flash('notice', 'Adding new inventory failed.');
        res.status(501).render('./inventory/add-inventory', {
            title: 'Add Inventory Item',
            form,
            nav,
        });
    }

}

module.exports = invCont;