const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db');


db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name varchar(15),
    password varchar(15),
    name varchar(20), 
    pet_type varchar(15), 
    water_drank int, 
    water_goal int
    )`
);


module.exports = db;