'use strict'

let classificationList = document.querySelector('#classificationList')
classificationList.addEventListener('change', function () {
    let classification_id = classificationList.value
    console.log(`classification_id is: ${classification_id}`)
    let classIdURL = `/inv/getInventory/${classification_id}`
    fetch(classIdURL)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw Error('Network response was not OK')
    })
    .then(function (data) {
        console.log(data);
        buildInvList(data);
    })
    .catch(function (error) {
        console.log('There was a problem: ', error.message)
    })
})



function buildInvList(data) {
    let invDisplay = document.getElementById('inv-display');
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th></tr>';
    dataTable += '</thead>';
    dataTable += '<tbody>';
    
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    })

    dataTable += '</tbody>';

    invDisplay.innerHTML = dataTable;

}