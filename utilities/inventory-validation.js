const utilities = require('./index');
const { body, validationResult } = require('express-validator');
const invModel = require('../models/inventory-model');
const validate = {};


// add class rules
validate.addClassRules = () => {
    return [
        body('classification_name')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Classification name is required.')
            .isAlphanumeric()
            .withMessage('Username must include only letters or numbers and no spaces.')
            .custom(async (classification_name) => {
                const classFound = await invModel.checkForClass(classification_name);
                if (classFound) {
                    throw new Error('Classification already exists.')
                }
            })
    ]
}

// adding class checker
validate.checkAddClass = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('./inventory/add-classification', {
            errors,
            title: 'Add Vehicle Classification',
            nav,
        })
        return;
    }
    next();
}

// add inventory item rules
validate.addInvRules = () => {
    return [
            body('inv_miles')
                .trim()
                .escape()
                .notEmpty()
                .isNumeric()
                .withMessage('Miles must be a valid number'),
            body('inv_price')
                .trim()
                .escape()
                .notEmpty()
                .isFloat({ min: 0 })
                .withMessage('Price must be a valid positive number'),
            body('inv_year')
                .trim()
                .escape()
                .notEmpty()
                .isInt({ min: 1886, max: new Date().getFullYear() })
                .withMessage('Year must be a valid year between 1886 and the current year'),
            body('inv_description')
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 5 })
                .withMessage('Description must be more that 5 characters'),
            body('inv_image')
                .trim()
                .notEmpty()
                .withMessage('Image path required')
                .custom(value => {
                    if (!value.startsWith('/images/')) {
                        throw new Error('The path must start with "/images".')
                    }
                    return true;
                }),
            body('inv_thumbnail')
                .trim()
                .notEmpty()
                .withMessage('Thumbnail path required')
                .custom(value => {
                    if (!value.startsWith('/images/')) {
                        throw new Error('The path must start with "/images".')
                    }
                    return true;
                }),
            body('inv_make')
                .trim()
                .escape()
                .notEmpty()
                .withMessage('Make required'),
            body('inv_color')
                .trim()
                .escape()
                .notEmpty()
                .withMessage('Color must not be empty'),
            body('inv_model')
                .trim()
                .escape()
                .notEmpty()
                .withMessage('Model must not be empty'),
            body('classification_id')
                .trim()
                .escape()
                .notEmpty()
                .isInt()
                .withMessage('Classification ID must be a valid integer'),
    ]
}

// validation checker for adding inventory 
validate.checkAddInv = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        let data = await invModel.getInvColumns();
        let form = await utilities.buildaddInvForm(data, req.body);
        let nav = await utilities.getNav();
        res.render('./inventory/add-inventory', {
            errors,
            title: 'Add Inventory Item',
            form,
            nav,
            ...req.body,
        })
        return;
    }
    next();
}




module.exports = validate;