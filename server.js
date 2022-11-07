const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL || `http://localhost:${port}/`

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
    // console.log(row);
});

app.get('/', (req, res) => {
    console.log(user)
    res.sendFile(path.join(namepagePath));
})

var user = {};

// reset the current user (aka logout?) 
app.post('/', (req, res) => {
    user = {}
    res.sendFile(path.join(namepagePath));
})

app.get('/select', (req, res) => {
    res.sendFile(path.join(petpagePath));
})

app.post('/select', (req, res) => {
    // console.log(req.body)
    user.name = req.body.name;
    // db.run("INSERT INTO users (name) values (?)", [user.name]);
    db.run("INSERT INTO users (name) values (?)", [user.name]);
    db.get(`SELECT * FROM users WHERE name=(?)`, [user.name], (err, row) => {
        user.id = row.id;
        console.log(row);
        // console.log(user);
    })
    if (req.body.name) {
        // db.each("SELECT * FROM users WHERE id=(?)", [user.id] , (err, row) => {
        //     // console.log(row);
        //     console.log('xxxxxxxxxxxxxx')
        //     var x = row.id;
        //     console.log(x);
        // });
    }

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

// don't have a signup page right now so useless
app.post('/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    db.run("INSERT INTO users (user_name, password) values (?, ?)", [username, password]);

    db.each("SELECT * FROM users ", (err, row) => {
        console.log(row)
    });

    res.sendFile(path.join(namepagePath));
})


app.get('/home', (req, res) => {
    res.sendFile(path.join(homepagePath));
});

app.post('/home', (req, res) => {
    if (req.body.goal) {
        user.goal = req.body.goal;
        // console.log(user);
        db.run(`UPDATE users SET water_goal=(?) WHERE name=(?)`, [user.goal, user.name]);
    }

    // if (req.body.drank) {
    //     if (user.drank === undefined) {
    //         user.drank = req.body.drank;
    //         db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.drank, user.name]);
    //     } else {
    //         user.drank = Number(user.drank) + Number(req.body.drank);
    //         db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.drank, user.name]);
    //     }
    //     // console.log(user);
    //     // res.render('/home.html')
    // }
    res.sendFile(path.join(homepagePath));
})



// data test environment
app.get("/data", (req, res) => {
    // console.log(req.body)
    if (user.name) {
        db.get(`SELECT * FROM users WHERE name=(?)`, [user.name], (err, row) => {
            // user.id = row.id;
            res.json(row)
        })
    }
    // else {
    //     db.get(`SELECT * FROM users WHERE id=1`, (err, row) => {
    //         user.id = row.id;
    //         res.json(row)
    //     })
    // }
    // // console.log(JSON.stringify(user))
    // res.json(user);
})

//axios post request for water
app.post("/data", async (req, res) => {
    // console.log(req.body)
    if (req.body.water_drank) {
        console.log(user.water_drank, req.body.water_drank)
        user.water_drank = req.body.water_drank;
        db.run(`UPDATE users SET water_drank=(?) WHERE name=(?)`, [user.water_drank, user.name]);
        console.log(user.water_drank);
    }
    res.send("sending monkey data 🐒");
    // console.log(user)
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
    // console.log(`philly-dips' monkey and otter listening on port ${port} 🙊 🙈 🦦`);
    console.log(`philly-dips' monkey and otter listening on port ${port} 🙊 🙈 🦦`);
});
