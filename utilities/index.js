const invModel = require('../models/inventory-model');
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

module.exports = Util;