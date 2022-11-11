const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL || `http://localhost:${port}/`

// import ejs and set view engine as ejs files
const ejs = require('ejs');
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// console logging rows for sql database
db.each("SELECT * FROM users", (err, row) => {
    // console.log(row);
});

app.get('/', (req, res) => {
    console.log(user)
    res.render("index.ejs");
})

let user = {};


// reset the current user (aka change the current user) 
app.post('/', (req, res) => {
    user = {};
    history.length = 0;
    res.render("index.ejs");
})


app.post('/select', (req, res) => {
    user.name = req.body.name;
    db.run("INSERT INTO users (name) values (?)", [user.name]);
    db.get(`SELECT * FROM users WHERE name=(?)`, [user.name], (err, row) => {
        user.id = row.id;
        console.log(row);
    })
    res.render("select-pal.ejs", { user });
})


app.post('/goal', (req, res) => {
    console.log(user)
    if (req.body.pet_type) {
        user.pet_type = req.body.pet_type;
        db.run(`UPDATE users SET pet_type=(?) WHERE name=(?)`, [user.pet_type, user.name]);
    }
    if (req.body.reset) {
        user.water_drank = 0;
        history.length = 0;
        db.run(`UPDATE users SET water_goal=(?) WHERE name=(?)`, [user.water_drank, user.name]);
        db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.water_drank, user.name]);
    }
    db.each("SELECT * FROM users", (err, row) => {
        console.log(row);
    });
    console.log(user);
    res.render("goal.ejs", { user });
})


app.get('/home', (req, res) => {
    res.render("home.ejs", { user });
});


app.post('/home', (req, res) => {
    if (req.body.water_goal) {
        user.water_goal = req.body.water_goal;
        // console.log(user);
        db.run(`UPDATE users SET water_goal=(?) WHERE name=(?)`, [user.water_goal, user.name]);
    }
    res.render("home.ejs", { user });
})


// data test environment
app.get("/data", (req, res) => {
    if (user.name) {
        db.get(`SELECT * FROM users WHERE name=(?)`, [user.name], (err, row) => {
            res.json(row)
        })
    }
})


//axios post reqeust to the data for water drank and to update the history
app.post("/data", (req, res) => {
    if (req.body.water_drank) {
        console.log(user.water_drank, req.body.water_drank)
        user.water_drank = req.body.water_drank;
        db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.water_drank, user.name]);
        console.log(user.water_drank);
    }
    res.send("sending monkey data 🐒");
})

history = []
app.get("/history", (req, res) => {
    res.json(user.history);
})

app.post("/history", (req, res) => {
    history.push(req.body.history[req.body.history.length - 1]);
    user.history = history;
    res.send("sending monkey data to your history 🐒");
})


app.get('/leaderboard', (req, res) => {
    db.run('UPDATE users SET score = ROUND((CAST([water_drank] AS FLOAT) / water_goal * 100))');
    db.all('SELECT * FROM users ORDER BY score DESC', (err, rows) => {
        res.render("leaderboard.ejs", { 'users': rows, 'user': user })
    });
})

app.get('/leaderboard-score', (req, res) => {
    db.all('SELECT * FROM users ORDER BY water_drank DESC', (err, rows) => {
        db.run('UPDATE users SET score = ROUND((CAST([water_drank] AS FLOAT) / water_goal * 100))')
        res.render("leaderboard.ejs", { 'users': rows, 'user': user })
    });
})


app.listen(port, () => {
    console.log(`philly-dips' monkey and otter listening on port ${port} 🙊 🙈 🦦`);
});
