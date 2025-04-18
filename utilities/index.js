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

Util.buildEditInvForm = async function (data, inv_id) {
  // start form
  let form = `<form class="account-form" action="/inv/edit/${inv_id}" method="post">`;
  // go through data to build each input and label
  data.forEach((data) => {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // block class id since it is called below
        if (key === 'classification_id') {
          continue;
        }
        
        const value = data[key];
        let inputType = 'text';
        let stepAttribute = '';
        // hide the inv id since we do not want that changed
        if (key === "inv_id") {
          inputType = 'hidden'
          form += `
              <input type="${inputType}" id="${key}" name="${key}" required value="${value}" ><br>`
              continue
        }
        // redifine all others as needed and assign values
        if (typeof value === 'number') {
          inputType = 'number';
          stepAttribute = value % 1 !== 0 ? 'step="any"' : '';
        } else if (typeof value === 'string') {
          inputType = 'text';
        }
        form += `
              <label for="${key}">${key}:</label>
              <input type="${inputType}" ${stepAttribute} id="${key}" name="${key}" required value="${value}" ><br>`
      }
    }
  });
  form += await Util.buildClassificationList();
  form += '<button disabled type="submit">Edit Item</button></form>'
  return form;
}

Util.buildDeleteInvForm = async function (data, inv_id) {
  // start form
  let form = `<form class="account-form" action="/inv/delete/${inv_id}" method="post">`;

  // go through data to build each input and label
  data.forEach((data) => {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // only run needed values
        if (key === 'inv_id' || key === 'inv_make' || key === 'inv_model' || key === 'inv_year' || key === 'inv_price') {
          const value = data[key];
          let inputType = 'text';
          let stepAttribute = '';
          // hide the inv id since we do not want that changed
          if (key === "inv_id") {
            inputType = 'hidden'
            form += `
                <input type="${inputType}" id="${key}" name="${key}" required value="${value}" ><br>`
                continue
          }
          // redifine all others as needed and assign values
          if (typeof value === 'number') {
            inputType = 'number';
            stepAttribute = value % 1 !== 0 ? 'step="any"' : '';
          } else if (typeof value === 'string') {
            inputType = 'text';
          }
          form += `
                <label for="${key}">${key}:</label>
                <input type="${inputType}" ${stepAttribute} id="${key}" name="${key}" readonly value="${value}" ><br>`
        }
      }
    }
  });
  form += '<button type="submit" title="This cannot be reversed">Delete Item</button></form>'
  return form;
}

Util.checkAuthorization = function (loggedin, account_type) {
    if (!loggedin) {
      req.flash('notice', 'Please login to your account.')
      return false;
    } 

    if (account_type === 'Employee' || account_type === 'Admin') {
      return true;
    }

    return false;
}

Util.verifyAuthAccess = async function (req, res, next) {
    try {
        const account_type = res.locals.accountData.account_type
        const loggedin = res.locals.loggedin || false;
        const isAuth = await Util.checkAuthorization(loggedin, account_type)

        if (!isAuth) {
          req.flash('notice', 'You do not have permission to access this function. If seen in error please bribe your tech support with fresh donuts to expedite the fix.')
          return res.status(403).redirect('/account')
            
        } else {
          return next()
        }
    } catch (err) {
        req.flash('notice', 'Invalid or expired session. Please log in again.');
        return res.status(401).redirect('/account/login');
    }

}

// form to submit a new quote
Util.buildNewQuoteForm = async function (schema) {
  let form = '<form id="new-quote" class="account-form" action="/quotes/request" method="post">';

  // build form dynamically from data
  schema.forEach((column) => {
    const {column_name, data_type} = column;
    const value = '';
    let inputType = 'text';
    let stepAttribute = '';
    // ignore autogen and employee sections
    if (column_name === 'quote_id' || column_name === 'quote_offer_price') {
      return;
    }
    //redefine input types
    if (data_type === 'integer' || data_type === 'numeric') {
      inputType = 'number';
      stepAttribute = data_type === 'numeric' ? 'step="any"' : '';
    }


    const formatName = column_name
      .replace(/^quote_/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    form += `
      <label for="${column_name}">${formatName}:</label>
      <input type="${inputType}" id="${column_name}" name="${column_name}" required value="${value}"><br>`;
  });
  form += '<button disabled type="submit">Request Quote</button>'
  form += '</form>';
  return form;
};

//horizontal quote table changed to vertical left if needed
// Util.buildQuoteTable = async function (data) {
//   if (!Array.isArray(data)) {
//     // If data is a single object, wrap it in an array
//     data = [data];
//   }
  
//   let table = '<table class="quote-table">'
//   // build table headers
//   table += '<thead><tr>';
//   const headers = Object.keys(data[0]);
//   headers.forEach((header) => {
//     const formatHeader = header
//       .replace(/^quote_/, '')
//       .replace(/_/g, ' ')
//       .replace(/\b\w/g, (char) => char.toUpperCase());
//     table += `<th>${formatHeader}</th>`;
//   });
//   table += '</tr></thead>';
//   // build table rows
//   table += '<tbody>'
//   data.forEach((row) => {
//     table += '<tr>';
//     headers.forEach((header) => {
//       let value = row[header];
//       if (typeof value === 'number') {
//         value = new Intl.NumberFormat('en-US').format(value);
//       }
//       table += `<td>${value || ''}</td>`;
//     });
//     table += `</tr>`;
//   });
//   table += '</tbody>';
//   table += '</table>';

//   return table;
// };

Util.buildQuoteTable = async function (data) {
  if (!data || typeof data !== 'object') {
    // If data is invalid, return a fallback message
    console.error("Invalid data provided.");
    return '<p>No data available.</p>';
  }

  // Wrap data in an array if it is not already an array
  if (!Array.isArray(data)) {
    data = [data];
  }

  let table = '<table class="quote-table">';

  // Build vertical table rows 
  table += '<tbody>';
  const headers = Object.keys(data[0]); 
  headers.forEach((header) => {
    const formattedHeader = header
      .replace(/^quote_/, '') 
      .replace(/_/g, ' ') 
      .replace(/\b\w/g, (char) => char.toUpperCase()); 

    // Create a new table row for each header
    table += '<tr>';
    table += `<th>${formattedHeader}</th>`; 
    table += '<td>'; 
    data.forEach((row) => {
      let value = row[header];
      if (typeof value === 'number') {
        value = new Intl.NumberFormat('en-US').format(value); 
      } else if (value === null) {
        value = 'N/A'; 
      }
      table += `${value || ''}<br>`; 
    });
    table += '</td>';
    table += '</tr>';
  });
  table += '</tbody>';

  table += '</table>';
  return table;
};

Util.changeQuoteForm = async function (data) {
  if (!data || typeof data !== 'object') {
    // If data is invalid, return a fallback message
    console.error("Invalid data provided.");
    return '<p>No data available.</p>';
  }

  // Wrap data in an array if it is not already an array
  if (!Array.isArray(data)) {
    data = [data];
  }
  let form = '<form id="change-quote" class="account-form" action="/quotes/update" method="post">';

  // build form dynamically from data
  data.forEach((item) => {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        // only run needed values
        if (key !== 'quote_offer_price' ) {
          const value = item[key];
          let inputType = 'text';
          let stepAttribute = '';
          // hide the inv id since we do not want that changed
          if (key === "quote_id") {
            inputType = 'hidden'
            form += `
                <input type="${inputType}" id="${key}" name="${key}" required value="${value}" ><br>`
                continue
          }
          // redifine all others as needed and assign values
          if (typeof value === 'number') {
            inputType = 'number';
            stepAttribute = value % 1 !== 0 ? 'step="any"' : '';
          } else if (typeof value === 'string') {
            inputType = 'text';
          }

          const formatName = key
            .replace(/^quote_/, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
          form += `
                <label for="${key}">${formatName}:</label>
                <input type="${inputType}" ${stepAttribute} id="${key}" name="${key}" value="${value}" ><br>`
        }
      }
    }
  });
  form += '<button disabled type="submit">Adjust Information</button>';
  form += '</form>';
  return form;
};

Util.buildQuoteList = async function (quotes) {
    if (!quotes.length) {
      return '<p> No quotes to review.</p>'
  }
  let table = `
  <table>
    <thead>
      <tr>
        <th>Quote ID</th>
        <th>Make</th>
        <th>Model</th>
        <th>Lastname</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
`;

  quotes.forEach((quote) => {
    table += `
      <tr>
        <td>${quote.quote_id}</td>
        <td>${quote.quote_make}</td>
        <td>${quote.quote_model}</td>
        <td>${quote.quote_lastname}</td>
        <td><a href="/quotes/process/${quote.quote_id}">Process Quote</a></td>
      </tr>
    `;
  });

  table += `
      </tbody>
    </table>
  `;

  return table;

}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;