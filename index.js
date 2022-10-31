const express = require('express');
const path = require('path');
const db = require('./create-tables');
const app = express();
const port = 3000;

// const cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const goalpagePath = __dirname + '/public/index.html'
const petpagePath = __dirname + '/public/select-pal.html'
const namepagePath = __dirname + '/public/name-pal.html'

const homepagePath = __dirname + '/public/home.html'

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(goalpagePath));
    // console.log(req.body);
})
var user = {};
// var globaldata = require('./globaldata.js');

app.post('/select-pal', (req, res) => {
    // console.log(req.body);
    user = req.body;
    db.run("INSERT INTO users (name, petType) values (?,?)", [name, age]);
    console.log(user)
    res.sendFile(path.join(petpagePath), user);
})

app.post('/home', (req, res) => {
    db.each("SELECT * FROM users", (err, row) => {
        console.log(row);
    });
    if (req.body.pet) {
        user.pet = req.body.pet
        console.log(user)
    }
    res.sendFile(path.join(homepagePath));
})


// data test environment
app.get("/data", (req, res) => {
    // console.log(JSON.stringify(user))
    res.json(user);
})



app.listen(port, () => {
    console.log(`philly-dips' monkey and otter server listening on port ${port} `)
});

// module.export = globaldata;