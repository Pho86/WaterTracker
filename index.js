const express = require('express');

const path = require('path')
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const formpagePath = __dirname + '/public/index.html'

const mainpagePath = __dirname + '/public/home.html'

app.use(express.static('public'));

app.get('/', (req, res)=> {
    res.sendFile(path.join(formpagePath));
 })


app.post('/home',(req, res)=> {
    res.sendFile(path.join(mainpagePath));
})


app.listen(3000)