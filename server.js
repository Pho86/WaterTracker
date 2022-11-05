const express = require('express');
const path = require('path');
const db = require('./create-tables');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//directories for each page path 
const namepagePath = __dirname + '/public/index.html'
const splashpagePath = __dirname + '/public/splash.html'
const petpagePath = __dirname + '/public/select-pal.html'
const goalpagePath = __dirname + '/public/goal.html'
const homepagePath = __dirname + '/public/home.html'

// console logging rows for sql database
db.each("SELECT * FROM users", (err, row) => {
    console.log(row);
});

app.get('/', (req, res) => {
    console.log(user)
    res.sendFile(path.join(splashpagePath));
})

var user = {};

// reset user
app.post('/', (req, res) => {
    user = {}
    res.sendFile(path.join(namepagePath));
})

app.get('/select', (req, res) => {
    res.sendFile(path.join(petpagePath));
})

app.post('/select', (req, res) => {
    console.log(req.body)
    if (req.body.name) {
        // db.each("SELECT * FROM users WHERE id=(?)", [user.id] , (err, row) => {
        //     // console.log(row);
        //     console.log('xxxxxxxxxxxxxx')
        //     var x = row;
        //     console.log(x);
        // });
        user.name = req.body.name;
        db.run("INSERT INTO users (name) values (?)", [user.name]);
        db.get(`SELECT * FROM users WHERE name=(?)`, [user.name], (err, row) => {
            console.log(row)
            user.id = row.id
            console.log(user)
        }
        )
    }
    // db.all("SELECT * FROM users WHERE name = ?", [req.body.name], (err, foundUser) => {
    //     console.log(foundUser)
    // });
    // let x = db.run("SELECT * FROM users")
    // console.log(x)
    // const x = db.run("SELECT * FROM users");
    // console.log(x)
    db.each("SELECT * FROM users WHERE " , (err, row) => {
        console.log(row)
    });

    res.sendFile(path.join(petpagePath));
})

app.post('/goal', (req, res) => {
    console.log(user)
    if (req.body.pet) {
        user.pet = req.body.pet;
        db.run(`UPDATE users SET pet_type=(?) WHERE name=(?)`, [user.pet, user.name]);
    }
    if (req.body.reset) {
        user.drank = 0;
        db.run(`UPDATE users SET water_goal=(?) WHERE name=(?)`, [user.drank, user.name]);
        db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.drank, user.name]);

    }
    db.each("SELECT * FROM users", (err, row) => {
        console.log(row);
    });
    console.log(user);
    res.sendFile(path.join(goalpagePath));
})


app.post('/home', (req, res) => {
    
    // console.log(req.body)
    if (req.body.goal) {
        user.goal = req.body.goal;
        // console.log(user);
        db.run(`UPDATE users SET water_goal=(?) WHERE name=(?)`, [user.goal, user.name]);
    }
    
    if (req.body.drank) {
        if (user.drank === undefined) {
            user.drank = req.body.drank;
            db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.drank, user.name]);
        } else {
            user.drank = Number(user.drank) + Number(req.body.drank);
            db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.drank, user.name]);
        }
        // console.log(user);
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