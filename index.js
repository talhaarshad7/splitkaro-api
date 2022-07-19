const express = require('express');
const creategroup = require('./controllers/creategroup');
const addexpense = require('./controllers/addexpense');
const updateexpense = require('./controllers/updateexpense');
const deleteexpense = require('./controllers/deleteexpense');
const simplifyexpense = require('./controllers/simplifyexpense');
var AsyncLock = require('async-lock');
var path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
var lock = new AsyncLock();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));


const groups = [];
app.use(express.json());


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './home.html'));
});

app.get('/get-all', (req, res) => {
    res.send(groups);
})


app.post('/create-group', (req, res) => { creategroup.handlecreategroup(req, res, groups) })


app.post('/add-expense/:gname', (req, res) => { addexpense.handleaddexpense(req, res, groups) })


app.post('/update-expense/:gname', (req, res) => { updateexpense.handleupdateexpense(req, res, groups) })


app.delete('/delete-expense/:gname/:expense', (req, res) => { deleteexpense.handledeleteexpense(req, res, groups) })


app.get('/simplify/:gname', (req, res) => { simplifyexpense.handlesimplifyexpense(req, res, groups) })



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listnening on port ${port}...`));