const express = require('express');
const path = require('path');
const db = require('./create-tables');
const app = express();
const port = 3000;

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

app.post('/', (req,res) => {
    user = {}
    res.sendFile(path.join(namepagePath));
})

app.post('/select-pal', (req, res) => {
    if (req.body) {
        user = req.body;
    }
    // db.run("INSERT INTO users (name) values (?)", [user.name]);
    // const x = db.run("SELECT * FROM users");
    // console.log(x)
    // db.each("SELECT * FROM users WHERE " , (err, row) => {
    //     console.log(row)
    // });

    // console.log(req.body);
    
    // console.log(user)
    res.sendFile(path.join(petpagePath));
})

app.post('/goal', (req, res) => {

    db.each("SELECT * FROM users", (err, row) => {
        console.log(row);
    });

    if (req.body.pet) {
        user.pet = req.body.pet;
    }
    if (req.body.reset) {
        user.drank = 0;
    }
    // db.run("INSERT INTO users (petType) values (?)", [user.pet]);
    console.log(user);
    res.sendFile(path.join(goalpagePath));
})

app.post('/home', (req, res) => {

    db.each("SELECT * FROM users", (err, row) => {
        console.log(row);
    });

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
        // res.render('/home.html')
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