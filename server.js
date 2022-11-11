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
    user = {}
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
    if (req.body.pet) {
        user.pet = req.body.pet;
        db.run(`UPDATE users SET pet_type=(?) WHERE name=(?)`, [user.pet, user.name]);
    }
    if (req.body.reset) {
        user.water_drank = 0;
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
    if (req.body.goal) {
        user.goal = req.body.goal;
        // console.log(user);
        db.run(`UPDATE users SET water_goal=(?) WHERE name=(?)`, [user.goal, user.name]);
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
app.post("/data", async (req, res) => {
    // console.log(req.body)
    if (req.body.water_drank) {
        console.log(user.water_drank, req.body.water_drank)
        user.water_drank = req.body.water_drank;
        db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.water_drank, user.name]);
        console.log(user.water_drank);
    }
    if (req.body.history) {
        user.history = req.body.history;
        // console.log(user.water_drank, req.body.water_drank); 
    }
    res.send("sending monkey data 🐒");
})

let scoreboard = [];
app.get('/leaderboard', async (req, res) => {
    db.each("SELECT * FROM users", (err, row) => {
        scoreboard[row.id - 1] = row
        // console.log(board)
    });

    sorter = scoreboard
    for (let i = 0; i < sorter.length; i++) {
        console.log(sorter[i])
        sorter[i].score = Math.round((sorter[i].water_drank / sorter[i].water_goal) * 100)
    }
    res.send(sorter)
    // res.render("leaderboard.ejs", {sorter})
    // res.send(sorter.map((o,i)=> {(
    //     `<p>${o}</p>`
    // )}))
    // console.log(scoreboard)
    // await res.json(scoreboard)
    // res.send(board.map(user => {
    //     `<h1>${user.name}</h1><br>
    //     <p>${user.water_drank}/${user.water_goal}
    //     `
    // }).join(' ')
    // )
})

app.listen(port, () => {
    console.log(`philly-dips' monkey and otter listening on port ${port} 🙊 🙈 🦦`);
});
