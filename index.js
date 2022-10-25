const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const formpagePath = __dirname + '/public/index.html'

const mainpagePath = __dirname + '/public/home.html'

app.use(express.static('public'));

app.get('/', (req, res)=> {
    res.sendFile(path.join(formpagePath));
    // console.log(req.body);
 })


app.post('/home',(req, res)=> {
    console.log(req.body);
    res.sendFile(path.join(mainpagePath));
})


app.listen(port, () => {
    console.log(`philly-dip listening on port ${port} `)
 });
 