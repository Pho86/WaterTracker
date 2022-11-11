const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db');


db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(20), 
    pet_type varchar(15), 
    water_drank int DEFAULT 0, 
    water_goal int DEFAULT 0,
    score int
    )`
);

// user_name varchar(15), 
// password varchar(15),
// doesn't have an authentication system so not saving username or password 


module.exports = db;