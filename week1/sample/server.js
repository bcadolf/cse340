/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    This is an application server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const express = require('express');
const app = express();
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Default GET route
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.get("/", (req, res) => {res.send("Welcome home!")})
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Server host port and name
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const PORT = 3000;
const HOST = 'localhost';
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Log statments to confirm server operation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.listen(PORT, () => {
    console.log(`trial app listening on ${HOST}:${PORT}`)
}) 