const express = require('express');
const path = require('path');
const db = require('./create-tables');
const app = express();
const port = 3000;
// app.use(express.favicon(__dirname + '/public/favicon.ico')); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const namepagePath = __dirname + '/public/index.html'
const petpagePath = __dirname + '/public/select-pal.html'
const goalpagePath = __dirname + '/public/goal.html'
const homepagePath = __dirname + '/public/home.html'



app.get('/', (req, res) => {
    console.log(user)
    res.sendFile(path.join(namepagePath));
})
var user = {};

app.post('/select-pal', (req, res) => {
    // console.log(req.body);
    if (req.body) {
        user = req.body;
    }
    // db.run("INSERT INTO users (name) values (?)", [user.name]);
    console.log(user)
    res.sendFile(path.join(petpagePath));
})

app.post('/goal', (req, res) => {
    if (req.body.pet) {
        user.pet = req.body.pet;
    }
    // db.run("INSERT INTO users (petType) values (?)", [user.pet]);
    console.log(user);
    res.sendFile(path.join(goalpagePath));
})

app.post('/home', (req, res) => {
    // db.each("SELECT * FROM users", (err, row) => {
    //     console.log(row);
    // });
    console.log(req.body)
    if (req.body.goal) {
        user.goal = req.body.goal;
        console.log(user);
    }
    if (req.body.drank) {
        if(user.drank === undefined) {
            user.drank = req.body.drank;
        } else
        user.drank = Number(user.drank) + Number(req.body.drank);
        console.log(user);
    }
    res.sendFile(path.join(homepagePath));
})



// data test environment
app.get("/data", (req, res) => {
    // console.log(JSON.stringify(user))
    res.json(user);
})


app.listen(port, () => {
    console.log(`philly-dips' monkey and otter listening on port ${port} 🙊 🙈 🦦`);
});