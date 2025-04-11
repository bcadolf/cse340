const utilities = require('../utilities/index');
const quoteModel = require('../models/quote-model');
const quoteCont = {};


// build quotes request page
quoteCont.buildQuoteReq = async function (req, res) {
        let nav = await utilities.getNav();
        const schema = await quoteModel.getSchema();
        const form = await utilities.buildNewQuoteForm(schema);
        res.render('./quotes/request', {
            title: 'Request A Quote',
            form,
            nav,
            errors: null,
        })
};

quoteCont.logNewQuote = async function (req, res) {
    const { quote_asking_price, quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model } = req.body;
    const logResult = await quoteModel.newQuote(quote_asking_price,quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model);
    const nav = await utilities.getNav();
    const schema = await quoteModel.getSchema();
    const form = await utilities.buildNewQuoteForm(schema);
    if (logResult) {
        req.flash('notice', `Thank you for submitting your request you may view the response on your account (please signup if needed) and use the request ID: ${logResult} to view the quote.`)
        res.status(201).render('./account/login', {
        title: 'Login',
        form,
        nav,
        errors: null,
        });
    } else {
        req.flash('notice', 'Quote request failed. Please try again.');
        res.status(501).render('./quotes/request', {
            title: 'Request A Quote',
            nav,
            form,
            errors,
        });
    }
}

quoteCont.buildManageQuote = async function (req, res) {
    let nav = await utilities.getNav();
    const quotes = await quoteModel.viewQuotes();
    const table = await utilities.buildQuoteList(quotes);
    res.render('./quotes/manage', {
        title: 'Pending Quotes',
        table,
        nav,
        errors: null,
    })
}

quoteCont.buildProcessQuote = async function (req, res) {
    const quote_id = req.params.quote_id;
    let nav = await utilities.getNav();
    const quote = await quoteModel.checkQuote(quote_id);
    
    const table = await utilities.buildQuoteTable(quote);
    res.render('./quotes/process', {
        title: 'Process Quote',
        table,
        nav,
        errors: null,
        quote_id,
        quote_offer_price: quote.quote_offer_price,
    })
}

quoteCont.logProcessQuote = async function (req, res) {
    const { quote_id, quote_offer_price} = req.body;
    const logResult = await quoteModel.processQuote(quote_id, quote_offer_price);
    if (logResult) {
        req.flash('notice', "Quote has been processed.")
        let nav = await utilities.getNav();
        const quotes = await quoteModel.viewQuotes();
        const table = await utilities.buildQuoteList(quotes);
        res.status(201).render('./quotes/manage', {
            title: 'Pending Quotes',
            table,
            nav,
            errors: null,
        })
    } else {
        req.flash('notice', 'Adding new inventory failed.');
        const quote_id = req.params.quote_id;
        let nav = await utilities.getNav();
        const quote = await quoteModel.checkQuote(quote_id);
        const table = await utilities.buildQuoteTable(quote);
        res.status(501).render('./quotes/process', {
            title: 'Process Quote',
            table,
            nav,
            errors: null,
            quote_id,
            quote_offer_price: quote.quote_offer_price,
        })
    }
}

quoteCont.buildQuoteResponse = async function (req, res) {
    const quote_id = req.params.quote_id;
    let nav = await utilities.getNav();
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
        errors: null,
    })
}

quoteCont.logQuoteChange = async function (req, res) {
    const {quote_asking_price, quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model, quote_id} = req.body;
    const logResult = await quoteModel.changeQuote(quote_id, quote_asking_price, quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model);
    let nav = await utilities.getNav()
    const response = await quoteModel.checkQuote(quote_id);
    let table;
    let form = '';
    if (response.quote_offer_price === null) {
        form = await utilities.changeQuoteForm(response);
        table = '<p>No response yet please check back later.'
    } else {
        table = await utilities.buildQuoteTable(response);
    }
    if (logResult) {
        req.flash('notice', 'Quote has been updated.')
        res.status(201).render('./quotes/response', {
            title: 'Quote Response',
            nav,
            form,
            table,
            errors: null,
        })
    } else {
        req.flash('notice', 'Update failed please try again.')
        this.buildQuoteResponse
    }
}



module.exports = quoteCont;