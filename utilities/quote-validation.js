const utilities = require('./index');
const { body, validationResult } = require('express-validator');
const quoteModel = require('../models/quote-model');
const { buildQuoteResponse } = require('../controllers/quoteCtrl');
const validate = {};


validate.quoteRules = () => {
    return [
        body('quote_asking_price')
            .trim()
            .escape()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage('Price must be a valid positive number'),
        body('quote_miles')
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage('Miles must be a valid number'),
        body('quote_year')    
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 1886, max: new Date().getFullYear() })
            .withMessage('Year must be a valid year between 1886 and the current year'),
        body('quote_color')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Color must not be empty'),
        body('quote_condition')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage('Description must be more that 5 characters'),
        body('quote_vin')
            .trim()
            .notEmpty()
            .withMessage('VIN is required')
            .isLength({ min: 17, max: 17 })
            .withMessage('VIN must be exactly 17 characters')
            .matches(/^[A-HJ-NPR-Z0-9]+$/)
            .withMessage('VIN can only contain letters (except I,O,Q) and numbers')
            .custom((value) => {
                // Additional check for I, O, Q
                if (/[IOQ]/i.test(value)) {
                    throw new Error('VIN cannot contain I, O, or Q');
                }
                return true;
            })
            .toUpperCase(), // Convert to uppercase
        body('quote_firstname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage('Please provide a first name.'),
        body('quote_lastname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2})
            .withMessage('Please provide a last name.'),
        body('quote_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),
        body('quote_phone')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
            .matches(/^\d{3}-\d{3}-\d{4}$/)
            .withMessage('Phone must be in format: 123-456-7890'),
        body('quote_make')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Make required'),
        body('quote_model')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Model must not be empty'),
    ]
}

validate.checkChangeQuote = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req)

    if (!errors.isEmpty()) {
            let nav = await utilities.getNav();
            const quote_id = req.body.quote_id;
            const response = await quoteModel.checkQuote(quote_id);
            let table;
            let form = '';
            if (response.quote_offer_price === null) {
                form = await utilities.changeQuoteForm(response);
                table = '<p>No response yet please check back later.'
            } else {
                table = await utilities.buildQuoteTable(response);
            }
            
            res.render('./quotes/response', {
                title: 'Quote Response',
                nav,
                form,
                table,
                errors,
            })
            return
        }
        next();
}

validate.checkNewQuote = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const schema = await quoteModel.getSchema();
        const form = await utilities.buildNewQuoteForm(schema);
        res.render('./quotes/request', {
            title: 'Request A Quote',
            form,
            nav,
            errors: null,
        })
        return
    }
    next();
}

module.exports = validate;