const invModel = require('../models/inventory-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Util = {};

// build navigation and dynamic function
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = '<ul>';
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += '<li>';
        list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`
        list += '</li>'
    });
    list += '</ul>';
    return list;
}

// build classification view html grid
Util.buildClassificationGrid = async function(data){
    let grid;
    if (data.length > 0) {
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>`
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a>`
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles found.</p>'
    }
    return grid
}

Util.buildByInvId = async function (data) {
  let display;
  const car = data[0]
  if (data[0]) {
    display = `<div id="details-cont">
    <h2>${car.inv_make} ${car.inv_model}</h2>
    <div class="car-details">
      <ul>
        <li>Mileage: ${car.inv_miles.toLocaleString('en-US')}</li>
        <li>Exterior Color: ${car.inv_color}</li>
        <li>Year: ${car.inv_year}</li>
      </ul>
    </div>
    <div class="car-desc">
      <h3>About</h3>
      <p>${car.inv_description}</p>
    </div>
    <div class="car-img">
      <img src="${car.inv_image}" alt="Image of ${car.inv_make} ${car.inv_model}">
      <p>ONLY! $${new Intl.NumberFormat('en-US').format(car.inv_price)}</p>
    </div>
    </div>
    `
    
  } else {
      display = '<p>Sorry details unable to be found online please call for info.</p>'
  }
  return display;
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

Util.buildaddInvForm = async function (data, values = {}) {
  let form = '<form class="account-form" action="/inv/add-inv" method="post">';
  data.forEach(({ column_name, data_type }) => {
    let inputType = 'text';

    if (['integer'].includes(data_type)) {
      inputType = 'number'
    } else if (['numeric'].includes(data_type)) {
      inputType = 'number" step="any'
    }
    const value = values[column_name] || '';
    form += `
      <label for="${column_name}">${column_name}:</label>
      <input type="${inputType}" id="${column_name}" name="${column_name}" required value="${value}"><br>`
  });
  form += await Util.buildClassificationList();
  form += '<button type="submit">Add to Inventory</button></form>'
  return form;
}

Util.checkWebToken = async function (req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function(err, accountData) {
        if (err) {
          req.flash('Please Log In')
          res.clearCookie('jwt')
          return res.redirect('/account/login')
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

Util.checkLoginSuccess = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash('notice', 'Please login')
    return res.redirect('/account/login')
  }
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;